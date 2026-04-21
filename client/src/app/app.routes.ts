import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { BookList } from './components/book-list/book-list';
import { BookDetails } from './components/book-details/book-details';
import { MyBooks } from './components/my-books/my-books';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'books', component: BookList },
    { path: 'books/:id', component: BookDetails },
    { path: 'my-books', component: MyBooks }
];
