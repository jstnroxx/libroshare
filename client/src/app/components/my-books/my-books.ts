import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Book } from '../../models/book.model';
import { map } from 'rxjs/internal/operators/map';
import { BookService } from '../../services/book';
import { Observable } from 'rxjs';
import { OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { BookCard } from '../book-card/book-card';


@Component({
  selector: 'app-my-books',
  imports: [AsyncPipe, RouterModule, DatePipe, BookCard],
  templateUrl: './my-books.html',
  styleUrl: './my-books.css',
})
export class MyBooks implements OnInit {
  myId = 1; //should be replaced with actual user ID from auth service

  myLentBooks$!: Observable<Book[]>;
  
  myBorrowedBooks$!: Observable<Book[]>;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    const allBooks$ = this.bookService.getBooks();

    this.myLentBooks$ = allBooks$.pipe(
      map(books => books.filter(book => 
        book.instances.some(inst => inst.ownerId === this.myId)
      ))
    );

    this.myBorrowedBooks$ = allBooks$.pipe(
      map(books => books.filter(book => 
        book.instances.some(inst => inst.currentBorrowerId === this.myId)
      ))
    );
  }
}
