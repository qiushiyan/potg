import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  Firestore,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from '@angular/fire/firestore';
import { IVideo, Video } from '../models/video.model';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  collectionRef: CollectionReference<IVideo>;

  userVideos: Video[] = [];
  // if scroll to load more videos
  pendingReq: boolean = false;
  // videos accumulator
  pageVideos: Video[] = [];

  constructor(private firestore: Firestore) {
    this.collectionRef = collection(
      this.firestore,
      'videos'
    ) as CollectionReference<IVideo>;
  }

  async createVideo(data: IVideo) {
    return await addDoc(this.collectionRef, data);
  }

  async getVideos() {
    if (this.pendingReq) {
      return;
    }

    this.pendingReq = true;

    let q;
    if (this.pageVideos.length > 0) {
      const lastId = this.pageVideos[this.pageVideos.length - 1].id;
      const lastVideo = await getDoc(doc(this.collectionRef, lastId));
      q = query(
        this.collectionRef,
        orderBy('timestamp', 'desc'),
        limit(12),
        startAfter(lastVideo)
      );
    } else {
      q = query(this.collectionRef, orderBy('timestamp', 'desc'), limit(12));
    }

    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      this.pageVideos.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    this.pendingReq = false;
  }

  async getUserVideos(uid: string) {
    const q = query(this.collectionRef, where('uid', '==', uid));
    const snapshot = await getDocs(q);
    this.userVideos = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    return this.userVideos;
  }
}
