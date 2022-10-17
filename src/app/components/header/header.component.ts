import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from 'src/app/services/modal.service';
import { AppConfig } from 'src/app/app.config';
import { LinkComponent } from '../link/link.component';
import { AuthService } from 'src/app/services/auth.service';
import { IUser } from 'src/app/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LinkComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  modalId: string = AppConfig.modalIds.USER_AUTH_MODAL;
  user: IUser | null = null;

  constructor(
    public authService: AuthService,
    private modalService: ModalService
  ) {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });
  }

  toggleAuthModal() {
    this.modalService.toggleModal(this.modalId);
  }

  ngOnInit(): void {}
}
