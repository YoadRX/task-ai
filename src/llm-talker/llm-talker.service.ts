import { Injectable, Logger } from '@nestjs/common';
import { type MessageContent } from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatOpenAI } from '@langchain/openai';
import * as dotenv from 'dotenv';

dotenv.config();
dotenv.configDotenv();

@Injectable()
export class LlmTalkerService {
  private readonly chatOpenAI: ChatOpenAI;
  private readonly logger = new Logger();
  private readonly googleAI: ChatGoogleGenerativeAI;

  constructor() {
    this.chatOpenAI = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4o-mini',
      temperature: 0.8,
    });
    this.googleAI = new ChatGoogleGenerativeAI({
      model: 'gemini-1.5-pro',
      apiKey: process.env.GOOGLE_API_KEY,
    });
  }

  /**
   * @param request
   * @returns "A response"
   */
  async generateGPTQuestions(
    request: string,
  ): Promise<MessageContent | undefined> {
    try {
      const chatPromptTemplate = ChatPromptTemplate.fromTemplate(
        'Be helpful and kind Assistant',
      );

      const formattedMessages = await chatPromptTemplate.formatMessages({});

      const llmTalker = this.chatOpenAI;

      const response = await llmTalker.invoke([
        {
          role: 'system',
          content: formattedMessages[0].content as string,
        },
        { role: 'user', content: request },
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
