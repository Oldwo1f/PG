import { ApiProperty } from '@nestjs/swagger';
import type { TemplateLayout, TemplateUsage } from '../entities/template.entity';

export class CatalogTemplateVariableDto {
  @ApiProperty({ description: 'Example value for this variable' })
  example_value: string;

  @ApiProperty({ description: 'Usage instructions for agents', required: false })
  usage?: string;
}

export class TemplateCatalogDto {
  @ApiProperty({ description: 'Template name (used in POST /generate)' })
  templateName: string;

  @ApiProperty({ description: 'Template description' })
  description: string;

  @ApiProperty({ description: 'Template category' })
  category: string;

  @ApiProperty({ description: 'Template layout dimensions' })
  layout: TemplateLayout;

  @ApiProperty({ description: 'Preview image path', required: false })
  previewImage?: string;

  @ApiProperty({
    description: 'When to use / not use this template (for agents)',
    required: false,
  })
  usage?: TemplateUsage;

  @ApiProperty({
    description: 'Template variables with example values and usage hints',
    type: 'object',
    additionalProperties: { $ref: '#/components/schemas/CatalogTemplateVariableDto' },
  })
  templateVariables: Record<string, CatalogTemplateVariableDto>;
}

export class TemplatesCatalogResponseDto {
  @ApiProperty({ type: [TemplateCatalogDto] })
  templates: TemplateCatalogDto[];
}
