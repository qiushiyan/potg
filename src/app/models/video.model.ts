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

// video services injects id
export type Video = IVideo & { id: string };
