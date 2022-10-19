import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LinkComponent } from 'src/app/components/link/link.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, LinkComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  photoURL: string = '';
  videosOrder: string = 'desc'; // 1: desc, 2: asc

  constructor(
    public authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.authService.currentUser$.subscribe((user) => {
      this.photoURL = user?.photoURL || '';
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.videosOrder = params['sort'] || 'desc';
    });
  }

  sort(event: Event) {
    const { value } = event.target as HTMLSelectElement;
    this.router.navigateByUrl(`/me?sort=${value}`);
  }

  logout() {
    this.authService.logout();
  }
}
