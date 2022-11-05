import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('bgVideo', { static: true }) bgVideo?: ElementRef;

  constructor(private videoService: VideoService) {
    this.videoService.getVideos();
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.handleScroll);
    // fix autoplay
    // this.bgVideo?.nativeElement.click();
    // this.bgVideo?.nativeElement.play();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    // offsetHeight: total page height
    // scrollTop: how much the user has scrolled
    // clientHeight: height of the window
    const { scrollTop, offsetHeight } = document.documentElement;
    const innerHeight = window.innerHeight;
    const bottomOfWindow = Math.round(scrollTop + innerHeight) === offsetHeight; // 50px buffer

    if (bottomOfWindow) {
      this.videoService.getVideos();
    }
  };
}
