import { Injectable, Logger } from '@nestjs/common';

import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatOpenAI } from '@langchain/openai';
import * as dotenv from 'dotenv';
import { LLMType } from '../types/LLM.t';
import { GenerateLLMResponse } from '../types/GenerateLLMResponse.t';
dotenv.config();
dotenv.configDotenv();

@Injectable()
export class LlmTalkerService {
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

  /**
   * @param llmTalker - The LLM type to use
   * @param message - The message to send to the LLM
   * @param model - The model to use
   * @param systemPrompt - The system prompt to use
   * @returns Returns { `**content**` - The message content.
   *   `**options**` - The options from the LLM response.
   *   `**tokensUsage**` - Token usage information.
   *   `**input**` - Number of input tokens.
   *   `**output**` - Number of output tokens.
   *   `**total**` - Total token usage.
   *     }
   */
  async generateLLMRequest({
    llmTalker,
    message,
    model,
    systemPrompt,
  }: LLMType): Promise<GenerateLLMResponse> {
    try {
      if (model) {
        this[llmTalker].model = model;
        this[llmTalker].modelName = model;
      }

      const chatPromptTemplate = ChatPromptTemplate.fromTemplate(
        systemPrompt || 'Be helpful Assistant',
      );

      const formattedMessages = await chatPromptTemplate.formatMessages({});

      const response = await this[llmTalker].invoke([
        {
          role: 'system',
          content: formattedMessages[0].content as string,
        },
        { role: 'user', content: message },
      ]);

      return {
        options: response,
        content: response.content,
        tokensUsage: {
          input: response.usage_metadata.input_tokens,
          output: response.usage_metadata.output_tokens,
          total: response.usage_metadata.total_tokens,
        },
      } as GenerateLLMResponse;
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
