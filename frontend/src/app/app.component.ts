import { Component, OnInit, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { WordComponent } from './word/word.component';
import { BoardComponent } from './board/board.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterOutlet,
    WordComponent,
    BoardComponent,
    HeaderComponent,
    FooterComponent,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private word_url: string = 'http://localhost:8000/words'

  title = 'frontend';
  gameTime: number = 15;
  public words!: string[];

  word_queue!: string[]

  @ViewChild('gameBoard') gameBoard: any;

  constructor (private http: HttpClient) {}

  ngOnInit(): void {
  }
}
