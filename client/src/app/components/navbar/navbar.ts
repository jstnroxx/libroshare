import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  public authService = inject(Auth)
  
  private router = inject(Router)

  logout(): void {
    this.authService.logout()
    this.router.navigate(['/login'])
  }
}
