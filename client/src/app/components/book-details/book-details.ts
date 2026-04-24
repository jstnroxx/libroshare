import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Book, BookInstance } from '../../models/book.model';
import { BookService } from '../../services/book';
import { RequestService } from '../../services/requests';

@Component({
    selector: 'app-book-details',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterModule, FormsModule],
    templateUrl: './book-details.html',
    styleUrls: ['./book-details.css']
})
export class BookDetails implements OnInit {
    book: Book | null = null;
    isLoading = true;
    similarBooks: Book[] = [];

    selectedInstance: BookInstance | null = null;
    isModalOpen = false;
    requestSent = false;
    requestError = '';

    constructor(
        private route: ActivatedRoute,
        private bookService: BookService,
        private requestService: RequestService,
        private location: Location,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = Number(params.get('id'));
            if (id) this.loadBookData(id);
        });
    }

    loadBookData(id: number): void {
        this.isLoading = true;
        this.similarBooks = [];

        this.bookService.getBookById(id).subscribe({
            next: (data) => {
                this.book = data;
                this.isLoading = false;
                if (data.genre) {
                    this.bookService.getSimilarBooks(data.genre).subscribe({
                        next: (list) => {
                            this.similarBooks = list.filter(b => b.id !== id).slice(0, 4);
                            this.cdr.detectChanges();
                        }
                    });
                }
                this.cdr.detectChanges();
            },
            error: () => {
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    openRequestModal(instance: BookInstance): void {
        this.selectedInstance = instance;
        this.isModalOpen = true;
        this.requestSent = false;
        this.requestError = '';
    }

    closeModal(): void {
        this.isModalOpen = false;
        this.selectedInstance = null;
        this.requestSent = false;
        this.requestError = '';
    }

    confirmRequest(): void {
        if (!this.selectedInstance) return;
        this.requestService.sendRequest(this.selectedInstance.id).subscribe({
            next: () => {
                this.requestSent = true;
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                this.requestError = err.error?.detail || 'Failed to send request. Try again.';
                this.cdr.detectChanges();
            }
        });
    }

    goBack(): void {
        this.location.back();
    }
}