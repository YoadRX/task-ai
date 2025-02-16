import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { exec } from 'child_process';
import { FileType } from './uvr.controller';

@Injectable()
export class UvrService {
  constructor() {}

  executeUvr(file: FileType): Promise<{ noVocals: string; vocals: string }> {
    return new Promise((resolve, reject) => {
      const fileName = file.originalname.split('.')[0];
      const filePath = `./audio/${file.originalname}`;

      // Save the uploaded file
      fs.writeFileSync(filePath, file.buffer);

      // Correct Docker command
      const command = `DOCKER_CLI_HINTS=false docker --log-level debug run --rm -v "$(pwd)"/audio:/input -v "$(pwd)"/audio:/output -v "$(pwd)/uvr-cli-use/":/app uvr-cli-use /input/${file.originalname} -m /app/models/MDX_Net_Models/UVR_MDXNET_3_9662.onnx -o /output`;

      // Loading animation
      const loadingAnimation = ['|', '/', '-', '\\'];
      let i = 0;
      const loadingInterval = setInterval(() => {
        process.stdout.write(
          `\rProcessing ${loadingAnimation[i++ % loadingAnimation.length]}`,
        );
      }, 200);

      exec(command, (error, stdout, stderr) => {
        clearInterval(loadingInterval); // Stop the loading animation
        process.stdout.write('\rProcessing complete!        \n'); // Clear the animation line

        if (error) {
          console.error(`Exec error: ${error.message}`);
          reject(new Error(error.message));
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        resolve({
          noVocals: fs
            .readFileSync(`./audio/${fileName}_no_vocals.wav`)
            .toString('base64'),
          vocals: fs
            .readFileSync(`./audio/${fileName}_vocals.wav`)
            .toString('base64'),
        });
      });
    });
  }
}
