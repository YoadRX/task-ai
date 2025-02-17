import { FileMetadataResponse } from '@google/generative-ai/server';

export interface FileUploaderType {
  fileUri: string;
  fileOptions: FileMetadataResponse;
}
