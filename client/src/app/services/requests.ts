import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; 
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private API_URL = 'http://localhost:8000/api/requests'; 

  constructor(private http: HttpClient) {}

  getMyRequests(): Observable<any> {
    return this.http.get(this.API_URL);
  }

  sendRequest(bookId: number): Observable<any> {
    return this.http.post(this.API_URL, {book: bookId});
  }

  updateRequest(reqId: number, _status: 'approved' | 'pending' | 'rejected'): Observable<any> {
    return this.http.patch(`${this.API_URL}/actions/${reqId}`, {status: _status});
  }
}