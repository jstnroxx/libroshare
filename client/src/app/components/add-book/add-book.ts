import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book';  
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';

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
    genre: '',
    year: null
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
      const instanceData = { 
        book_id: this.selectedBook.id, 
        condition: 'Good'        
      };

      this.bookService.addInstance(instanceData).subscribe({
        next: (response) => {
          console.log('Success:', response.message);
          this.router.navigate(['/my-books']);
        },
        error: (err) => {
          console.error('Backend error:', err.error);
        }
      });
    }
  }

  addNewBook() {
  const finalBook = { 
    ...this.newBook, 
    title: this.searchTerm,
    condition: 'Good' 
  };

  this.bookService.addBook(finalBook).subscribe({
    next: (createdBook) => {
      console.log('Книга и оффер созданы одной командой в Django!', createdBook);
      this.router.navigate(['/my-books']);
    },
    error: (err) => {
      console.error('Ошибка:', err);
      alert('Ошибка при создании книги.');
    }
  });
}
}
