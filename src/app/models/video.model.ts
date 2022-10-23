import { FieldValue } from '@angular/fire/firestore';

export interface IVideo {
  uid: string;
  displayName: string;
  title: string;
  url: string; // firebase storage url
  timestamp: FieldValue;
  description?: string;
  public: boolean;
  watches: number;
}

export interface UpdateVideo {
  title?: string;
  description?: string;
  public?: boolean;
}

export interface UpdateVideoEvent {
  id: string;
  title: string;
  description: string;
  public: boolean;
}

// video services injects id
export type Video = IVideo & { id: string };
