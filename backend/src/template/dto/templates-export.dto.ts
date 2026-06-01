import { ApiProperty } from '@nestjs/swagger';
import type { TemplateLayout, TemplateVariableInput } from '../entities/template.entity';

export class TemplateExportDto {
  @ApiProperty({ description: 'Template name' })
  name: string;

  @ApiProperty({ description: 'Template description' })
  description: string;

  @ApiProperty({ description: 'Template category' })
  category: string;

  @ApiProperty({ description: 'Template preview image path', required: false })
  previewImage?: string;

  @ApiProperty({ description: 'Template layout' })
  layout: TemplateLayout;

  @ApiProperty({ description: 'Template tags', type: [String] })
  tags: string[];

  @ApiProperty({ description: 'Template variables' })
  variables: Record<string, TemplateVariableInput>;

  @ApiProperty({ description: 'Template HTML' })
  html: string;

  @ApiProperty({ description: 'Template active status' })
  isActive: boolean;
}

export class TemplatesExportResponseDto {
  @ApiProperty({ description: 'Exported templates', type: [TemplateExportDto] })
  templates: TemplateExportDto[];
}
