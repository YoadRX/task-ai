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
  private openAI?: ChatOpenAI;
  private googleAI?: ChatGoogleGenerativeAI;
  private readonly logger = new Logger();

  constructor() {
    const openAIApiKey = process.env.OPENAI_API_KEY;
    const googleApiKey = process.env.GOOGLE_API_KEY;

    if (openAIApiKey) {
      this.openAI = new ChatOpenAI({
        apiKey: openAIApiKey,
        modelName: 'gpt-4o-mini',
        temperature: 0.8,
      });
    }

    if (googleApiKey) {
      this.googleAI = new ChatGoogleGenerativeAI({
        model: 'gemini-1.5-pro',
        apiKey: googleApiKey,
      });
    }
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

  private removeJsonCodeBlock = (text: string): unknown => {
    // Regular expression to match the JSON code block pattern.
    // The 's' flag allows the dot (.) to match newline characters.
    const regex = /```json\s*\n([\s\S]*?)\n\s*```/g; // Modified regex

    // Replace the matched pattern with the captured group (the JSON content).
    return JSON.parse(text.replace(regex, '$1'));
  };
  async generateLLMRequest({
    llmTalker,
    message,
    model,
    systemPrompt,
    returnType,
  }: LLMType): Promise<GenerateLLMResponse> {
    try {
      if (model) {
        this[llmTalker].model = model;
        this[llmTalker].modelName = model;
      }

      const chatPromptTemplate = ChatPromptTemplate.fromTemplate(
        (systemPrompt + returnType === 'Json' &&
          'Return All as A Valid JSON') ||
          'Be helpful Assistant',
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
        content:
          returnType === 'Json'
            ? this.removeJsonCodeBlock(response.content as string)
            : (response.content as string),
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
