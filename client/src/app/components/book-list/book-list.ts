import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book.model';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList {
  books: Book[] = [
  {
    id: 1,
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian social science fiction novel and cautionary tale about totalitarianism.',
    condition: 'used',
    owner: 101,
    available: true,
    cover: '1984.jpeg',
    year: 1949
  },
  {
    id: 2,
    title: 'The Count of Monte Cristo',
    author: 'Alexandre Dumas',
    description: 'An adventure novel dealing with themes of hope, justice, vengeance, and forgiveness.',
    condition: 'new',
    owner: 102,
    available: false, 
    cover: 'monte.jpg',
    year: 1844
  },
  {
    id: 3,
    title: 'Three Comrades',
    author: 'Erich Maria Remarque',
    description: 'A story of three friends in 1920s Germany, struggling to survive and find love.',
    condition: 'used',
    owner: 101,
    available: true,
    cover: 'comrades.jpg',
    year: 1936
  },
  {
    id: 4,
    title: 'The Idiot',
    author: 'Fyodor Dostoevsky',
    description: 'Dostoevsky examines the effect of a truly "good" man on the corrupt world around him.',
    condition: 'used',
    owner: 103,
    available: true,
    cover: 'idiot.jpeg',
    year: 1869
  },
  {
    id: 5,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A classic novel following Elizabeth Bennet as she deals with manners, upbringing, and marriage.',
    condition: 'new',
    owner: 104,
    available: true,
    cover: 'pride.jpg',
    year: 1813
  }
];
}
