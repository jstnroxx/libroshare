import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book';  
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-book.html',
  styleUrls: ['./add-book.css']
})
export class AddBook implements OnInit {
  searchTerm: string = '';
  searchResults: any[] = [];
  allBooks: any[] = [];
  selectedBook: any = null;

  newBook = {
    title: '',
    author: '',
    description: '',
    genre: ''
  };

  constructor(
    private bookService: BookService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.bookService.getBooks().subscribe((data: any[]) => {
      this.allBooks = data;
    });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    if (term.length > 2) {
      this.searchResults = this.allBooks.filter(b => 
        b.title.toLowerCase().includes(term) || 
        b.author.toLowerCase().includes(term)
      );
    } else {
      this.searchResults = [];
    }
  }

  selectBook(book: any) {
    this.selectedBook = book;
    this.searchTerm = book.title;
    this.searchResults = [];
  }

  clearSelection() {
    this.selectedBook = null;
    this.searchTerm = '';
  }

  addExistingBook() {
    if (this.selectedBook) {
      const instanceData = { book_id: this.selectedBook.id };
      this.bookService.addInstance(instanceData).subscribe({
        next: () => this.router.navigate(['/my-books']),
        error: (err) => console.error(err)
      });
    }
  }

  addNewBook() {
    const finalBook = { ...this.newBook, title: this.searchTerm };
    this.bookService.addBook(finalBook).subscribe({
      next: () => this.router.navigate(['/my-books']),
      error: (err) => console.error(err)
    });
  }
}
