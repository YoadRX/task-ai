import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { exec } from 'child_process';
import { FileType } from './uvr.controller';

@Injectable()
export class UvrService {
  constructor() {}

  executeUvr(file: FileType) {
    const filePath = './audio/test.wav';

    // Save the uploaded file
    fs.writeFileSync(filePath, file.buffer);

    // Correct Docker command
    const command = `DOCKER_CLI_HINTS=false docker --log-level debug run --rm -v "$(pwd)"/audio:/input -v "$(pwd)"/audio:/output -v "$(pwd)/uvr-cli-use/":/app uvr-cli-use /input/test.wav -m /app/models/MDX_Net_Models/UVR_MDXNET_3_9662.onnx -o /output`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Exec error: ${error.message}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  }
}
