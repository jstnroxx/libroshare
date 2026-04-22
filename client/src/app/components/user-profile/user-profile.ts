import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '../../services/auth';
import { BookService } from '../../services/book';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfile implements OnInit {
  userId: string | null = null;
  user: any; 
  isMyProfile: boolean = false;
  userBooks: any[] = [];
  isEditing = false;
  showReviewModal = false;

  editData = { name: '', bio: '', location: '' };
  newReview = { rating: 5, comment: '' };

  constructor(
  private route: ActivatedRoute,
  private userService: UserService,
  private authService: Auth,
  private bookService: BookService,
  private cdr: ChangeDetectorRef
) {}

  toggleEdit() {
    if (!this.isEditing) {
      this.editData = { ...this.user };
    }
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    const updatedUser = { ...this.user, ...this.editData };
    this.userService.updateUser(updatedUser).subscribe({
      next: (res: any) => {
        this.user = res; 
        this.isEditing = false;
        this.cdr.detectChanges();
        console.log('Profile updated successfully!');
      },
      error: (err: any) => {
        console.error('Failed to update profile', err);
        alert('Could not save changes. Please try again.');
      }
    });
  }

  openReview() {
    this.showReviewModal = true;
  }

  closeReview() {
    this.showReviewModal = false;
  }

  submitReview() {
    const myId = this.authService.getUserIdFromToken();
    
    const review = {
      id: Date.now(),
      author: `User #${myId}`, 
      rating: this.newReview.rating,
      comment: this.newReview.comment,
      date: new Date().toLocaleDateString()
    };

    if (!this.user.reviews) {
      this.user.reviews = [];
    }

    this.user.reviews.push(review);
    this.closeReview();
    this.newReview = { rating: 5, comment: '' }; 
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idFromUrl = params.get('id');
      if (!idFromUrl) return;

      const idNum = Number(idFromUrl);
      const myId = Number(this.authService.getUserIdFromToken());

      this.isMyProfile = (idNum === myId);
      this.userBooks = [];

      const profileRequest = this.isMyProfile 
        ? this.userService.getMyProfile() 
        : this.userService.getUserById(idNum);

      profileRequest.subscribe({
        next: (data) => {
          this.user = data;
          if (!this.user.reviews) this.user.reviews = []; 
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.warn('Profile fetch failed:', err);
          this.user = { 
            name: this.isMyProfile ? 'Your Profile' : 'User', 
            bio: 'Information not provided.',
            location: 'Earth',
            reviews: [] 
          };
          this.cdr.detectChanges();
        }
      });

      this.bookService.getBooks().subscribe({
        next: (allBooks: any[]) => {
          console.log('Books check for ID:', idNum, allBooks); 
          
          this.userBooks = allBooks.filter(book => 
          book.instances && book.instances.some((inst: any) => 
                  Number(inst.ownerId) === Number(idNum)
           ));
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Could not load books:', err)
      });
    });
  }
}