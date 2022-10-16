import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { ModalService } from 'src/app/services/modal.service';
import { AppConfig } from 'src/app/app.config';
import { TabsContainerComponent } from 'src/app/components/tabs-container/tabs-container.component';
import { TabComponent } from 'src/app/components/tab/tab.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    TabsContainerComponent,
    TabComponent,
    LoginComponent,
    RegisterComponent,
  ],
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
