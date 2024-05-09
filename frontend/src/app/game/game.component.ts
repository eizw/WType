import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { WordComponent } from '../word/word.component';
import { BoardComponent } from '../board/board.component';
import { BoardoptionsComponent } from '../boardoptions/boardoptions.component';

import { ResultComponent } from '../result/result.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, HttpClientModule,
    WordComponent,
    BoardComponent,
    BoardoptionsComponent,
    ResultComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {

  title = 'frontend';
  gameTime: number = 15;
  public words!: string[];
  runData: any = null

  word_queue!: string[]

  @ViewChild('gameBoard') gameBoard: any;

  constructor() {}

  selectTime(x: any) {
    this.gameTime = x;

  }

  setRunData(x: any) {
    this.runData = x;
    console.log(this.runData)
  }
}
