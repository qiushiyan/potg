import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';
import { VideoCardComponent } from '../card/card.component';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule, VideoCardComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class VideoListComponent implements OnInit, OnDestroy {
  constructor(public videoService: VideoService) {
    this.videoService.getVideos();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.videoService.pageVideos = [];
  }
}
