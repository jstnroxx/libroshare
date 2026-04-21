import { Injectable, signal, WritableSignal } from '@angular/core';
import { single } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  isAuthenticated: WritableSignal<boolean> = signal(false);

  logIn(): void {
    this.isAuthenticated.set(true)
  }

  logOut(): void {
    this.isAuthenticated.set(false)
  }
}
