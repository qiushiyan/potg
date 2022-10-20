import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HeadingComponent } from 'src/app/components/heading/heading.component';
import { InputComponent } from 'src/app/components/input/input.component';
import { ProgressComponent } from 'src/app/components/progress/progress.component';
import { EventBlockerDirective } from 'src/app/directives/event-blocker.directive';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [
    CommonModule,
    HeadingComponent,
    EventBlockerDirective,
    ReactiveFormsModule,
    InputComponent,
    ProgressComponent,
  ],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class VideoUploadComponent implements OnInit {
  file: File | null = null;
  formVisible: boolean = false;
  // if the video is in submission
  videoUploading: boolean = false;
  // video upload progress
  videoUploadPercent = 0;
  // if the form (title, description) is in submission
  formUploading: boolean = false;
  // text for submit button
  submitButtonText: string = 'Publish';

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });
  description = new FormControl('', Validators.minLength(3));

  uploadVideoForm = new FormGroup({
    title: this.title,
    description: this.description,
  });

  constructor(
    private toastrService: ToastrService,
    private storageSerivce: StorageService
  ) {}

  ngOnInit(): void {
    this.storageSerivce.uploadPercent$.subscribe((percent) => {
      this.videoUploadPercent = percent;
    });
    this.storageSerivce.uploadSuccessful$.subscribe((ok) => {
      this.videoUploading = false;
      this.submitButtonText = 'Publish';
      if (!ok) {
        this.toastrService.error('Upload failed, please try again later');
      }
    });
  }

  catchFirebaseStorageError(error: FirebaseError) {
    switch (error.code) {
      case 'storage/unauthorized':
        return 'Uploaded file should be in mp4 format and not exceed 100MB';
      case 'storage/quota-exceeded':
        return 'Storage quota exceeded, contact authoro at qiushi.yann@gmail.com';
      case 'storage/invalid-argument':
        return 'Invalid file format, please upload a mp4 file';
      default:
        return 'Upload failed, please try again later';
    }
  }

  uploadFile(event: DragEvent) {
    const file = event.dataTransfer?.files.item(0);
    if (!file || file.type !== 'video/mp4') {
      this.toastrService.info('file must be non-empty and in mp4 format');
    } else {
      this.file = file;
      this.formVisible = true;
      // set title to file name (without extension)
      this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    }
  }

  onSubmit() {
    if (!this.file) {
      this.toastrService.info('Please upload a video file first');
      return;
    }

    this.videoUploading = true;
    this.submitButtonText = 'Uploading video ...';

    const task = this.storageSerivce.upload(this.file);
  }
}
