import { Component, OnInit } from '@angular/core';
import { ContainerComponent } from '../components/container/container.component';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  imports: [ContainerComponent],
  standalone: true,
})
export class NotFoundComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
