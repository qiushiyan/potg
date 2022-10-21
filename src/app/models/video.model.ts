export interface IVideo {
  uid: string;
  title: string;
  url: string; // firebase storage url
  timestamp: number;
  description?: string;
}
