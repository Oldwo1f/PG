import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { Template } from './entities/template.entity';
import { Subscription } from '../billing/entities/subscription.entity';
import { Plan } from '../billing/entities/plan.entity';
import { BrandModule } from '../brand/brand.module';
import { TemplatePreviewService } from './template-preview.service';

@Module({
  imports: [TypeOrmModule.forFeature([Template, Subscription, Plan]), BrandModule],
  controllers: [TemplateController],
  providers: [TemplateService, TemplatePreviewService],
  exports: [TemplateService],
})
export class TemplateModule {}
