import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppConfig } from 'src/app/app.config';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { InputComponent } from 'src/app/components/input/input.component';
import { AuthService } from 'src/app/services/auth.service';
import { EmailExistsValidator } from '../../validators/email';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, AlertComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  passwordMinLength = AppConfig.validator.password.minLength;
  usernameMinLength = AppConfig.validator.username.minLength;
  loading: boolean = false;
  // firebase registeration error
  error: string | null = null;

  email: FormControl = new FormControl(
    '',
    [Validators.required, Validators.email],
    [this.emailExistsValidator.validate]
  );
  password: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(this.passwordMinLength),
  ]);
  username: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(this.usernameMinLength),
  ]);

  registerForm = new FormGroup({
    email: this.email,
    password: this.password,
    username: this.username,
  });

  constructor(
    private authService: AuthService,
    private emailExistsValidator: EmailExistsValidator
  ) {}

  isFormInvalid() {
    return !this.registerForm.valid;
  }

  async register() {
    this.loading = true;
    this.error = null;
    const { email, password, username } = this.registerForm.value;
    try {
      await this.authService.register(email, password, username);
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          this.error = `Email ${this.email.value} is already registered`;
        } else {
          this.error = 'An internal error occured. Please try again later.';
        }
      } else {
        this.error = error.message;
      }
    }

    this.loading = false;
  }

  ngOnInit(): void {}
}
