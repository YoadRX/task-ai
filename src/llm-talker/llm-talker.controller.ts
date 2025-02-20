import { Body, Controller, Post } from '@nestjs/common';
import { LlmTalkerService } from './llm-talker.service';
import { GenerateLLMResponse } from '../types/GenerateLLMResponse.t';
import { LLMTypeDTO } from '../dto/LLMTalker.dto';

@Controller('llm-talker')
export class LlmTalkerController {
  constructor(private readonly llmTalkerService: LlmTalkerService) {}

  @Post()
  async generateLLMRequest(
    @Body() { llmTalker, message, model }: LLMTypeDTO,
  ): Promise<GenerateLLMResponse> {
    return this.llmTalkerService.generateLLMRequest({
      llmTalker,
      message,
      model,
      returnType: 'Json',
      sysPromptValues: {
        message,
      },
      systemPrompt:
        'You will given an info: {message} and return the message formatted as a json',
    });
  }
}
