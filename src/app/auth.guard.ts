import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppConfig } from './app.config';
import { AuthService } from './services/auth.service';
import { ModalService } from './services/modal.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  modalId = AppConfig.modalIds.USER_AUTH_MODAL.id;

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: ModalService
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
        this.router.navigate(['/']);
        return false;
      }
    });

    return of(false);
  }
}
