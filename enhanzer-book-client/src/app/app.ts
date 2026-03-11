import { Component, signal } from '@angular/core';
import { BookListComponent } from './components/book-list/book-list.component';

@Component({
  selector: 'app-root',
  imports: [BookListComponent],
  template: `<app-book-list></app-book-list>`,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('enhanzer-book-client');
}
