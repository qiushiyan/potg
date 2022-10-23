import { Injectable } from '@angular/core';
import {
  deleteObject,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: Storage) {}

  upload(file: File) {
    const fileName = uuid();
    const path = `videos/${fileName}.mp4`;
    const obj = ref(this.storage, path);
    const task = uploadBytesResumable(obj, file);

    return { task, fileName };
  }

  async delete(id: string) {
    const obj = ref(this.storage, `videos/${id}.mp4`);
    await deleteObject(obj);
  }
}
