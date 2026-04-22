import { Component, inject, signal, WritableSignal } from '@angular/core';
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

  errorMsg: WritableSignal<string> = signal('');

  private authService = inject(Auth)
  private router = inject(Router)

  clearInputs(): void {
    this.username = '';
    this.password = '';
    this.confirmedPassword = '';
    this.isSubmitting = false
  }

  login(): void {
    this.isSubmitting = true;
    this.errorMsg.set('');

    if (this.username && this.password) {
        this.authService.login(this.username, this.password).subscribe({
            next: () => {
                this.clearInputs();
                this.router.navigate(['/my-books']);
            },
            error: (err) => {
                this.errorMsg.set(JSON.stringify(err));
                this.clearInputs();
            }
        });
    }
  }

  register(): void {
    this.isSubmitting = true;
    this.errorMsg.set('');

    if (this.username && this.password && this.confirmedPassword) {
        if (this.password === this.confirmedPassword) {
            this.authService.register(this.username, this.password).subscribe({
                next: () => {
                    this.clearInputs();
                    this.router.navigate(['/books']);
                },
                error: (err) => {
                    this.errorMsg.set(JSON.stringify(err));
                    this.clearInputs();
                }
            });
        } else {
            this.errorMsg.set('Passwords are not identical.');
            this.clearInputs();
        }
    }
  }

  toggleMode(): void {
    this.loginMode = !this.loginMode;
    this.clearInputs();
    this.errorMsg.set('');
  }
}
