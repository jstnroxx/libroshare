import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserId = 1; // Simulated logged-in user ID

  constructor() { }

  getCurrentUserId(): number {
    return this.currentUserId;
  }
}