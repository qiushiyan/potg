import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { ContainerComponent } from 'src/app/components/container/container.component';
import { LinkComponent } from 'src/app/components/link/link.component';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';
import { VideoListComponent } from '../list/list.component';
import { VideoUploadComponent } from '../upload/upload.component';

// home page for /videos
@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [
    CommonModule,
    VideoListComponent,
    VideoUploadComponent,
    ContainerComponent,
    LinkComponent,
  ],
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements OnInit {
  modalId: string = AppConfig.modals.USER_AUTH_MODAL.id;

  constructor(
    public authService: AuthService,
    private modalService: ModalService
  ) {}

  toggleAuthModal() {
    this.modalService.toggleModal(this.modalId);
  }

  ngOnInit(): void {}
}
