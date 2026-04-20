import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../../models/book.model';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book';
import { BookInstance } from '../../models/book.model';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-details.html', 
  styleUrls: ['./book-details.css']    
})
export class BookDetails implements OnInit {
  book: Book | undefined;
  similarBooks: Book[] = [];
  isModalOpen = false;
  selectedInstance: BookInstance | null = null;
  isImagePreviewOpen = false;
  selectedImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService 
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      
      this.bookService.getBookById(id).subscribe(book => {
        this.book = book;
        
        if (book) {
          this.bookService.getSimilarBooks(book.genre, book.id).subscribe(similar => {
            this.similarBooks = similar;
            
            window.scrollTo(0, 0);
          });
        }
      });
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedInstance = null;
  }

  openRequestModal(instance: BookInstance) {
    this.selectedInstance = instance;
    this.isModalOpen = true;
  }

  openImagePreview(photo: string) {
    this.selectedImage = photo;
    this.isImagePreviewOpen = true;
  }

  closeImagePreview() {
    this.isImagePreviewOpen = false;
    this.selectedImage = null;
  }
}
