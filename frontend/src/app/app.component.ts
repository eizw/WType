import { Component, OnInit, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { WordComponent } from './word/word.component';
import { BoardComponent } from './board/board.component';
import { FooterComponent } from './footer/footer.component';
import { BoardoptionsComponent } from './boardoptions/boardoptions.component';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GameComponent } from './game/game.component';
import { JwtInterceptor } from './interceptor';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, 
    RouterOutlet, RouterLink, RouterLinkActive,
    GameComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    FooterComponent,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private word_url: string = 'http://localhost:8000/words'

  runData: any = null;

  constructor (private http: HttpClient) {}

  ngOnInit(): void {
  }

  setRunData(x: any) {
    this.runData = x;
  }
}
