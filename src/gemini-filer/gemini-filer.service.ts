import { Injectable } from '@nestjs/common';
import {
  FileMetadata,
  GoogleAIFileManager,
} from '@google/generative-ai/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import { AnalyzeFile as AnalyzeFile } from '../types/AnalyzeFile.t';
import { AnalyzeFileParams as AnalyzeFileParams } from '../types/AnalyzeFileParams.t';
import { FileUploaderType } from '../types/FileUploaderType.t';

@Injectable()
export class GeminiFilerService {
  private readonly fileManager: GoogleAIFileManager;

  constructor() {
    this.fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);
  }

  async fileUploader(
    filePath: string,
    fileOptions: FileMetadata,
  ): Promise<FileUploaderType> {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('Invalid file path.');
    }

    console.log(`Uploading file: ${filePath}`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    try {
      const uploadResult = await this.fileManager.uploadFile(filePath, {
        mimeType: fileOptions.mimeType,
        displayName: fileOptions.displayName,
      });

      console.log(`Upload successful: ${uploadResult.file.uri}`);

      return {
        fileUri: uploadResult.file.uri,
        fileOptions: uploadResult.file,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error(
        `File upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async analyzeFile({
    fileUri,
    prompt,
    modelName = 'gemini-2.0-flash',
    options,
    mimeType,
  }: AnalyzeFileParams): Promise<AnalyzeFile> {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({
      ...options,
      model: modelName,
    });
    console.log('modelName :', modelName);
    const result = await model.generateContent([
      prompt,
      {
        fileData: {
          fileUri,
          mimeType,
        },
      },
    ]);

    return {
      text: result.response?.text?.() || 'No response from AI model.',
      options: result.response,
    } as AnalyzeFile;
  }
}
