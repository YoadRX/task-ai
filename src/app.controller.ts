import { Controller, Get } from '@nestjs/common';
import { LlmTalkerService } from './llm-talker/llm-talker.service';

@Controller()
export class AppController {
  constructor(private readonly llmTalkerService: LlmTalkerService) {}

  @Get()
  getHello() {
    return this.llmTalkerService.generateGPTQuestions({
      llmTalker: 'openAI',
      message: 'What is the capital of France',
      model: 'gpt-4o-mini',
    });
  }
}
