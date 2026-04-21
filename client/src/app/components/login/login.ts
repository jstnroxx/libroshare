import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginMode: boolean = true

  username: string = '';
  password: string = '';
  confirmedPassword: string = '';
  isSubmitting: boolean = false;

  private authService = inject(Auth)
  private router = inject(Router)

  clearInputs(): void {
    this.username = '';
    this.password = '';
    this.confirmedPassword = '';
    this.isSubmitting = false
  }

  login(): void {
    this.isSubmitting = true

    setTimeout(() => {
      this.clearInputs()
      this.authService.logIn()
      this.router.navigate(['/books'])
    }, 1000)
  }

  register(): void {
    this.isSubmitting = true

    setTimeout(() => {
      this.clearInputs()
      this.authService.logIn()
      this.router.navigate(['/books'])
    }, 1000)
  }

  toggleMode(): void {
    this.loginMode = !this.loginMode
  }
}
