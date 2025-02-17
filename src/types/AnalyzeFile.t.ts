import { EnhancedGenerateContentResponse } from '@google/generative-ai';

export interface AnalyzeFile {
  text: string;
  options?: Omit<EnhancedGenerateContentResponse, 'text'>;
}
