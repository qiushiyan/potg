import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { ContainerComponent } from 'src/app/components/container/container.component';
import { LinkComponent } from 'src/app/components/link/link.component';
import { UpdateVideoEvent, Video } from 'src/app/models/video.model';
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
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  photoURL: string = '';
  videosOrder: string = 'desc'; // 1: desc, 2: asc
  userVideos: Video[] = [];
  activeVideo: Video | null = null;

  constructor(
    public authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public videoService: VideoService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.videoService.getUserVideos(user);
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      this.videosOrder = params['sort'] || 'desc';
    });
  }

  ngOnDestroy(): void {}

  sort(event: Event) {
    const { value } = event.target as HTMLSelectElement;
    this.router.navigateByUrl(`/me?sort=${value}`);
  }

  toggleEditModal(event: Event, video: Video) {
    event.preventDefault();
    this.activeVideo = video;
    this.modalService.toggleModal(AppConfig.modals.VIDEO_EDIT_MODAL.id);
  }

  toggleDeleteModal(event: Event, video: Video) {
    event.preventDefault();
    this.activeVideo = video;
    this.modalService.toggleModal(AppConfig.modals.VIDEO_DELETE_MODAL.id);
  }

  updateVideo(event: UpdateVideoEvent) {
    this.videoService.getUserVideos(this.authService.currentUser);
  }

  deleteVideo() {
    this.videoService.getUserVideos(this.authService.currentUser);
  }

  logout() {
    this.authService.logout();
  }
}
