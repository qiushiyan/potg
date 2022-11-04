import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root',
})
export class FFmpegService {
  isReady: boolean = false;
  isRunning: boolean = false;
  private ffmpeg;

  constructor() {
    this.ffmpeg = createFFmpeg({ log: true });
  }

  async init() {
    if (!this.isReady) {
      await this.ffmpeg.load();
      this.isReady = true;
    }
  }

  async getScreenshots(file: File) {
    this.isRunning = true;
    // convert and store as binary
    const data = await fetchFile(file);
    this.ffmpeg.FS('writeFile', file.name, data);

    const seconds = [1, 2, 3];
    const commands: string[] = [];

    seconds.forEach((second) => {
      commands.push(
        // Input
        '-i',
        file.name,
        // Output Options
        '-ss',
        `00:00:0${second}`,
        '-frames:v',
        '1', // how many frames to take
        '-filter:v',
        'scale=500:-1', // resize screenshot to 500px width and keep aspect ratio
        // Output
        `output_0${second}.png`
      );
    });

    await this.ffmpeg.run(...commands);

    const screenshots: string[] = [];

    seconds.forEach((second) => {
      const screenshotFile = this.ffmpeg.FS(
        'readFile',
        `output_0${second}.png`
      );
      const screenshotBlob = new Blob([screenshotFile.buffer], {
        type: 'image/png',
      });
      const screenshotURL = URL.createObjectURL(screenshotBlob);
      screenshots.push(screenshotURL);
    });

    this.isRunning = false;
    return screenshots;
  }

  // convert object url back to blob for uploading to fireabase storage
  async blobFromURL(url: string) {
    const response = await fetch(url);
    return response.blob();
  }
}
