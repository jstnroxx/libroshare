import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user';
import { AuthService } from '../../services/auth';
import { BookService } from '../../services/book';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  imports: [FormsModule],
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
  private authService: AuthService,
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
    this.user = { ...this.user, ...this.editData };
    this.isEditing = false;
    // Здесь обычно идет вызов к сервису: this.userService.updateUser(this.user).subscribe();
    this.cdr.detectChanges();
  }

  openReview() {
    this.showReviewModal = true;
  }

  closeReview() {
    this.showReviewModal = false;
  }

  submitReview() {
    const review = {
      id: Date.now(),
      author: 'You', // В реальности берем из AuthService
      rating: this.newReview.rating,
      comment: this.newReview.comment,
      date: new Date().toLocaleDateString()
    };
    this.user.reviews.push(review);
    this.closeReview();
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id'); 
      const idNum = Number(this.userId); 
      
      this.user = null;
      this.userBooks = []; 

      if (idNum) {
        this.isMyProfile = idNum === this.authService.getCurrentUserId();

        this.userService.getUserById(idNum).subscribe(data => {
          this.user = data;
          this.cdr.detectChanges(); 
        });

        this.bookService.getBooks().subscribe(allBooks => {
          this.userBooks = allBooks.filter(book => 
            book.instances.some(inst => inst.ownerId === idNum)
          );
          this.cdr.detectChanges(); 
        });
      }
    });
  }
}
