import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseError } from '@angular/fire/app';

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

  loginWithGithub() {
    this.authService.loginWithGithub();
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  async onSubmit() {
    this.loading = true;
    this.error = null;
    try {
      await this.authService.login(
        this.credentials.email,
        this.credentials.password
      );
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/wrong-password') {
          this.credentials.password = '';
          this.error = this.wrongPasswordError();
        } else if (error.code === 'auth/user-not-found') {
          this.credentials.email = '';
          this.credentials.password = '';
          this.error = this.userNotFoundError(this.credentials.email);
        } else if (error.code === 'auth/user-disabled') {
          this.error = this.userDisabledError();
        } else if (error.code === 'auth/invalid-email') {
          this.credentials.email = '';
          this.error = this.invalidEmailError(this.credentials.email);
        }
      } else {
        this.error = error.message;
      }
    }

    this.loading = false;
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
