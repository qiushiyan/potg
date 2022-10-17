import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({ providedIn: 'root' })
export class EmailExistsValidator implements AsyncValidator {
  constructor(private authService: AuthService) {}

  // async validator to test if an email exists on firebase
  // error logic depends on whether we are doing sign in or register
  validate = async (
    control: AbstractControl
  ): Promise<ValidationErrors | null> => {
    return this.authService
      .fetchSignInMethodForEmail(control.value)
      .then((response) => {
        return response.length > 0 ? { emailExists: true } : null;
      });
  };
}
