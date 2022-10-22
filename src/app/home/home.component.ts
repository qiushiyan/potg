import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { VideoService } from '../services/video.service';
import { AuthModalComponent } from '../user/auth-modal/auth-modal.component';
import { VideoListComponent } from '../video/list/list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    AuthModalComponent,
    RouterModule,
    VideoListComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private videoService: VideoService) {}

  ngOnInit(): void {
    this.videoService.getVideos();
  }
}
