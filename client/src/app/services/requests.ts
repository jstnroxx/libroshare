import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RequestUser {
    id: number;
    username: string;
    rating: number;
}

export interface RequestsResponse {
    incoming: any[];
    outgoing: any[];
}

@Injectable({
    providedIn: 'root'
})
export class RequestService {
    private apiUrl = 'http://localhost:8000/api';

    constructor(private http: HttpClient) {}

    getMyRequests(): Observable<RequestsResponse> {
        return this.http.get<RequestsResponse>(`${this.apiUrl}/requests/`);
    }

    sendRequest(offerId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/requests/`, { offer: offerId });
    }

    updateRequest(id: number, status: 'approved' | 'rejected'): Observable<any> {
        return this.http.patch(`${this.apiUrl}/requests/action/${id}/`, { status });
    }
}