import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AppRoutingModule } from 'src/app/app-routing.module';

@Component({
  selector: 'app-link',
  standalone: true,
  imports: [AppRoutingModule, CommonModule],
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
})
export class LinkComponent implements OnInit {
  @Input() href?: string;

  constructor() {}

  ngOnInit(): void {}
}
