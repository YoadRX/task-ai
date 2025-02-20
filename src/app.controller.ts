import { Body, Controller, Post } from '@nestjs/common';
import { LlmTalkerService } from './llm-talker/llm-talker.service';
import { LLMTypeDTO } from './dto/LLMTalker.dto';
@Controller()
export class AppController {
  constructor(private readonly llmTalkerService: LlmTalkerService) {}
  @Post()
  async getHello(@Body() { llmTalker, message, model }: LLMTypeDTO) {
    const cs = await this.llmTalkerService.generateLLMRequest({
      llmTalker,
      message,
      model,
      systemPrompt: 'give me the info about this story ',
      returnType: 'Json',
      interfaceReturn: {
        name: [{ names: 'string' }],
        description: 'string',
        story: 'string',
      },
    });
    return cs;
  }
}
