import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Delete,
  Param,
  NotFoundException,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ImagesService } from './images.service';
import { Image } from './entities/image.entity';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync } from 'fs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

// If you see a linter error for multer types, run: npm i --save-dev @types/multer

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: User): Promise<Image[]> {
    return this.imagesService.findAll(user.id);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (
          _req: Express.Request,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ): Promise<Image> {
    if (!file) {
      throw new NotFoundException('No file uploaded.');
    }
    const url = `/uploads/images/${file.filename}`;
    return this.imagesService.create(
      {
        filename: file.filename,
        originalName: file.originalname,
        url,
        size: file.size,
      },
      user,
    );
  }

  @Get('file/:filename')
  async getImageFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    const imagePath = join(process.cwd(), 'uploads', 'images', filename);

    // Vérifier si le fichier existe
    if (!existsSync(imagePath)) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Image not found',
      });
      return;
    }

    // Ajouter les headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'public, max-age=31536000');

    // Servir le fichier
    res.sendFile(imagePath);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteImage(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ success: boolean }> {
    await this.imagesService.delete(id, user.id);
    return { success: true };
  }
}
