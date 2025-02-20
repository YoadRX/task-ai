import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LlmTalkerService } from './llm-talker/llm-talker.service';
import { LlmTalkerModule } from './llm-talker/llm-talker.module';
import { GeminiFilerController } from './gemini-filer/gemini-filer.controller';
import { GeminiFilerModule } from './gemini-filer/gemini-filer.module';
import { LlmTalkerController } from './llm-talker/llm-talker.controller';
@Module({
  imports: [LlmTalkerModule, GeminiFilerModule],
  controllers: [AppController, GeminiFilerController, LlmTalkerController],
  providers: [LlmTalkerService],
})
export class AppModule {}
