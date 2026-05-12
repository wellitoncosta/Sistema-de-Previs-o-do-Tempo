import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  isDarkMode = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isDarkMode = document.body.classList.contains('dark-mode');
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.authService.getProfile(userId).subscribe({
        next: (res) => {
          if (res.success) {
            this.user = res.user;
          }
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
