import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class ProgressComponent implements OnInit {
  @Input() percentage: number = 0;
  constructor() {}

  ngOnInit(): void {}
}
