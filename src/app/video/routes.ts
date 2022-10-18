import { Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./videos/videos.component').then((m) => m.VideosComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./upload/upload.component').then((m) => m.VideoUploadComponent),
    canActivate: [AuthGuard],
  },
];
