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

### Importing the Service/Module

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

- systemPrompt (string, optional): A system message to guide the response.

- returnType ("Json" | "string", optional): The return type

- sysPromptValues: {
  anyData // that in the sysPrompt
  }

### See LLMTypeDTO

```typescript
import { LLMTypeDTO } from 'task-ai';
```

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

Use the `fileUploaderFile` method to upload an File file to Google AI:

```typescript
import { GeminiFilerService } from 'task-ai';

constructor(private readonly geminiFilerService: GeminiFilerService) {}

async function uploadFile() {
  const {fileUri} = await this.geminiFilerService.fileUploaderFile({
    filePath: "[YOUR_FILE_PATH]",
    fileOptions: {
      name?: string;
      displayName?: string;
      mimeType: string;
    }
  });
  console.log('Uploaded file URI:', fileUri);
}
```

### Analyzing an Audio File

Use the `analyzeFile` method to analyze an uploaded file:

```typescript
async function analyzeUploadedFile() {
  const response = await this.geminiFilerService.analyzeFile({
    fileUri: 'uploaded_file_uri',
    prompt: 'Transcribe this audio.',
    // Can be "audio/mp3" or
    // "audio/wav" or a png file
    mimeType: '[mime_type]',
  });
  console.log('AI Response:', response);
}
```

## Parameters

fileUploaderAudio(filePath: string): Promise<string>
Returns the uploaded file's URI.

- filePath: The local path of the audio file to be uploaded.

- analyzeAudio({ fileUri, prompt, modelName }): Promise< string >

- fileUri: The URI of the uploaded audio file.

- prompt: The instruction for AI processing.

- modelName (optional): The AI model to use (default: 'gemini-2.0-flash').

- options (optional): < ModelParams >

- mimeType: The file mime type

### Interface: options

```typescript
options?: {
  tools?: Tool[];
  toolConfig?: ToolConfig;
  systemInstruction?: string | Part | Content;
  cachedContent?: CachedContent;
}
```

Returns AI-generated analysis or transcription of the audio.

Error Handling

Throws an error if the file path is invalid or the file does not exist.

Logs errors encountered during file upload or AI analysis.

License

This project is licensed under the MIT License.
