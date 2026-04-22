import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../user-profile/user-profile';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  constructor(public authService: Auth, private router: Router) {}

  get myId(): number | null {
    return this.authService.getUserIdFromToken();
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(['/login'])
  }
}
