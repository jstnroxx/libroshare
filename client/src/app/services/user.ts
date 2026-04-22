import { Injectable } from '@angular/core';
import { User } from '../models/user.model'; 
import { Observable } from 'rxjs'; 
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private API_URL = 'http://localhost:8000/api/profile'; 

  constructor(private http: HttpClient) {}

  updateUser(user: any): Observable<any> {
    return this.http.patch(`${this.API_URL}/`, user);
  }

  getMyProfile(): Observable<any> {
    return this.http.get(`${this.API_URL}/`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}/`);
  }
}