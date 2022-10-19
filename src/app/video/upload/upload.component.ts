import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeadingComponent } from 'src/app/components/heading/heading.component';
import { EventBlockerDirective } from 'src/app/directives/event-blocker.directive';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [CommonModule, HeadingComponent, EventBlockerDirective],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class VideoUploadComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
