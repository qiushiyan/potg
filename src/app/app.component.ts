import { Component } from '@angular/core';
import { AppConfig } from './app.config';
import { AuthService } from './services/auth.service';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'potg';
  constructor(
    private authService: AuthService,
    private modalService: ModalService
  ) {
    this.authService.currentUser$.subscribe((user) => {
      // hide auth modal if user is logged in
      if (
        user &&
        this.modalService.isModalVisible(AppConfig.modalIds.USER_AUTH_MODAL.id)
      ) {
        this.modalService.toggleModal(AppConfig.modalIds.USER_AUTH_MODAL.id);
      }
    });
  }
}
