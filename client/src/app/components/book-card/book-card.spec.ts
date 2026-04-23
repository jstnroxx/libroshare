import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookCard } from './book-card';
import { RouterModule } from '@angular/router';
import { Book } from '../../models/book.model';

describe('BookCard', () => {
  let component: BookCard;
  let fixture: ComponentFixture<BookCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCard, RouterModule.forRoot([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookCard);
    component = fixture.componentInstance;

    const mockBook: Book = {
      id: 1,
      title: 'Test Title',
      author: 'Test Author',
      genre: 'Education',
      cover: 'test.jpg',
      description: 'Description',
      instances: [
        {
          ownerId: 101, 
          ownerName: 'Admin',
          isAvailable: true,
          condition: 'Good',
          ownerRating: 5
        }
      ]
    } as any; 

    component.book = mockBook;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});