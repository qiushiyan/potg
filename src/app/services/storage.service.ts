import { Injectable } from '@angular/core';
import {
  deleteObject,
  ref,
  Storage,
  uploadBytes,
  uploadBytesResumable,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: Storage) {}

  uploadVideo(file: File, fileName: string) {
    const videoFilename = `videos/${fileName}.mp4`;
    const videoRef = ref(this.storage, videoFilename);
    const videoTask = uploadBytesResumable(videoRef, file);
    return { videoFilename, videoTask, videoRef };
  }

  // use async version of uploadBytes, need to await on this before uploadVideo
  async uploadScreenshot(screenshot: Blob, fileName: string) {
    const screenshotFilename = `screenshots/${fileName}.png`;
    const screenshotRef = ref(this.storage, screenshotFilename);
    await uploadBytes(screenshotRef, screenshot);
    return { screenshotFilename, screenshotRef };
  }

  async delete(path: string) {
    const obj = ref(this.storage, path);
    await deleteObject(obj);
  }
}
