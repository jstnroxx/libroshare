import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book.model';
import { RouterModule } from '@angular/router';
import { BookService } from '../../services/book';
import { OnInit } from '@angular/core';
import { BookCard } from '../book-card/book-card';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule, RouterModule, BookCard, AsyncPipe],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList implements OnInit {
  books$!: Observable<Book[]>; 

  constructor(private bookService: BookService) {} 

  ngOnInit(): void {
    this.books$ = this.bookService.getBooks();
  }
}
