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
  ],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class VideoUploadComponent implements OnInit {
  file: File | null = null;
  formVisible: boolean = false;

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

  ngOnInit(): void {}

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
    this.file = event.dataTransfer?.files.item(0) || null;
    if (!this.file || this.file.type !== 'video/mp4') {
      this.toastrService.info('File must be non-empty and in mp4 format');
      this.file = null;
    } else {
      this.formVisible = true;
      // set title to file name (without extension)
      this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));

      this.storageSerivce.upload(this.file);
    }
  }

  storeFile() {}
}
