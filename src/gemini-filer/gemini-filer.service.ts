import { Injectable } from '@nestjs/common';
import {
  FileMetadataResponse,
  GoogleAIFileManager,
} from '@google/generative-ai/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import { AnalyzeAudio } from '../types/AnalyzeAudio.t';

@Injectable()
export class GeminiFilerService {
  private readonly fileManager: GoogleAIFileManager;

  constructor() {
    this.fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);
  }

  async fileUploaderAudio(
    filePath: string,
  ): Promise<{ fileUri: string; fileOptions: FileMetadataResponse }> {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('Invalid file path.');
    }

    console.log(`Uploading file: ${filePath}`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    try {
      const uploadResult = await this.fileManager.uploadFile(filePath, {
        mimeType: 'audio/mp3',
        displayName: 'Uploaded Audio',
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

  async analyzeAudio({
    fileUri,
    prompt,
    modelName = 'gemini-2.0-flash',
  }: {
    fileUri: string;
    prompt: string;
    modelName?: string;
  }): Promise<AnalyzeAudio> {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({
      model: modelName,
    });
    console.log('modelName :', modelName);
    console.log('Loading...');
    const result = await model.generateContent([
      prompt,
      {
        fileData: {
          fileUri,
          mimeType: 'audio/mp3',
        },
      },
    ]);

    return {
      text: result.response?.text?.() || 'No response from AI model.',
      options: result.response,
    };
  }
}
