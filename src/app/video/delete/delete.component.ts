import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { AppConfig } from 'src/app/app.config';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { Video } from 'src/app/models/video.model';
import { ModalService } from 'src/app/services/modal.service';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-video-delete',
  standalone: true,
  imports: [CommonModule, ModalComponent, AlertComponent],
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class VideoDeleteComponent implements OnInit, OnDestroy {
  modalId = AppConfig.modals.VIDEO_DELETE_MODAL.id;
  modalTitle = AppConfig.modals.VIDEO_DELETE_MODAL.title;
  @Input() activeVideo: Video | null = null;
  @Output() delete = new EventEmitter();

  inSubmission: boolean = false;
  submitButtonText: string = 'Delete';
  error: string = '';

  constructor(
    private modalService: ModalService,
    private videoService: VideoService
  ) {}

  ngOnInit(): void {
    this.modalService.register(this.modalId, this.modalTitle);
  }

  ngOnDestroy(): void {
    this.modalService.deregister(this.modalId);
  }

  catchDeleteError(err: any) {
    if (err instanceof FirebaseError) {
      console.log(err);
      switch (err.code) {
        case 'storage/object-not-found':
          this.error =
            'this video may be already deleted, please refresh the page';
      }
    } else {
      this.error = 'internal server error, please try again later';
    }
  }

  async deleteVideo(event: Event) {
    event.preventDefault();
    if (this.activeVideo) {
      this.inSubmission = true;
      this.submitButtonText = 'Deleting...';
      try {
        await this.videoService.deleteVideo(this.activeVideo);
        this.delete.emit();
        this.modalService.toggleModal(this.modalId);
      } catch (err) {
        this.catchDeleteError(err);
      }

      this.inSubmission = false;
      this.submitButtonText = 'Delete';
    }
  }
}
