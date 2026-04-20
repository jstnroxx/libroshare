export interface Book {
  id: number;
  title: string;
  author: string;
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
}