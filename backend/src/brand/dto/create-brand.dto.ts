import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class Background {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  url: string;
}

class Icon {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  class: string;
}

class ImageUrl {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  url: string;
}

class ImageGroup {
  @IsString()
  @ApiProperty()
  groupName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageUrl)
  @ApiProperty({ type: [ImageUrl] })
  images_url: ImageUrl[];
}

export class CreateBrandDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  primaryColor: string;

  @IsString()
  @ApiProperty()
  secondaryColor: string;

  @IsString()
  @ApiProperty()
  tertiaryColor: string;

  @IsString()
  @ApiProperty()
  accentColor: string;

  @IsString()
  @ApiProperty()
  titleFont: string;

  @IsString()
  @ApiProperty()
  textFont: string;

  @IsString()
  @ApiProperty()
  tertiaryFont: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  logoUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  logoIconUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  logoLineUrl: string;

  @IsString()
  @ApiProperty()
  textColor: string;

  @IsString()
  @ApiProperty()
  textColor2: string;

  @IsString()
  @ApiProperty()
  textColorDark: string;

  @IsString()
  @ApiProperty()
  textColor2Dark: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Background)
  @ApiProperty({ type: [Background] })
  backgrounds: Background[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Icon)
  @ApiProperty({ type: [Icon] })
  icons: Icon[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageGroup)
  @ApiProperty({ type: [ImageGroup] })
  imageGroups: ImageGroup[];
}
