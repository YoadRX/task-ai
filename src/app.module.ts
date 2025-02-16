import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LlmTalkerModule } from './llm-talker/llm-talker.module';

@Module({
  imports: [LlmTalkerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
