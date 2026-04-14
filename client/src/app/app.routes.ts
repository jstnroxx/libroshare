import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { BookList } from './components/book-list/book-list';
import { BookDetail } from './components/book-detail/book-detail';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'books', component: BookList },
    { path: 'books/:id', component: BookDetail }
];
