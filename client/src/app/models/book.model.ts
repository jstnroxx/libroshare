export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  condition: 'new' | 'used';
  owner: number; 
  available: boolean;
  cover?: string;
  year?: number;
}