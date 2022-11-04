import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FirebaseError } from '@angular/fire/app';
import { FormsModule } from '@angular/forms';
import { AppConfig } from 'src/app/app.config';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  passwordMinLength = AppConfig.validator.password.minLength;
  // need to create this container because [(ngModel)] and element reference cannot use the same name
  credentials = {
    email: '',
    password: '',
  };
  loading: boolean = false;
  error: string | null = null;

  constructor(private authService: AuthService) {}

  signInWithEmailAndPassword() {
    this.signIn(() =>
      this.authService.signIn(this.credentials.email, this.credentials.password)
    );
  }

  signInWithGoogle() {
    this.signIn(() => this.authService.signInWithGoogle());
  }

  signInWithGithub() {
    this.signIn(() => this.authService.signInWithGithub());
  }

  async signIn(cb: () => Promise<void>) {
    this.loading = true;
    this.error = null;
    try {
      await cb();
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        this.catchFirebaseLoginError(error);
      } else {
        this.error = error.message;
      }
    }

    this.loading = false;
  }

  catchFirebaseLoginError(error: FirebaseError) {
    console.log(error);
    switch (error.code) {
      case 'auth/invalid-email':
        this.error = this.invalidEmailError(this.credentials.email);
        break;
      case 'auth/wrong-password':
        this.error = this.wrongPasswordError();
        break;
      case 'auth/user-not-found':
        this.error = this.userNotFoundError(this.credentials.email);
        break;
      case 'auth/user-disabled':
        this.error = this.userDisabledError();
        break;
      case 'auth/account-exists-with-different-credential':
        this.error = this.accountExistsError(this.credentials.email);
        break;
      default:
        this.error = this.internalError();
    }
  }

  fieldRequiredError(field: string) {
    return `${field} cannot be empty`;
  }

  fieldMinLengthError(field: string, minLength: number) {
    return `${field} must be at least ${minLength} characters`;
  }

  invalidEmailError(email: string) {
    return `Email ${email} is not valid`;
  }

  accountExistsError(email: string) {
    return `Email ${email} exists under a different provider, please use that provider to sign in`;
  }

  wrongPasswordError() {
    return 'Password is not correct';
  }

  userNotFoundError(email: string) {
    return `There is no user registered under ${email}`;
  }

  userDisabledError() {
    return 'User is disabled';
  }

  internalError() {
    return 'Internal error, please try again later';
  }

  ngOnInit(): void {}
}
