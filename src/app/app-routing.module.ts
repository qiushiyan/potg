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
    loadChildren: () => import('./user/routes').then((m) => m.routes),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'clips',
    loadChildren: () => import('./video/routes').then((m) => m.routes),
  },
  {
    path: 'videos',
    redirectTo: 'clips',
  },
  {
    path: 'upload',
    redirectTo: 'clips/new',
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
