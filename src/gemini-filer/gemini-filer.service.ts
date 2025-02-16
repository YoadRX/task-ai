import { Injectable } from '@nestjs/common';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';

@Injectable()
export class GeminiFilerService {
  private readonly fileManager: GoogleAIFileManager;

  constructor() {
    this.fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);
  }

  async fileUploaderAudio(filePath: string): Promise<string> {
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

      return uploadResult.file.uri;
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
  }: {
    fileUri: string;
    prompt: string;
  }): Promise<string> {
    console.log('prompt :', prompt);
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
    });

    const result = await model.generateContent([
      prompt,
      {
        fileData: {
          fileUri,
          mimeType: 'audio/mp3',
        },
      },
    ]);

    return result.response?.text?.() || 'No response from AI model.';
  }
}
