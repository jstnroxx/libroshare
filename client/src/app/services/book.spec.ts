import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 
import { BookService } from './book'; 

describe('BookService', () => {
  let service: BookService; 

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [BookService]
    });
    service = TestBed.inject(BookService); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});