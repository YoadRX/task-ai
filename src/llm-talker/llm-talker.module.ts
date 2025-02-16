import { Module } from '@nestjs/common';
import { LlmTalkerService } from './llm-talker.service';

@Module({
  providers: [LlmTalkerService],
  exports: [LlmTalkerService],
})
export class LlmTalkerModule {}
