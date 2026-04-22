import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs'; // Добавил of для обработки ошибок

@Injectable({
  providedIn: 'root',
})
export class Auth {
  isAuthenticated: WritableSignal<boolean> = signal(!!localStorage.getItem('access_token'));

  private API_URL = 'http://localhost:8000/api';
  private http = inject(HttpClient);

  get currentUserId(): number | null {
    return this.getUserIdFromToken();
  }

  setTokens(access: string, refresh: string) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    this.isAuthenticated.set(true); 
  }

  getAccessToken() { return localStorage.getItem('access_token'); }
  getRefreshToken() { return localStorage.getItem('refresh_token'); }

  getUserIdFromToken(): number | null {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64)); 
      return payload.user_id || payload.sub || null;
    } catch (e) {
      return null;
    }
  }

  logout() {
    const refresh = this.getRefreshToken();
    if (refresh) {
      this.http.post(`${this.API_URL}/logout/`, { refresh }).subscribe();
    }
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isAuthenticated.set(false);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login/`, { username, password }).pipe(
      tap((res: any) => this.setTokens(res.access, res.refresh))
    );
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/register/`, { username, password }).pipe(
      tap((res: any) => this.setTokens(res.access, res.refresh))
    );
  }

  refreshToken(): Observable<any> {
    const refresh = this.getRefreshToken();
    if (!refresh) return of(null);

    return this.http.post(`${this.API_URL}/refresh/`, { refresh }).pipe(
      tap((res: any) => this.setTokens(res.access, refresh))
    );
  }
}