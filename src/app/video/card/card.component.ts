import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { Video } from 'src/app/models/video.model';
import { FbTimestampPipe } from 'src/app/pipes/fb-timestamp.pipe';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule, RouterModule, FbTimestampPipe],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class VideoCardComponent implements OnInit {
  @Input() video!: Video;
  @Input() width: number = 96;

  constructor(private modalService: ModalService) {}

  toggleEditModal() {
    this.modalService.toggleModal(AppConfig.modals.VIDEO_EDIT_MODAL.id);
  }

  ngOnInit(): void {}
}
