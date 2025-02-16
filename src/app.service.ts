import { Injectable, Logger } from '@nestjs/common';
import { type MessageContent } from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatOpenAI } from '@langchain/openai';
import { type LLMType } from './types/LLM.t';
@Injectable()
export class AppService {
  private readonly openAI: ChatOpenAI;
  private readonly logger = new Logger();
  private readonly googleAI: ChatGoogleGenerativeAI;

  constructor() {
    this.openAI = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4o-mini',
      temperature: 0.8,
    });
    this.googleAI = new ChatGoogleGenerativeAI({
      model: 'gemini-1.5-pro',
      apiKey: process.env.GOOGLE_API_KEY,
    });
  }

  async generateGPTQuestions({
    llmTalker,
    message,
    model,
  }: LLMType): Promise<MessageContent | undefined> {
    try {
      if (model) this[llmTalker].model = model;
      const chatPromptTemplate = ChatPromptTemplate.fromTemplate('');

      const formattedMessages = await chatPromptTemplate.formatMessages({});

      const response = await this[llmTalker].invoke([
        {
          role: 'system',
          content: formattedMessages[0].content as string,
        },
        { role: 'user', content: message },
      ]);

      return response.content;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(error.message);
      } else {
        this.logger.error('An unknown error occurred');
      }
      throw error;
    }
  }
}
