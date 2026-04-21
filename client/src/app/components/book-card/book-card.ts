import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router'; 
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './book-card.html',
  styleUrls: ['./book-card.css'] 
})
export class BookCard {
  @Input() book!: Book;

  isAnyInstanceAvailable(book: Book): boolean {
    return book.instances && book.instances.some(inst => inst.isAvailable);
  }
}