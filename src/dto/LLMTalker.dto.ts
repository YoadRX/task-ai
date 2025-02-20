import { IsEnum, IsOptional, IsString, IsNumber, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export enum LLMTalker {
  googleAI = 'googleAI',
  openAI = 'openAI',
}

export class LLMTypeDTO {
  @IsString()
  message: string;

  @IsEnum(LLMTalker, {
    message: 'llmTalker must be either "googleAI" or "openAI"',
  })
  llmTalker: LLMTalker;

  @IsString()
  model: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value)) // Ensure temperature is a number
  temperature?: number;

  @IsOptional()
  @IsString()
  systemPrompt?: string;

  @IsOptional()
  @IsIn(['Json', 'string'], {
    message: 'returnType must be "Json" or "string"',
  })
  returnType?: 'Json' | 'string';
}
