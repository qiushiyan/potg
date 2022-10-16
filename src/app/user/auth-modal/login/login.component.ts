import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { AppConfig } from 'src/app/app.config';
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

  constructor(private authService: AuthService) {}

  loginWithGithub() {
    this.authService.loginWithGithub();
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  onSubmit() {
    this.loading = true;
  }

  fieldRequiredError(field: string) {
    return `${field} cannot be empty`;
  }

  fieldMinLengthError(field: string, minLength: number) {
    return `${field} must be at least ${minLength} characters`;
  }

  invalidEmailError() {
    return 'Email is not a valid address';
  }

  wrongPasswordError() {
    return 'Password is not correct';
  }

  ngOnInit(): void {}
}
