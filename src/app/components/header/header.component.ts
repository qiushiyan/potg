import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { IUser } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';
import { LinkComponent } from '../link/link.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LinkComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  modalId: string = AppConfig.modals.USER_AUTH_MODAL.id;
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
