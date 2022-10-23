import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { DocumentReference, serverTimestamp } from '@angular/fire/firestore';
import {
  getDownloadURL,
  UploadTask,
  UploadTaskSnapshot,
} from '@angular/fire/storage';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
    RouterModule,
  ],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class VideoUploadComponent implements OnInit, OnDestroy {
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
  // video upload task, cancelled when component is destroyed
  videoUploadTask: UploadTask | null = null;

  // video in firestore
  video: DocumentReference<IVideo> | null = null;

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });
  // description is optional
  description = new FormControl('');
  // default to public
  public = new FormControl(true, {
    nonNullable: true,
  });

  uploadForm = new FormGroup({
    title: this.title,
    description: this.description,
    public: this.public,
  });

  constructor(
    private authSerivce: AuthService,
    private toastrService: ToastrService,
    private storageSerivce: StorageService,
    private videoService: VideoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.videoUploadSuccessful.subscribe((success) => {
      this.resetAll();
      if (success) {
        this.toastrService.success('Video uploaded successfully');
        setTimeout(() => {
          this.router.navigate(['/videos', this.video?.id]);
        }, 1000);
      } else {
        this.toastrService.error(
          this.catchFirebaseStorageError(this.videoUploadError as FirebaseError)
        );
      }
      this.videoUploadError = null;
    });
  }

  ngOnDestroy(): void {
    this.videoUploadTask?.cancel();
  }

  resetAll() {
    this.uploadForm.enable();
    this.videoUploading = false;
    this.formUploading = false;
    this.submitButtonText = 'Publish';
    this.formVisible = false;
    this.videoUploadPercent = 0;
    this.file = null;
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

  uploadFileClick(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
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
    this.uploadForm.disable();
    if (!this.file) {
      this.toastrService.info('Please upload a mp4 file first');
      this.resetAll();
      return;
    }
    this.videoUploading = true;
    this.submitButtonText = 'Uploading video ...';
    const { task, fileName } = this.storageSerivce.upload(this.file);
    this.videoUploadTask = task;
    this.videoUploadTask.on('state_changed', {
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

        const url = await getDownloadURL(this.videoUploadTask!.snapshot.ref);

        const video: IVideo = {
          uid: this.authSerivce.currentUser!.uid,
          displayName: this.authSerivce.currentUser!.displayName,
          title: this.title.value,
          public: this.public.value,
          fileName: fileName,
          url: url,
          watches: 0,
          timestamp: serverTimestamp(),
        };

        if (this.description.value) {
          video.description = this.description.value;
        }

        try {
          this.video = await this.videoService.createVideo(video);
          this.toastrService.success('Video uploaded successfully');
          this.videoUploadSuccessful.next(true);
        } catch (error) {
          this.videoUploadSuccessful.next(false);
        }
      },
    });
  }
}
