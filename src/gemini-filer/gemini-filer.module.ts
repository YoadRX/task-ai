import { Module } from '@nestjs/common';
import { GeminiFilerService } from './gemini-filer.service';
import { GeminiFilerController } from './gemini-filer.controller';

@Module({
  providers: [GeminiFilerService],
  exports: [GeminiFilerService],
  controllers: [GeminiFilerController],
})
export class GeminiFilerModule {}
