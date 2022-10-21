import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContainerComponent } from 'src/app/components/container/container.component';

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'] || '';
    });
  }
}
