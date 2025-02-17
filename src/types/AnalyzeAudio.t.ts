import { EnhancedGenerateContentResponse } from '@google/generative-ai';

export interface AnalyzeAudio {
  text: string;
  options?: EnhancedGenerateContentResponse;
}
