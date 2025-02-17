import { AIMessageChunk, MessageContent } from '@langchain/core/messages';

export interface GenerateLLMResponse {
  content: MessageContent | undefined;
  options: Omit<AIMessageChunk, 'content'>;
  tokensUsage: {
    input: number;
    output: number;
    total: number;
  };
}
