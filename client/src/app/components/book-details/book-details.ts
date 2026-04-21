import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../../models/book.model';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book';
import { BookInstance } from '../../models/book.model';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './book-details.html', 
  styleUrls: ['./book-details.css']    
})
export class BookDetails implements OnInit {
  currentUserId = 1; // should be replaced with actual user ID from auth service
  book!: Book | undefined;

  similarBooks: Book[] = [];

  isModalOpen = false;
  selectedInstance: BookInstance | null = null;

  isImagePreviewOpen = false;
  selectedImage: string | null = null;

  reviewRating: number = 0;
  reviewText: string = ''; 
  isSubmitting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location
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

  manageInstance(instance: BookInstance) {
    console.log('Managing my copy:', instance.id);
  }

  setRating(value: number) {
    this.reviewRating = value;
  }

  sendReview() {
    if (!this.reviewText.trim() || this.reviewRating === 0) return;
    
    this.isSubmitting = true;

    setTimeout(() => {
      console.log('Review successfully saved to database');
      
      this.isSubmitting = false;
      this.reviewText = '';
      this.reviewRating = 0;
      
      this.closeModal(); 
      
      alert('Thank you! Your review has been submitted.');
    }, 1000);
  }

  goBack() {
    this.location.back();
  }
}
