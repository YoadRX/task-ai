import { ModelParams } from '@google/generative-ai';

export interface AnalyzeFileParams {
  fileUri: string;
  prompt: string;
  modelName?: string;
  options?: Omit<ModelParams, 'model'>;
  mimeType: string;
}
