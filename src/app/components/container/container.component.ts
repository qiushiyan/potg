import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class ContainerComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
