import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { getDownloadURL, UploadTaskSnapshot } from '@angular/fire/storage';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { HeadingComponent } from 'src/app/components/heading/heading.component';
import { InputComponent } from 'src/app/components/input/input.component';
import { ProgressComponent } from 'src/app/components/progress/progress.component';
import { EventBlockerDirective } from 'src/app/directives/event-blocker.directive';
import { IVideo } from 'src/app/models/video.model';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { VideoService } from 'src/app/services/video.service';

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

  videoUploadError: FirebaseError | null = null;

  // true when both video and form are uploaded successfully
  // fales when video upload failed
  videoUploadSuccessful = new Subject<boolean>();

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
    private authSerivce: AuthService,
    private toastrService: ToastrService,
    private storageSerivce: StorageService,
    private videoService: VideoService
  ) {}

  ngOnInit(): void {
    this.videoUploadSuccessful.subscribe((success) => {
      this.videoUploading = false;
      this.formUploading = false;
      this.videoUploadPercent = 0;
      this.submitButtonText = 'Publish';
      this.formVisible = false;
      this.videoUploadPercent = 0;
      this.submitButtonText = 'Publish';
      this.file = null;
      if (success) {
        this.toastrService.success('Video uploaded successfully');
      } else {
        this.toastrService.error(
          this.catchFirebaseStorageError(this.videoUploadError as FirebaseError)
        );
      }
      this.videoUploadError = null;
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
    task.on('state_changed', {
      next: (snapshot: UploadTaskSnapshot) => {
        this.videoUploadPercent =
          snapshot.bytesTransferred / snapshot.totalBytes;
      },
      error: (error: Error) => {
        this.videoUploadSuccessful.next(false);
      },
      complete: async () => {
        this.videoUploading = false;
        this.formUploading = true;
        this.submitButtonText = 'Uploading metadata ...';
        this.videoUploadError = null;

        const url = await getDownloadURL(task.snapshot.ref);

        const video: IVideo = {
          uid: this.authSerivce.currentUser!.uid,
          title: this.title.value,
          url: url,
          timestamp: Date.now(),
        };

        if (this.description.value) {
          video.description = this.description.value;
        }

        try {
          await this.videoService.createVideo(video);
          this.toastrService.success('Video uploaded successfully');
          this.videoUploadSuccessful.next(true);
        } catch (error) {
          this.videoUploadSuccessful.next(false);
        }
      },
    });
  }
}
