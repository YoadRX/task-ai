import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LlmTalkerService } from './llm-talker/llm-talker.service';
import { LlmTalkerModule } from './llm-talker/llm-talker.module';
import { UvrController } from './uvr/uvr.controller';
import { UvrService } from './uvr/uvr.service';
import { UvrModule } from './uvr/uvr.module';

@Module({
  imports: [LlmTalkerModule, UvrModule],
  controllers: [AppController, UvrController],
  providers: [LlmTalkerService, UvrService],
})
export class AppModule {}
