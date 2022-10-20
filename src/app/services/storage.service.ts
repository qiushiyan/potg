import { Injectable } from '@angular/core';
import {
  ref,
  Storage,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from '@angular/fire/storage';
import { Subject } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  uploadPercent$ = new Subject<number>();
  uploadSuccessful$ = new Subject<boolean>();

  constructor(private storage: Storage) {}

  upload(file: File) {
    const path = `videos/${uuid()}.mp4`;
    const obj = ref(this.storage, path);
    const task = uploadBytesResumable(obj, file);
    task.on('state_changed', {
      next: (snapshot: UploadTaskSnapshot) => {
        this.uploadPercent$.next(
          snapshot.bytesTransferred / snapshot.totalBytes
        );
      },
      error: (error: Error) => {
        this.uploadPercent$.next(0);
        this.uploadSuccessful$.next(false);
        console.error(error);
      },
      complete: () => {
        this.uploadSuccessful$.next(true);
      },
    });
    return task;
  }
}
