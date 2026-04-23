import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8000/api/books/';
  private similarUrl = 'http://localhost:8000/api/books/similar/';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  addBook(bookData: any): Observable<any> {
    return this.http.post(this.apiUrl, bookData);
  }

  addInstance(instanceData: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/add-instance/', instanceData);
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}${id}/`);
  }

  getSimilarBooks(genre: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.similarUrl}?genre=${encodeURIComponent(genre)}`);
  }

  getMyShelf(): Observable<Book[]> {
    return this.http.get<Book[]>('http://localhost:8000/api/my-shelf/');
  }
}
