import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { AppConfig } from './app.config';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  modalId = AppConfig.modals.USER_AUTH_MODAL.id;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        return true;
      } else {
        const url = this.router.url;
        this.router.navigate(['/']);
        if (this.toastr.toasts.length === 0) {
          this.toastr.info(`You need to be logged in to access ${url}`);
        }
        return false;
      }
    });

    return of(true);
  }
}
