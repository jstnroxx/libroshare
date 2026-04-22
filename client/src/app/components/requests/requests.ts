import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RequestService } from '../../services/requests';
import { Request } from '../../models/request.model'; 
import { DatePipe, AsyncPipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { take, map, catchError, shareReplay, finalize, timeout } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

import { BookService } from '../../services/book';

@Component({
  selector: 'app-requests',
  imports: [DatePipe, AsyncPipe, RouterModule, FormsModule],
  templateUrl: './requests.html',
  styleUrl: './requests.css',
})
export class Requests implements OnInit {
    private nameCache: { [bookId: string]: Observable<string> } = {};

    private requestService = inject(RequestService);
    private bookService = inject(BookService);
    private cdr = inject(ChangeDetectorRef);

// Mock Incoming Request (Someone wants your book)
 mockIncoming: Request[] = [
  {
    id: 101,
    for_days: 72,
    status: 'pending',
    created_at: new Date(),
    requester: {
      id: 2,
      name: 'Alice Smith',
      location: 'Brooklyn',
      bio: 'Avid reader',
      rating: 4.5,
      stats: { given: 2, borrowed: 10 },
      reviews: []
    },
    bookInstance: {
      id: 50,
      ownerId: 1, // Your ID
      ownerName: 'John Doe',
      ownerRating: 4.8,
      condition: 'Like New',
      realPhotos: ['https://example.com'],
      instanceReviews: [],
      isAvailable: true,
      pendingRequestsCount: 1
    }
  },
  {
    id: 102,
    for_days: 3,
    status: 'approved',
    created_at: new Date(),
    resolved_at: new Date(),
    requester: {
      id: 2,
      name: 'Alice Smith',
      location: 'Brooklyn',
      bio: 'Avid reader',
      rating: 4.5,
      stats: { given: 2, borrowed: 10 },
      reviews: []
    },
    bookInstance: {
      id: 50,
      ownerId: 1, // Your ID
      ownerName: 'John Doe',
      ownerRating: 4.8,
      condition: 'Like New',
      realPhotos: ['https://example.com'],
      instanceReviews: [],
      isAvailable: true,
      pendingRequestsCount: 1
    }
  },
  {
    id: 103,
    for_days: 6,
    status: 'rejected',
    created_at: new Date(),
    resolved_at: new Date(),
    requester: {
      id: 2,
      name: 'Alice Smith',
      location: 'Brooklyn',
      bio: 'Avid reader',
      rating: 4.5,
      stats: { given: 2, borrowed: 10 },
      reviews: []
    },
    bookInstance: {
      id: 50,
      ownerId: 1, // Your ID
      ownerName: 'John Doe',
      ownerRating: 4.8,
      condition: 'Like New',
      realPhotos: ['https://example.com'],
      instanceReviews: [],
      isAvailable: true,
      pendingRequestsCount: 1
    }
  }
];

// Mock Outgoing Request (You want someone else's book)
 mockOutgoing: Request[] = [
  {
    id: 104,
    for_days: 1,
    status: 'pending',
    created_at: new Date(),
    requester: {
      id: 1,
      name: 'John Doe',
      location: 'New York',
      bio: 'Book lover',
      rating: 4.8,
      stats: { given: 5, borrowed: 2 },
      reviews: []
    },
    bookInstance: {
      id: 60,
      ownerId: 3,
      ownerName: 'Bob Vance',
      ownerRating: 4.2,
      condition: 'Good',
      realPhotos: ['https://example.com'],
      instanceReviews: [],
      isAvailable: true,
      pendingRequestsCount: 3
    }
  },
  {
    id: 104,
    for_days: 2,
    status: 'rejected',
    created_at: new Date(),
    resolved_at: new Date(),
    requester: {
      id: 1,
      name: 'John Doe',
      location: 'New York',
      bio: 'Book lover',
      rating: 4.8,
      stats: { given: 5, borrowed: 2 },
      reviews: []
    },
    bookInstance: {
      id: 60,
      ownerId: 3,
      ownerName: 'Bob Vance',
      ownerRating: 4.2,
      condition: 'Good',
      realPhotos: ['https://example.com'],
      instanceReviews: [],
      isAvailable: true,
      pendingRequestsCount: 3
    }
  },
  {
    id: 104,
    for_days: 4,
    status: 'approved',
    created_at: new Date(),
    resolved_at: new Date(),
    requester: {
      id: 1,
      name: 'John Doe',
      location: 'New York',
      bio: 'Book lover',
      rating: 4.8,
      stats: { given: 5, borrowed: 2 },
      reviews: []
    },
    bookInstance: {
      id: 60,
      ownerId: 3,
      ownerName: 'Bob Vance',
      ownerRating: 4.2,
      condition: 'Good',
      realPhotos: ['https://example.com'],
      instanceReviews: [],
      isAvailable: true,
      pendingRequestsCount: 3
    }
  }
];
// END MOCKS
    
  incomingRequests: Request[] | null = null;
  outgoingRequests: Request[] | null = null;

  isLoading = false

  batchRatingGT: number | null = null;
  batchRatingLT: number | null = null;

  ngOnInit(): void {
      const allRequests$ = this.requestService.getMyRequests()

      allRequests$.subscribe((data) => {
          this.incomingRequests = this.mockIncoming; //data.incoming;
          this.outgoingRequests = this.mockOutgoing; //data.outgoing;
          
          this.cdr.detectChanges()
      })
  }

  getBookNameById$(bookId: number): Observable<string> {
    if (!this.nameCache[bookId]) {
        this.nameCache[bookId] = this.bookService.getBookById(bookId).pipe(
            take(1),
            map(book => book?.title || 'untitled'),
            catchError(error => {
                return of('untitled');
            }),

            shareReplay(1)
        );
    }

    return this.nameCache[bookId];
  }

 acceptRequest(reqId: number): void {
    this.isLoading = true

    this.requestService.updateRequest(reqId, 'approved').pipe(
        take(1),
        timeout(5000),
        finalize(() => {
            setTimeout(() => {
                this.isLoading = false
                this.cdr.detectChanges()
            }, 500)
        })
    ).subscribe();
  }

 declineRequest(reqId: number): void {
    this.isLoading = true

    this.requestService.updateRequest(reqId, 'rejected').pipe(
        take(1),
        timeout(5000),
        finalize(() => {
            setTimeout(() => {
                this.isLoading = false
                this.cdr.detectChanges()
            }, 500)
        })
    ).subscribe();
  }

  batchAccept(): void {
    if (!this.incomingRequests) return;

    if (this.batchRatingGT) {
        if (this.batchRatingGT < 0 || this.batchRatingGT > 5) {
            this.batchRatingGT = 5;
        };
    } else {
        this.batchRatingGT = 0;
    };

    for (let request of this.incomingRequests) {
        if (request.requester.rating > this.batchRatingGT) this.acceptRequest(request.id);
    };
  }

  batchDecline(): void {
    if (!this.incomingRequests) return;

    if (this.batchRatingLT) {
        if (this.batchRatingLT < 0 || this.batchRatingLT > 5) {
            this.batchRatingLT = 0;
        };
    } else {
        this.batchRatingLT = 5;
    };

    for (let request of this.incomingRequests) {
        if (request.requester.rating < this.batchRatingLT) this.declineRequest(request.id);
    };
  }
}
