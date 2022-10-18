import { Routes } from '@angular/router';
import { VideoUploadComponent } from './upload/upload.component';
import { VideosComponent } from './videos/videos.component';

export const routes: Routes = [
  {
    path: '',
    component: VideosComponent,
  },
  {
    path: 'new',
    component: VideoUploadComponent,
  },
];
