import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class Auth {
  isAuthenticated: WritableSignal<boolean> = signal(false);

  private API_URL = 'http://localhost:8000/api';
  private http = inject(HttpClient)

  setTokens(access: string, refresh: string) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  logout() {
    this.http.post(`${this.API_URL}/logout/`, {
      refresh: this.getRefreshToken()
    }).subscribe()

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    this.isAuthenticated.set(false)
  }

  login(_username: string, _password: string): void {
    this.http.post(`${this.API_URL}/login/`, {
      username: _username,
      password: _password
    }).subscribe({
      next: (response: any) => {
        this.setTokens(response.access, response.refresh)

        this.isAuthenticated.set(true)
      },
      error: (err) => {
        console.error('Error:', err)
        this.isAuthenticated.set(false)
      }
    })
  }

  register(_username: string, _password: string): void {
    this.http.post(`${this.API_URL}/login/`, {
      username: _username,
      password: _password
    }).subscribe({
      next: (response: any) => {
        this.login(_username, _password)
      },
      error: (err) => {
        console.error('Error:', err)
      }
    })
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${this.API_URL}/refresh/`, {
      refresh: this.getRefreshToken()
    }).pipe(
      tap((response: any) => {
        this.setTokens(response.access, this.getRefreshToken()!)
      })
    )
  }
}
