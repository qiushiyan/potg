import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { map, of, switchMap } from 'rxjs';
import { IUser } from '../models/user.model';
import { IVideo, UpdateVideo, Video } from '../models/video.model';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

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

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private storageService: StorageService
  ) {
    this.collectionRef = collection(
      this.firestore,
      'videos'
    ) as CollectionReference<IVideo>;
  }

  async createVideo(data: IVideo) {
    return await addDoc(this.collectionRef, data);
  }

  async deleteVideo(data: Video) {
    await this.storageService.delete(data.videoFilename);
    await this.storageService.delete(data.screenshotFilename);
    await deleteDoc(doc(this.collectionRef, data.id));
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
        where('public', '==', true),
        orderBy('timestamp', 'desc'),
        limit(12),
        startAfter(lastVideo)
      );
    } else {
      q = query(
        this.collectionRef,
        where('public', '==', true),
        orderBy('timestamp', 'desc'),
        limit(12)
      );
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

  getUserClips() {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user) {
          return of([]);
        }
        const q = query(this.collectionRef, where('uid', '==', user.uid));
        return getDocs(q);
      }),
      map((snapshot) => {
        if (snapshot instanceof Array) {
          return [];
        } else {
          return snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          });
        }
      })
    );
  }

  async getUserVideos(user: IUser | null) {
    if (!user) {
      this.userVideos = [];
    } else {
      const q = query(this.collectionRef, where('uid', '==', user.uid));
      const snapshot = await getDocs(q);
      this.userVideos = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
    }

    return this.userVideos;
  }

  async updateVideo(id: string, data: UpdateVideo) {
    return await updateDoc(doc(this.collectionRef, id), data);
  }

  async incrementWatches(id: string) {
    const incr = increment(1);
    return await updateDoc(doc(this.collectionRef, id), { watches: incr });
  }
}
