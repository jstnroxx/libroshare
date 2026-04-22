import { Component, OnInit, inject } from '@angular/core'; 
import { RouterModule } from '@angular/router';
import { Book } from '../../models/book.model';
import { map } from 'rxjs/operators'; 
import { BookService } from '../../services/book';
import { Auth } from '../../services/auth';
import { Observable, tap } from 'rxjs';
import { AsyncPipe, DatePipe, CommonModule } from '@angular/common';
import { BookCard } from '../book-card/book-card';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [AsyncPipe, RouterModule, DatePipe, BookCard, CommonModule],
  templateUrl: './my-books.html',
  styleUrl: './my-books.css',
})
export class MyBooks implements OnInit {
  private bookService = inject(BookService);
  private authService = inject(Auth);

  myId: number | null = null;
  myLentBooks$!: Observable<Book[]>;
  myBorrowedBooks$!: Observable<Book[]>;

  ngOnInit(): void {
    this.myId = Number(this.authService.getUserIdFromToken());
    
    if (!this.myId) {
      console.warn('User ID not found. Are you logged in?');
      return;
    }

    const allBooks$ = this.bookService.getBooks().pipe(
      tap(books => console.log('All books from server:', books))
    );

    this.myLentBooks$ = allBooks$.pipe(
      map(books => books.filter(book => 
        book.instances && book.instances.some(inst => inst.ownerId === this.myId)
      ))
    );

    this.myBorrowedBooks$ = allBooks$.pipe(
      map(books => books.filter(book => 
        book.instances && book.instances.some(inst => inst.currentBorrowerId === this.myId)
      ))
    );
  }
}
