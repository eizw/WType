import { Component, OnInit } from '@angular/core';
import { WordComponent } from '../word/word.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  template: `
    <p>
      board works!
    </p>
  `,
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit {
  words!: WordComponent[]; // size; 10x3

  constructor() {}

  ngOnInit(): void {
    let word_queue: string[] = this.genWords()
    this.newRun()
  }

  newRun(): void {
    let word_queue: string[] = this.genWords()

  }

  genWords(): string[] {
    return []
  }
  
}
