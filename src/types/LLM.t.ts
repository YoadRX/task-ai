export interface LLMType {
  message: string;
  llmTalker: LLMTalker | 'googleAI' | 'openAI';
  model: string;
  temperature?: number;
  systemPrompt?: string;
}
export enum LLMTalker {
  googleAI = 'googleAI',
  openAI = 'openAI',
}
