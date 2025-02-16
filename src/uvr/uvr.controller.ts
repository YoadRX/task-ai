import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UvrService } from './uvr.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileType } from '../types/FileType.t';

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
