import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UvrService } from './uvr.service';
import { FileInterceptor } from '@nestjs/platform-express';

export interface FileType {
  fieldname: string; // The name of the form field
  originalname: string; // The original name of the file
  encoding: string; // File encoding (e.g., '7bit')
  mimetype: string; // MIME type (e.g., 'audio/mpeg', 'image/png')
  buffer: Buffer; // File data as a Buffer
  size: number; // File size in bytes
}

@Controller('uvr')
export class UvrController {
  constructor(private readonly uvrService: UvrService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  executeUvr(@UploadedFile() file: FileType) {
    console.log(file.fieldname);
    return this.uvrService.executeUvr(file);
  }
}
