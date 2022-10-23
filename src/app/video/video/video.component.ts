import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContainerComponent } from 'src/app/components/container/container.component';
import { VideoService } from 'src/app/services/video.service';

// one video clip for videos/:id
@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule, ContainerComponent],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  id: string = '';

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'] || '';
    });
    if (this.id) {
      this.videoService.incrementWatches(this.id);
    }
  }
}
