import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppConfig } from 'src/app/app.config';
import { InputComponent } from 'src/app/components/input/input.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  passwordMinLength = AppConfig.validator.password.minLength;
  usernameMinLength = AppConfig.validator.username.minLength;
  loading: boolean = false;

  email: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  password: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(this.passwordMinLength),
  ]);
  username: FormControl = new FormControl('', [
    Validators.minLength(this.usernameMinLength),
  ]);

  registerForm = new FormGroup({
    email: this.email,
    password: this.password,
    username: this.username,
  });

  constructor() {}

  isFormInvalid() {
    return !this.registerForm.valid;
  }

  onSubmit() {
    this.loading = true;
  }

  ngOnInit(): void {}
}
