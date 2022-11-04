import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContainerComponent } from 'src/app/components/container/container.component';
import { IVideo } from 'src/app/models/video.model';
import { FbTimestampPipe } from 'src/app/pipes/fb-timestamp.pipe';
import { VideoService } from 'src/app/services/video.service';
import videojs from 'video.js';
import { VideoCardComponent } from '../card/card.component';

// one video clip for videos/:id
@Component({
  selector: 'app-video',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    FbTimestampPipe,
    VideoCardComponent,
  ],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VideoComponent implements OnInit, OnDestroy {
  id: string = '';
  video: IVideo | null = null;
  player?: videojs.Player;
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;

  constructor(
    private route: ActivatedRoute,
    public videoService: VideoService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement);
    this.route.params.subscribe((params) => {
      this.id = params['id'] || '';
      this.videoService.getVideos(this.id);
      this.videoService.incrementWatches(this.id);
    });
    this.route.data.subscribe((data) => {
      this.video = data['video'] as IVideo;
      this.player?.src({
        src: this.video?.videoUrl,
        type: 'video/mp4',
      });
    });
  }

  ngOnDestroy(): void {
    this.videoService.pageVideos = [];
  }

  async copyLink(event: Event) {
    event.preventDefault();
    if (this.video) {
      const url = `${window.location.origin}/clips/${this.id}`;
      await navigator.clipboard.writeText(url);
      this.toastrService.info('Link copied to clipboard');
    }
  }
}
