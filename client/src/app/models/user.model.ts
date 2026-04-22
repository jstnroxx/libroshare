export interface UserReview {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: number;
  name: string;
  location: string;
  bio: string;
  rating: number;
  stats: {
    given: number;
    borrowed: number;
  };
  reviews: UserReview[]; 
}