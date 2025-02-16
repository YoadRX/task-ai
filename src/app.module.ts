import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LlmTalkerService } from './llm-talker/llm-talker.service';
import { LlmTalkerModule } from './llm-talker/llm-talker.module';

@Module({
  imports: [LlmTalkerModule],
  controllers: [AppController],
  providers: [LlmTalkerService],
})
export class AppModule {}
