import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GeminiFilerService } from './gemini-filer.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Multer } from 'multer';

@Controller('gemini-filer')
export class GeminiFilerController {
  constructor(private readonly geminiFilerService: GeminiFilerService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './audio',
        filename: (_, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          callback(null, `audio-${uniqueSuffix}${fileExt}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Multer,
    @Body() { prompt },
  ): Promise<string> {
    if (!file) {
      throw new Error('No file uploaded.');
    }

    console.log(`File uploaded: ${file.originalname}`);

    const { fileUri, fileOptions } = await this.geminiFilerService.fileUploader(
      file.path,
      {
        displayName: file.originalname,
        mimeType: file.mimetype,
      },
    );
    console.log('fileOptions :', fileOptions);
    const res = await this.geminiFilerService.analyzeFile({
      prompt,
      fileUri,
      mimeType: file.mimetype,
    });
    return res.text;
  }
}
