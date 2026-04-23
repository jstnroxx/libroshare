import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Book, BookInstance } from '../../models/book.model';
import { BookService } from '../../services/book';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, FormsModule],
  templateUrl: './book-details.html',
  styleUrls: ['./book-details.css']
})
export class BookDetails implements OnInit {
  book: Book | null = null;
  isLoading = true;
  similarBooks: Book[] = []; // Array for similar books
  
  selectedInstance: BookInstance | null = null;
  isModalOpen = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadBookData(id);
      }
    });
  }

  loadBookData(id: number): void {
    this.isLoading = true;
    this.similarBooks = []; // Reset list

    this.bookService.getBookById(id).subscribe({
      next: (data) => {
        this.book = data;
        this.isLoading = false;
        
        // FETCH SIMILAR BOOKS LOGIC
        if (data.genre) {
          this.bookService.getSimilarBooks(data.genre).subscribe({
            next: (list) => {
              // Filter out the current book so it doesn't recommend itself
              this.similarBooks = list.filter(b => b.id !== id).slice(0, 4);
              this.cdr.detectChanges();
            }
          });
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openRequestModal(instance: BookInstance): void {
    this.selectedInstance = instance;
    this.isModalOpen = true;
  }

  goBack(): void {
    this.location.back();
  }
}