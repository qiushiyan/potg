import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { ContainerComponent } from 'src/app/components/container/container.component';
import { LinkComponent } from 'src/app/components/link/link.component';
import { IUser } from 'src/app/models/user.model';
import { UpdateVideoEvent, Video } from 'src/app/models/video.model';
import { ExcerptPipe } from 'src/app/pipes/excerpt.pipe';
import { FbTimestampPipe } from 'src/app/pipes/fb-timestamp.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';
import { VideoService } from 'src/app/services/video.service';
import { VideoCardComponent } from 'src/app/video/card/card.component';
import { VideoDeleteComponent } from 'src/app/video/delete/delete.component';
import { VideoEditComponent } from 'src/app/video/edit/edit.component';
import { VideoListComponent } from 'src/app/video/list/list.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    LinkComponent,
    ContainerComponent,
    VideoEditComponent,
    VideoListComponent,
    VideoCardComponent,
    VideoDeleteComponent,
    FbTimestampPipe,
    RouterModule,
    ExcerptPipe,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: IUser | null = null;
  photoURL: string | null = null;
  videosOrder: 'asc' | 'desc' = 'desc'; // 1: desc, 2: asc
  activeVideo: Video | null = null;

  constructor(
    public authService: AuthService,
    public videoService: VideoService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.videoService.getUserVideos();
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.videoService.getUserVideos(user);
      }
    });
  }

  ngOnDestroy(): void {
    // this.videoService.userVideos = [];
  }

  toggleEditModal(event: Event, video: Video) {
    event.preventDefault();
    event.stopPropagation();
    this.activeVideo = video;
    this.modalService.toggleModal(AppConfig.modals.VIDEO_EDIT_MODAL.id);
  }

  toggleDeleteModal(event: Event, video: Video) {
    event.preventDefault();
    event.stopPropagation();
    this.activeVideo = video;
    this.modalService.toggleModal(AppConfig.modals.VIDEO_DELETE_MODAL.id);
  }

  updateVideo(event: UpdateVideoEvent) {
    this.videoService.getUserVideos();
  }

  deleteVideo() {
    this.videoService.getUserVideos();
  }

  logout() {
    this.authService.logout();
  }
}
