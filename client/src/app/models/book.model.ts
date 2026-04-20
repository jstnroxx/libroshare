export interface Book {
  id: number;
  title: string;
  author: string;
<<<<<<< HEAD
  genre: string; 
  description: string;
  year: number;
  cover: string;
  totalBorrows: number; 
  instances: BookInstance[];
}

export interface BookReview {
  reviewerId: number;
  reviewerName: string;
  rating: number; 
  comment: string; 
  date: Date;
}

export interface BookInstance {
  ownerId: number;
  ownerName: string;
  ownerRating: number; 

  condition: string;
  realPhotos: string[];
  instanceReviews: BookReview[];

  isAvailable: boolean;
  currentBorrowerId?: number; 
  nextAvailableDate?: Date; 
  
  pendingRequestsCount: number;
=======
  description: string;
  condition: 'new' | 'used';
  owner: number; 
  available: boolean;
  cover?: string;
  year?: number;
>>>>>>> main
}