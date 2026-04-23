import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Book, BookInstance } from '../../models/book.model';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './book-card.html', 
  styleUrl: './book-card.css' 
})
export class BookCard {
  @Input() book!: Book;
  @Input() currentUserId: string | number = '';

  isModalOpen = false;
  selectedInstance: BookInstance | null = null;
  reviewText: string = '';
  reviewRating: number = 0;
  isSubmitting = false;
  
  isImagePreviewOpen = false;
  selectedImage: string | null = null;

  isAnyInstanceAvailable(book: Book): boolean {
    if (!book || !book.instances) return false;
    return book.instances.some(inst => inst.isAvailable);
  }

  goBack() {
    window.history.back();
  }

  openRequestModal(instance: BookInstance) {
    this.selectedInstance = instance;
    this.isModalOpen = true;
    this.reviewText = '';
    this.reviewRating = 0;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedInstance = null;
  }

  setRating(star: number) {
    this.reviewRating = star;
  }

  openImagePreview(photo: string) {
    this.selectedImage = photo;
    this.isImagePreviewOpen = true;
  }

  closeImagePreview() {
    this.isImagePreviewOpen = false;
    this.selectedImage = null;
  }

  sendReview() {
    if (!this.reviewText.trim() || this.reviewRating === 0) return;
    
    this.isSubmitting = true;
    setTimeout(() => {
      console.log('Review sent:', this.reviewText, this.reviewRating);
      this.isSubmitting = false;
      this.closeModal();
    }, 1000);
  }

  manageInstance(item: BookInstance) {
    console.log('Managing instance:', item);
  }
}