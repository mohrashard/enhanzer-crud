import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css'
})
export class BookFormComponent implements OnInit {
  bookForm!: FormGroup;
  isEditMode = false;
  bookId!: number;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Initialize form
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      isbn: ['', [Validators.required, Validators.maxLength(17)]],
      publicationDate: ['', Validators.required]
    });

    // Check if Edit Mode via Route Params
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.bookId = +params['id'];
        this.loadBook(this.bookId);
      }
    });
  }

  loadBook(id: number): void {
    this.bookService.getBook(id).subscribe({
      next: (book) => {
        // Format date string to match native HTML input type="date" (YYYY-MM-DD)
        const pubDate = new Date(book.publicationDate);
        const formattedDate = !isNaN(pubDate.getTime()) ? pubDate.toISOString().split('T')[0] : '';
        
        this.bookForm.patchValue({
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          publicationDate: formattedDate
        });
      },
      error: (err) => console.error('Error loading book', err)
    });
  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const bookData: Book = {
      ...this.bookForm.value,
      id: this.isEditMode ? this.bookId : 0 // Backend generates a new id if 0
    };

    if (this.isEditMode) {
      this.bookService.updateBook(this.bookId, bookData).subscribe({
        next: () => this.router.navigate(['/books']),
        error: (err) => console.error('Error updating book', err)
      });
    } else {
      this.bookService.addBook(bookData).subscribe({
        next: () => this.router.navigate(['/books']),
        error: (err) => console.error('Error adding book', err)
      });
    }
  }
}
