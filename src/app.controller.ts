import { Controller, Get } from '@nestjs/common';
import { LlmTalkerService } from './llm-talker/llm-talker.service';
import { LLMTalker } from './dto/LLMTalker.dto';

@Controller()
export class AppController {
  constructor(private readonly llmTalkerService: LlmTalkerService) {}
  @Get()
  async getHello() {
    const cs = await this.llmTalkerService.generateLLMRequest({
      llmTalker: LLMTalker.googleAI,
      message: 'Hello, how are you?',
      model: 'gemini-1.5-flash',
      systemPrompt: 'You are a helpful assistant.',
    });
    return cs;
  }
}
