export interface LLMType {
  message: string;
  llmTalker: LLMTalker;
  model: string;
  temperature?: number;
}
export enum LLMTalker {
  googleAI = 'googleAI',
  openAI = 'openAI',
}
