import { Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { VideoService } from '../services/video.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./videos/videos.component').then((m) => m.VideosComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./new/new.component').then((m) => m.NewComponent),
    canActivate: [AuthGuard],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./video/video.component').then((m) => m.VideoComponent),
    resolve: {
      video: VideoService,
    },
  },
];
