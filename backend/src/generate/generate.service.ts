import { Injectable, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
import { registerHandlebarsHelpers, resolveAssetUrl } from '../utils/handlebarsHelpers';
import { addGoogleFontsAndStyles } from '../utils/htmlUtils';
import { TemplateService } from '../template/template.service';
import { BrandService } from '../brand/brand.service';
import { Brand } from '../brand/entities/brand.entity';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription, SubscriptionStatus } from '../billing/entities/subscription.entity';
import { Repository } from 'typeorm';
import { UsageMonthly } from '../billing/entities/usage-monthly.entity';

interface GenerateImageData {
  [key: string]: unknown;
}

interface GenerateFromDatabaseData {
  templateName: string;
  brandName: string;
  templateVariables?: Record<string, unknown>;
}

@Injectable()
export class GenerateService {
  constructor(
    private readonly templateService: TemplateService,
    private readonly brandService: BrandService,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(UsageMonthly)
    private readonly usageMonthlyRepository: Repository<UsageMonthly>,
  ) {}

  async generateImage(
    html: string,
    data: GenerateImageData,
    width: number,
    height: number,
    googleFontsLinks: string,
  ): Promise<Buffer> {
    if (!html) {
      throw new InternalServerErrorException('HTML content is required');
    }

    registerHandlebarsHelpers();
    const template = Handlebars.compile(html);
    const content = template(data);

    // Determine Chrome/Chromium executable path
    // In production (Docker/Alpine), use system Chromium
    // In development, let Puppeteer use its bundled Chrome
    const executablePath = process.env.CHROME_BIN || 
      (process.env.NODE_ENV === 'production' ? '/usr/bin/chromium-browser' : undefined);

    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath,
      args: [
        `--window-size=${width},${height}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
      ],
    });

    try {
      const page = await browser.newPage();
      await page.setBypassCSP(true);
      await page.setDefaultNavigationTimeout(30000);
      await page.setDefaultTimeout(30000);
      page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
      page.on('requestfailed', (request) => {
        console.log('REQUEST FAILED:', request.url(), request.failure());
      });
      page.on('response', (response) => {
        if (response.status() >= 400) {
          console.log('RESPONSE ERROR:', response.url(), response.status());
        }
      });
      await page.setViewport({ width, height });
      const fullHtml = addGoogleFontsAndStyles(content, googleFontsLinks);
      await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
      // Studio preview clips overflow to the template "frame". Do the same in exports:
      // - avoid fullPage=true (it expands capture to include overflow content)
      // - force overflow hidden and clip exactly to width/height
      await page.addStyleTag({
        content: `
          html, body {
            overflow: hidden !important;
          }
        `,
      });

      const clipWidth = Math.max(1, Math.round(width));
      const clipHeight = Math.max(1, Math.round(height));
      const screenshot = await page.screenshot({
        type: 'png',
        fullPage: false,
        clip: { x: 0, y: 0, width: clipWidth, height: clipHeight },
      });
      return Buffer.from(screenshot);
    } finally {
      await browser.close();
    }
  }

  async generateImageFromDatabase(data: GenerateFromDatabaseData, user: User): Promise<Buffer> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { user: { id: user.id }, status: SubscriptionStatus.ACTIVE },
      relations: ['plan'],
    });

    if (!subscription) {
      throw new ForbiddenException('No active subscription found.');
    }

    const plan = subscription.plan;
    if (plan.imageLimitMonthly === -1) {
      // Unlimited plan
    } else {
      const today = new Date();
      const monthYear = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

      let monthlyUsage = await this.usageMonthlyRepository.findOne({
        where: {
          user: { id: user.id },
          monthYear: monthYear,
        },
      });

      if (!monthlyUsage) {
        monthlyUsage = this.usageMonthlyRepository.create({
          user,
          monthYear: monthYear,
          imagesGenerated: 0,
        });
      }

      if (plan.imageLimitMonthly !== 0 && monthlyUsage.imagesGenerated >= plan.imageLimitMonthly) {
        throw new ForbiddenException('Monthly generation limit reached.');
      }

      monthlyUsage.imagesGenerated += 1;
      await this.usageMonthlyRepository.save(monthlyUsage);
    }

    try {
      const template = await this.templateService.findByNameForUser(data.templateName, user.id);
      const dbBrand = await this.brandService.findByNameForUser(data.brandName, user.id);

      const width = template.layout?.width || 1024;
      const height = template.layout?.height || 1024;
      const googleFontsLinks = this.generateGoogleFontsLinks(dbBrand);

      // Transformer l'array imageGroups en objet, comme le faisait le frontend
      const imageGroupsByName = (dbBrand.imageGroups || []).reduce(
        (acc: Record<string, { name: string; url: string }[]>, group) => {
          if (group.groupName) {
            const raw = Array.isArray(group.images_url) ? group.images_url : [];
            acc[group.groupName] = raw.map((u: string, idx: number) => ({
              name: `image_${idx + 1}`,
              url: resolveAssetUrl(u),
            }));
          }
          return acc;
        },
        {},
      );

      // Construire manuellement un objet "brand" propre pour le template
      // pour garantir la bonne structure des données
      const templateBrand = {
        ...dbBrand,
        // Normaliser les URLs d'images courantes en absolu (évite les URLs relatives dans Puppeteer)
        logoUrl: resolveAssetUrl((dbBrand as any).logoUrl),
        logoIconUrl: resolveAssetUrl((dbBrand as any).logoIconUrl),
        logoLineUrl: resolveAssetUrl((dbBrand as any).logoLineUrl),
        imageGroups: imageGroupsByName,
      };

      const templateData = {
        ...data.templateVariables,
        brand: templateBrand,
      };

      return await this.generateImage(template.html, templateData, width, height, googleFontsLinks);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to generate image: ${error.message}`);
    }
  }

  private generateGoogleFontsLinks(brand: Brand): string {
    const fonts = new Set<string>();
    if (brand.titleFont) fonts.add(brand.titleFont);
    if (brand.textFont) fonts.add(brand.textFont);
    if (brand.tertiaryFont) fonts.add(brand.tertiaryFont);
    if (fonts.size === 0) return '';
    const fontFamilies = Array.from(fonts)
      .map((font) => font.replace(/\s+/g, '+'))
      .join('&family=');
    return `https://fonts.googleapis.com/css2?family=${fontFamilies}:wght@400;700&display=swap`;
  }
}
