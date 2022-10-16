import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from 'src/app/services/modal.service';
import { AuthModalComponent } from 'src/app/user/auth-modal/auth-modal.component';
import { AppConfig } from 'src/app/app.config';
import { LinkComponent } from '../link/link.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LinkComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  modalId: string = AppConfig.modalIds.USER_AUTH_MODAL;

  constructor(private modalService: ModalService) {}

  toggleAuthModal() {
    this.modalService.toggleModal(this.modalId);
  }

  ngOnInit(): void {}
}
