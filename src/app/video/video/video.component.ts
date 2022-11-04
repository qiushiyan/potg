import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContainerComponent } from 'src/app/components/container/container.component';
import { IVideo } from 'src/app/models/video.model';
import { FbTimestampPipe } from 'src/app/pipes/fb-timestamp.pipe';
import { VideoService } from 'src/app/services/video.service';
import videojs from 'video.js';

// one video clip for videos/:id
@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule, ContainerComponent, FbTimestampPipe],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VideoComponent implements OnInit {
  id: string = '';
  video: IVideo | null = null;
  player?: videojs.Player;
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService
  ) {}

  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement);
    this.route.params.subscribe((params) => {
      this.id = params['id'] || '';
    });
    if (this.id) {
      this.videoService.incrementWatches(this.id);
      this.videoService.getVideo(this.id).then((video) => {
        console.log(video);
        this.video = video;
        this.player?.src({
          src: this.video!.videoUrl!,
          type: 'video/mp4',
        });
      });
    }
  }
}
