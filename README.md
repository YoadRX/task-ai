# Task AI

## LlmTalkerService

LlmTalkerService is a NestJS injectable service that provides an abstraction over OpenAI's and Google's LLM APIs. It allows you to send messages to GPT-4o-mini and Gemini-1.5-pro models and retrieve responses.

Installation

Ensure you have the necessary dependencies installed:

`npm install task-ai` OR
`pnpm install task-ai`

## Environment Variables

Set up your .env file with the following API keys:

`OPENAI_API_KEY="your_openai_api_key"`AND
`GOOGLE_API_KEY="your_google_api_key"`

## Usage

### Importing the Service

Inject `LlmTalkerModule` into your App Module:

```typescript
import { Module } from '@nestjs/common';
import { LlmTalkerModule } from 'task-ai';

@Module({
  imports: [LlmTalkerModule],
})
export class YourAppModule {}
```

Generating an LLM Request

Use the generateLLMRequest method to send a message to an LLM model:

```typescript
import { LlmTalkerService } from 'task-ai';

constructor(private readonly llmTalkerService: LlmTalkerService) {}

async function sendMessage() {
    const response = await this.llmTalkerService.generateLLMRequest({
    llmTalker: 'openAI', // or 'googleAI'
    message: 'Hello, how are you?',
    model: 'gpt-4o-mini', // Optional
    systemPrompt: 'You are a helpful assistant.',
    });
  console.log(response);
}
```

Parameters

- llmTalker ('openAI' | 'googleAI'): Specifies which LLM to use.

- message (string): The user input message.

- model (string, optional): Specifies the model version.

* systemPrompt (string, optional): A system message to guide the response.

Error Handling

If an error occurs during the request, it will be logged using NestJS's Logger service and re-thrown.

## GeminiFilerService

GeminiFilerService is a NestJS injectable service that integrates with Google's Generative AI API for handling audio file uploads and analysis.

## Environment Variables

Set up your .env file with the following API key:

`GOOGLE_API_KEY="your_google_api_key"`

### Usage

#### Importing the Service

Inject GeminiFilerService into your APP Module:

```typescript
import { Module } from '@nestjs/common';
import { GeminiFilerModule } from 'task-ai';

@Module({
  imports: [GeminiFilerModule],
})
export class YourAppModule {}
```

### Uploading an Audio File

Use the `fileUploaderAudio` method to upload an audio file to Google AI:

```typescript
import { GeminiFilerService } from 'task-ai';

constructor(private readonly geminiFilerService: GeminiFilerService) {}

async function uploadAudio() {
  const fileUri = await this.geminiFilerService.fileUploaderAudio('path/to/audio.mp3');
  console.log('Uploaded file URI:', fileUri);
}
```

### Analyzing an Audio File

Use the `analyzeAudio` method to analyze an uploaded audio file:

```typescript
async function analyzeUploadedAudio() {
  const response = await this.geminiFilerService.analyzeAudio({
    fileUri: 'uploaded_file_uri',
    prompt: 'Transcribe this audio.',
  });
  console.log('AI Response:', response);
}
```

## Parameters

fileUploaderAudio(filePath: string): Promise<string>
Returns the uploaded file's URI.

- filePath: The local path of the audio file to be uploaded.

- analyzeAudio({ fileUri, prompt, modelName }): Promise<string>

- fileUri: The URI of the uploaded audio file.

- prompt: The instruction for AI processing.

- modelName (optional): The AI model to use (default: 'gemini-2.0-flash').

Returns AI-generated analysis or transcription of the audio.

Error Handling

Throws an error if the file path is invalid or the file does not exist.

Logs errors encountered during file upload or AI analysis.

License

This project is licensed under the MIT License.
