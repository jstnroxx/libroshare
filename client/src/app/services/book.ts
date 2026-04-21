import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private books: Book[] = [
    { 
      id: 1, 
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Fiction',
      year: 1960,
      cover: 'book.jpg',
      description: 'A novel about the serious issues of rape and racial inequality.',
      totalBorrows: 0,
      instances: [
        {
          id: 1,
          ownerId: 1,
          ownerName: 'Alice',
          ownerRating: 4.5,
          condition: 'used',
          isAvailable: true,
          realPhotos: ['real.jpeg', 'real.jpeg'],
          instanceReviews: [
            {
              reviewerId: 201,
              reviewerName: 'Charlie',
              rating: 5,
              comment: 'Great condition, very clean copy!',
              date: new Date('2024-01-15')
            },
            {
              reviewerId: 202,
              reviewerName: 'Bob',
              rating: 4,
              comment: 'Good book, but the cover is a bit worn.',
              date: new Date('2024-01-20')
            }
          ],
          pendingRequestsCount: 2
        },
        {
          id: 2,
          ownerId: 102,
          ownerName: 'Bob',
          ownerRating: 4.0,
          condition: 'new',
          isAvailable: true,
          realPhotos: ['real.jpeg'],
          instanceReviews: [],
          pendingRequestsCount: 0
        }
      ]
    },
    { 
      id: 2, 
      title: 'The Great Gatsby', 
      author: 'F. Scott Fitzgerald', 
      genre: 'Classic Literature',
      year: 1925, 
      cover: 'book.jpg', 
      description: 'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
      totalBorrows: 0,
      instances: [
        {
          id: 3,
          ownerId: 103,
          ownerName: 'Charlie',
          ownerRating: 4.2,
          condition: 'used',
          isAvailable: false,
          currentBorrowerId: 1,
          nextAvailableDate: new Date('2024-03-01'),
          realPhotos: ['real.jpeg'],
          instanceReviews: [
            {
              reviewerId: 101,
              reviewerName: 'Alen',
              rating: 4,
              comment: 'Good condition, but a few pages are slightly worn.',
              date: new Date('2024-02-10')
            }
          ],
          pendingRequestsCount: 1
        },
        {
          id: 4,
          ownerId: 104,
          ownerName: 'Dave',
          ownerRating: 4.8,
          condition: 'new',
          isAvailable: true,
          realPhotos: ['real.jpeg'],
          instanceReviews: [],
          pendingRequestsCount: 0
        }
      ]
    },
      {
      id: 3,
      title: '1984',
      author: 'George Orwell',
      genre: 'Dystopian Fiction',
      description: 'A dystopian social science fiction novel and cautionary tale about totalitarianism.',
      year: 1949,
      cover: 'book.jpg',
      totalBorrows: 0,
      instances: [
        {
          id: 4,
          ownerId: 1,
          ownerName: 'Alice',
          ownerRating: 4.5,
          condition: 'used',
          isAvailable: true,
          realPhotos: ['real.jpeg'],
          instanceReviews: [
            {
              reviewerId: 201,
              reviewerName: 'Bob',
              rating: 5,
              comment: 'Excellent condition, very enjoyable read!',
              date: new Date('2024-03-05')
            }
          ],
          pendingRequestsCount: 0
        }
      ]
    },
      {
      id: 4,
      title: 'Brave New World',
      author: 'Aldous Huxley',
      genre: 'Dystopian Fiction',
      description: 'A dystopian novel set in a technologically advanced future where society is engineered for maximum efficiency and happiness.',
      year: 1932,
      cover: 'book.jpg',
      totalBorrows: 0,
      instances: [

      ]
    }, 
    {
      id: 5,
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      genre: 'Fiction',
      year: 1951,
      cover: 'book.jpg',
      description: 'A story about the events in the life of a young man named Holden Caulfield.',
      totalBorrows: 0,
      instances: []
    }
  ];

  constructor() { }

  getBooks(): Observable<Book[]> {
    return of(this.books).pipe(delay(500));
  }
  
  getBookById(id: number): Observable<Book | undefined> {
    const book = this.books.find(b => b.id === id);
    return of(book);
  }

  getSimilarBooks(genre: string, currentBookId: number): Observable<Book[]> {
    const similar = this.books.filter(book => 
      book.genre === genre && book.id !== currentBookId
    );
    return of(similar);
  }
}