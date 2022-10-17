import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, AlertComponent, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Input() field!: FormControl;
  @Input() name!: string; // used as form control name, also as label text
  @Input() placeholder: string = ''; // input placeholder text
  @Input() type: string = 'text'; // input type
  @Input() required: boolean = true; // if the field is required
  @Input() minLength: number = 0; // if the field has a mininum length
  @Input() ariaLabel: string = '';

  isChanged() {
    return this.field.touched && this.field.dirty;
  }

  isRequired() {
    return this.required && this.field.hasError('required');
  }

  isRequiredError() {
    return `${this.name} cannot be empty`;
  }

  isMinLength() {
    return this.minLength !== 0 && this.field.hasError('minlength');
  }

  isMinLengthError() {
    return `${this.name} must be at least ${this.minLength} characters`;
  }

  isEmail() {
    return this.field.hasError('email');
  }

  isEmailError() {
    return `${this.name} must be a valid email address`;
  }

  constructor() {}

  ngOnInit(): void {
    if (this.placeholder === '') {
      this.placeholder = this.name;
    }
    if (this.ariaLabel === '') {
      this.ariaLabel = this.name;
    }
  }
}
