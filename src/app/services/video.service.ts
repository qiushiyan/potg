import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  CollectionReference,
  Firestore,
} from '@angular/fire/firestore';
import { IVideo } from '../models/video.model';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  collectionRef: CollectionReference<IVideo>;

  constructor(firestore: Firestore) {
    this.collectionRef = collection(
      firestore,
      'videos'
    ) as CollectionReference<IVideo>;
  }

  async createVideo(data: IVideo) {
    return await addDoc(this.collectionRef, data);
  }
}
