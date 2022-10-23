import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { Video } from 'src/app/models/video.model';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class VideoCardComponent implements OnInit {
  @Input() video!: Video;

  constructor(private modalService: ModalService) {}

  toggleEditModal() {
    this.modalService.toggleModal(AppConfig.modals.VIDEO_EDIT_MODAL.id);
  }

  ngOnInit(): void {}
}
