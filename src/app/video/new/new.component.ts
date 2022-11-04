import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContainerComponent } from 'src/app/components/container/container.component';
import { VideoUploadComponent } from '../upload/upload.component';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [CommonModule, ContainerComponent, VideoUploadComponent],
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
