import { Injectable, Logger } from '@nestjs/common';

import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatOpenAI } from '@langchain/openai';
import * as dotenv from 'dotenv';
import { GenerateLLMResponse } from '../types/GenerateLLMResponse.t';
import { LLMTalker, LLMTypeDTO } from '../dto/LLMTalker.dto';
import { DEFAULT_JSON } from '../types/ReturnType.sysp';
dotenv.config();
dotenv.configDotenv();

@Injectable()
export class LlmTalkerService {
  private openAI?: ChatOpenAI;
  private googleAI?: ChatGoogleGenerativeAI;
  private analyzeFile: unknown = {};

  private readonly logger = new Logger();

  constructor() {
    const openAIApiKey = process.env.OPENAI_API_KEY;
    const googleApiKey = process.env.GOOGLE_API_KEY;

    if (openAIApiKey) {
      this.openAI = new ChatOpenAI({
        apiKey: openAIApiKey,
        model: 'gpt-4o-mini',
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

  private removeJsonCodeBlock = (text: string): unknown => {
    // Regular expression to match the JSON code block pattern.
    // The 's' flag allows the dot (.) to match newline characters.
    const regex = /```json\s*\n([\s\S]*?)\n\s*```/g; // Modified regex

    // Replace the matched pattern with the captured group (the JSON content).
    return JSON.parse(text.replace(regex, '$1'));
  };

  /**
   * @param llmTalker - The LLM type to use
   * @param message - The message to send to the LLM
   * @param model - The model to use
   * @param systemPrompt - The system prompt to use
   * @param returnType - The return type to use
   * @param sysPromptValues - The system prompt Values/Params
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
    returnType,
    sysPromptValues,
    interfaceReturn,
  }: LLMTypeDTO & {
    sysPromptValues?: unknown;
    interfaceReturn?: object;
  }): Promise<GenerateLLMResponse> {
    try {
      if (model) {
        if (llmTalker === LLMTalker.googleAI) {
          this[llmTalker].model = model;
        }
      }

      const followInterface = JSON.stringify(interfaceReturn).replace(
        /[{}]/g,
        (match) => (match === '{' ? 'object(' : ')'),
      );

      const systemPromptMain =
        returnType === 'Json'
          ? systemPrompt + DEFAULT_JSON + followInterface
          : systemPrompt;

      const chatPromptTemplate = ChatPromptTemplate.fromTemplate(
        systemPromptMain || 'Be helpful Assistant',
      );

      const formattedMessages = await chatPromptTemplate.formatMessages(
        sysPromptValues as Record<string, string>,
      );

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
