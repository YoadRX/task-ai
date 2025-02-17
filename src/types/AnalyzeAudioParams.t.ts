import { ModelParams } from '@google/generative-ai';

export interface AnalyzeAudioParams {
  fileUri: string;
  prompt: string;
  modelName?: string;
  options?: Omit<ModelParams, 'model'>;
}
