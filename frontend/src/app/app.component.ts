import { Component, OnInit, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { WordComponent } from './word/word.component';
import { BoardComponent } from './board/board.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterOutlet,
    WordComponent,
    BoardComponent,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  private word_url: string = 'http://localhost:8000/words'
  public words!: string[];
  public isLoading:boolean = true;

  ngOnInit(): void {
    fetch(this.word_url)
      .then((res) => res.json())
      .then((word_data) => {
        this.words = word_data
        this.isLoading = false;
      })
  }
}
