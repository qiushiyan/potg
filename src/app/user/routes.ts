import { Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [AuthGuard],
  },
];
