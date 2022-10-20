import { Injectable } from '@angular/core';
import { ref, Storage, uploadBytes } from '@angular/fire/storage';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: Storage) {}

  upload(file: File) {
    const path = `videos/${uuid()}.mp4`;
    const obj = ref(this.storage, path);
    uploadBytes(obj, file);
  }
}
