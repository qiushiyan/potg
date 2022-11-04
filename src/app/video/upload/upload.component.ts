import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { DocumentReference, serverTimestamp } from '@angular/fire/firestore';
import {
  getDownloadURL,
  StorageReference,
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
import { AppConfig } from 'src/app/app.config';
import { ContainerComponent } from 'src/app/components/container/container.component';
import { HeadingComponent } from 'src/app/components/heading/heading.component';
import { InputComponent } from 'src/app/components/input/input.component';
import { EventBlockerDirective } from 'src/app/directives/event-blocker.directive';
import { IVideo } from 'src/app/models/video.model';
import { AuthService } from 'src/app/services/auth.service';
import { FFmpegService } from 'src/app/services/ffmpeg.service';
import { ModalService } from 'src/app/services/modal.service';
import { StorageService } from 'src/app/services/storage.service';
import { VideoService } from 'src/app/services/video.service';
import { v4 as uuid } from 'uuid';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [
    CommonModule,
    HeadingComponent,
    EventBlockerDirective,
    ReactiveFormsModule,
    InputComponent,
    RouterModule,
    SafeUrlPipe,
    ContainerComponent,
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
  videoRef: StorageReference | null = null;

  // ffmpeg state
  screenshots: string[] = [];
  screenshotRef: StorageReference | null = null;
  screenshotFilename: string | null = null;
  selectedScreenshot: string | null = null;

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
    private toastrService: ToastrService,
    private storageSerivce: StorageService,
    private videoService: VideoService,
    public authService: AuthService,
    public ffmpegService: FFmpegService,
    private modalService: ModalService,
    private router: Router
  ) {
    this.ffmpegService.init();
  }

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

  toggleAuthModal() {
    this.modalService.toggleModal(AppConfig.modals.USER_AUTH_MODAL.id);
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

  async uploadFile(event: DragEvent | Event) {
    let file;
    if (event instanceof DragEvent) {
      // file created through drag and drop
      file = event.dataTransfer?.files.item(0);
    } else {
      // file created through file input
      const input = event.target as HTMLInputElement;
      file = input.files?.item(0);
    }

    if (!file || file.type !== 'video/mp4') {
      this.toastrService.info('file must be non-empty and in mp4 format');
    } else {
      this.screenshots = await this.ffmpegService.getScreenshots(file);
      this.selectedScreenshot = this.screenshots[0];
      this.file = file;
      this.formVisible = true;
      // set title to file name (without extension)
      this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    }
  }

  selectScreenshot(screenshot: string) {
    this.selectedScreenshot = screenshot;
  }

  async onSubmit() {
    this.uploadForm.disable();
    if (!this.file) {
      this.toastrService.info('Please upload a mp4 file first');
      this.resetAll();
      return;
    }
    this.videoUploading = true;
    this.submitButtonText = 'Uploading video ...';

    const screenshotBlob = await this.ffmpegService.blobFromURL(
      this.selectedScreenshot!
    );
    const fileName = uuid();

    try {
      const { screenshotRef, screenshotFilename } =
        await this.storageSerivce.uploadScreenshot(screenshotBlob, fileName);
      this.screenshotRef = screenshotRef;
      this.screenshotFilename = screenshotFilename;
    } catch {
      this.toastrService.error(
        'Failed to upload screenshot, please try again later'
      );
      this.resetAll();
      return;
    }

    const { videoFilename, videoTask, videoRef } =
      this.storageSerivce.uploadVideo(this.file, fileName);
    this.videoUploadTask = videoTask;
    this.videoRef = videoRef;

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

        const videoUrl = await getDownloadURL(this.videoRef!);
        const screenshotUrl = await getDownloadURL(this.screenshotRef!);

        const video: IVideo = {
          title: this.title.value,
          public: this.public.value,
          videoUrl: videoUrl,
          videoFilename: videoFilename,
          screenshotUrl: screenshotUrl,
          screenshotFilename: this.screenshotFilename!,
          watches: 0,
          timestamp: serverTimestamp(),
          user: {
            uid: this.authService.currentUser!.uid,
            displayName: this.authService.currentUser!.displayName,
            photoURL: this.authService.currentUser!.photoURL,
          },
        };

        if (this.description.value) {
          video.description = this.description.value;
        }

        try {
          this.video = await this.videoService.createVideo(video);
          this.screenshots.forEach((screenshot) => {
            URL.revokeObjectURL(screenshot);
          });
          this.toastrService.success('Video uploaded successfully');
          this.videoUploadSuccessful.next(true);
        } catch (error) {
          this.videoUploadSuccessful.next(false);
        }
      },
    });
  }
}
