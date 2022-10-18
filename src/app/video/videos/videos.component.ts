import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { VideoListComponent } from '../list/list.component';
import { VideoUploadComponent } from '../upload/upload.component';

// home page for /videos
@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule, VideoListComponent, VideoUploadComponent],
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
