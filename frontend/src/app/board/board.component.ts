import { Component, OnInit } from '@angular/core';
import { WordComponent } from '../word/word.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: `./board.component.html`,
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit {
  words!: WordComponent[]; // size; 10x3
  word_queue!: string[];
  word_list!: string[];

  constructor() {}

  ngOnInit(): void {
    this.genWords()
    // this.newRun()
  }

  newRun(): void {

  }

  genWords(): void {
    fetch('words.txt')
      .then((res) => res.text())
      .then((text) => {
        this.word_list = text.split('\n')
      })
  }
  
}
