import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { ModalService } from 'src/app/services/modal.service';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
})
export class AuthModalComponent implements OnInit, OnDestroy {
  modalId: string = AppConfig.modalIds.USER_AUTH_MODAL;
  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.register(this.modalId);
  }

  ngOnDestroy(): void {
    this.modalService.deregister(this.modalId);
  }
}
