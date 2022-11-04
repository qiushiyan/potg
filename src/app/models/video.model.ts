import { FieldValue } from '@angular/fire/firestore';

export interface IVideo {
  uid: string;
  displayName: string;
  title: string;
  timestamp: FieldValue;
  videoUrl: string; // storage url
  videoFilename: string; // storage file name, used for deletion
  description?: string;
  screenshotUrl: string;
  screenshotFilename: string;
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
