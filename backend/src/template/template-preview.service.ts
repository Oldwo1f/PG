import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
import { BrandService } from '../brand/brand.service';
import { Brand } from '../brand/entities/brand.entity';
import { User } from '../user/entities/user.entity';
import { registerHandlebarsHelpers, resolveAssetUrl } from '../utils/handlebarsHelpers';
import { addGoogleFontsAndStyles } from '../utils/htmlUtils';
import { GenerateTemplatePreviewDto } from './dto/generate-template-preview.dto';

@Injectable()
export class TemplatePreviewService {
  constructor(private readonly brandService: BrandService) {}

  async generateAndSavePreview(dto: GenerateTemplatePreviewDto, user: User): Promise<{ filename: string }> {
    const brand = await this.brandService.findByNameForUser(dto.brandName, user.id);
    const buffer = await this.renderHtmlToPng(dto.html, brand, dto.templateVariables, dto.width, dto.height);

    // Utiliser process.cwd() pour pointer vers /app dans Docker, ou __dirname en dev
    // Le volume Docker monte /app/assets, donc on doit utiliser ce chemin
    const previewsDir = process.env.NODE_ENV === 'production'
      ? path.join(process.cwd(), 'assets', 'templatePreviews')
      : path.join(__dirname, '../assets/templatePreviews');
    fs.mkdirSync(previewsDir, { recursive: true });

    const filename = this.buildPreviewFilename(dto.templateName);
    const fullPath = path.join(previewsDir, filename);

    try {
      fs.writeFileSync(fullPath, buffer);
    } catch (e) {
      throw new InternalServerErrorException(`Failed to write preview file: ${e instanceof Error ? e.message : String(e)}`);
    }

    return { filename };
  }

  private buildPreviewFilename(templateName: string): string {
    const base = this.slugifyForFilename(templateName).slice(0, 80) || 'template';
    const rand = crypto.randomBytes(4).toString('hex');
    return `${base}-${Date.now()}-${rand}.png`;
  }

  private slugifyForFilename(input: string): string {
    return (input || '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
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

  private async renderHtmlToPng(
    html: string,
    brand: Brand,
    templateVariables: Record<string, unknown> | undefined,
    width: number,
    height: number,
  ): Promise<Buffer> {
    if (!html) {
      throw new InternalServerErrorException('HTML content is required');
    }

    registerHandlebarsHelpers();
    const template = Handlebars.compile(html);

    // Same normalization as GenerateService (frontend expects brand.imageGroups as object keyed by groupName)
    const imageGroupsByName = (brand.imageGroups || []).reduce((acc: Record<string, { name: string; url: string }[]>, group) => {
      if (group.groupName) {
        const raw = Array.isArray(group.images_url) ? group.images_url : [];
        acc[group.groupName] = raw.map((u: string, idx: number) => ({
          name: `image_${idx + 1}`,
          url: resolveAssetUrl(u),
        }));
      }
      return acc;
    }, {});

    const templateBrand = {
      ...brand,
      logoUrl: resolveAssetUrl((brand as any).logoUrl),
      logoIconUrl: resolveAssetUrl((brand as any).logoIconUrl),
      logoLineUrl: resolveAssetUrl((brand as any).logoLineUrl),
      imageGroups: imageGroupsByName,
      icons: brand.icons || [],
    };

    const templateData = {
      ...(templateVariables || {}),
      brand: templateBrand,
    };

    const content = template(templateData);
    const googleFontsLinks = this.generateGoogleFontsLinks(brand);

    // Keep the same Puppeteer setup as /generate for consistent rendering.
    const executablePath =
      process.env.CHROME_BIN || (process.env.NODE_ENV === 'production' ? '/usr/bin/chromium-browser' : undefined);

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
      await page.setViewport({ width, height });

      const fullHtml = addGoogleFontsAndStyles(content, googleFontsLinks);
      await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
      // Match studio iframe preview behavior: clip overflow to template dimensions.
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
    } catch (e) {
      throw new InternalServerErrorException(`Failed to render preview: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      await browser.close();
    }
  }
}

