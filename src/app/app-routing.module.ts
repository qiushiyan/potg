import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'me',
    loadComponent: () =>
      import('./user/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    data: { title: 'Profile' },
  },
  {
    path: 'videos',
    loadChildren: () => import('./video/routes').then((m) => m.routes),
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
