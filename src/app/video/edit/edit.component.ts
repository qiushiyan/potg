import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppConfig } from 'src/app/app.config';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { InputComponent } from 'src/app/components/input/input.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { UpdateVideoEvent, Video } from 'src/app/models/video.model';
import { ModalService } from 'src/app/services/modal.service';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-video-edit',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    ReactiveFormsModule,
    InputComponent,
    AlertComponent,
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class VideoEditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeVideo: Video | null = null;
  @Output() update = new EventEmitter<UpdateVideoEvent>();

  modalId: string = AppConfig.modals.VIDEO_EDIT_MODAL.id;
  modalTitle: string = AppConfig.modals.VIDEO_EDIT_MODAL.title;

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });
  description = new FormControl('', {
    nonNullable: true,
  });
  public = new FormControl(false, {
    nonNullable: true,
  });
  editForm = new FormGroup({
    title: this.title,
    description: this.description,
    public: this.public,
  });

  inSubmission: boolean = false;
  submitButtonText: string = 'Update';
  error: string = '';

  constructor(
    private modalService: ModalService,
    private videoService: VideoService
  ) {}

  ngOnInit(): void {
    this.modalService.register(this.modalId, this.modalTitle);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.activeVideo) {
      this.title.setValue(this.activeVideo.title);
      this.description.setValue(this.activeVideo.description || '');
      this.public.setValue(this.activeVideo.public);
    } else {
      this.editForm.reset();
    }
  }

  ngOnDestroy(): void {
    this.modalService.deregister(this.modalId);
  }

  catchError(err: any) {
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case 'not-found':
          this.error = 'video not found, this clip is already deleted';
          break;
      }
    } else {
      this.error = 'internal error updating the video, please try again later';
    }
  }

  async onSubmit() {
    this.submitButtonText = 'Updating...';
    this.inSubmission = true;
    const newVideo = {
      title: this.title.value,
      description: this.description.value,
      public: this.public.value,
    };

    try {
      await this.videoService.updateVideo(this.activeVideo!.id, newVideo);
      this.modalService.toggleModal(this.modalId);
    } catch (err) {
      console.error(err);
      this.catchError(err);
    }
    this.update.emit({ id: this.activeVideo!.id, ...newVideo });
    this.submitButtonText = 'Update';
    this.inSubmission = false;
  }
}
