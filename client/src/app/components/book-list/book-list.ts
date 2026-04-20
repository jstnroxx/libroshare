import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book.model';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList implements OnInit {
  books: Book[] = [];

  constructor(private bookService: BookService) {} 

  ngOnInit(): void {
    this.bookService.getBooks().subscribe(data => {
      this.books = data;
    });
  }

  isAnyInstanceAvailable(book: Book): boolean {
    return book.instances.some(instance => instance.isAvailable);
  }
}
