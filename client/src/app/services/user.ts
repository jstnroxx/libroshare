import { Injectable } from '@angular/core';
import { User } from '../models/user.model'; // ПРОВЕРЬ ПУТЬ до файла модели
import { of, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private users: User[] = [
    {
      id: 1,
      name: 'Alice Smith',
      location: 'Almaty',
      bio: 'Collector of rare tech books.',
      rating: 4.9,
      stats: { given: 12, borrowed: 5 },
      reviews: [
        { id: 1, author: 'Sofia', rating: 5, comment: 'slay.', date: '2026-04-01' }
      ]
    },
    {
      id: 102,
      name: 'Bob Johnson',
      location: 'Astana',
      bio: 'Aspiring writer and book lover.',
      rating: 4.5,
      stats: { given: 8, borrowed: 3 },
      reviews: [
        { id: 2, author: 'Alice', rating: 4, comment: 'good guy.', date: '2026-04-02' }
      ]
    },
    {
      id: 103,
      name: 'Charlie Davis',
      location: 'Shymkent',
      bio: 'Tech enthusiast and avid reader.',
      rating: 4.7,
      stats: { given: 10, borrowed: 4 },
      reviews: [
      ]
    }
  ];

  getUserById(id: number): Observable<User | undefined> {
    const user = this.users.find(u => u.id === id);
    return of(user);
  }
}