import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsObject, IsOptional, IsString, Max, Min } from 'class-validator';

export class GenerateTemplatePreviewDto {
  @ApiProperty({ description: 'Template name (used for naming the preview file)' })
  @IsString()
  @IsNotEmpty()
  templateName: string;

  @ApiProperty({ description: 'Brand name to use for rendering' })
  @IsString()
  @IsNotEmpty()
  brandName: string;

  @ApiProperty({ description: 'HTML content to render' })
  @IsString()
  @IsNotEmpty()
  html: string;

  @ApiProperty({ description: 'Render width (px)', example: 1000 })
  @IsInt()
  @Min(1)
  @Max(6000)
  width: number;

  @ApiProperty({ description: 'Render height (px)', example: 600 })
  @IsInt()
  @Min(1)
  @Max(6000)
  height: number;

  @ApiProperty({ description: 'Template variables', required: false })
  @IsObject()
  @IsOptional()
  templateVariables?: Record<string, unknown>;
}

