import { Component, OnInit } from '@angular/core';
import { WordComponent } from '../word/word.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, 
    WordComponent
  ],
  templateUrl: `./board.component.html`,
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit {
  words!: any[]; // size; 10x3
  word_queue: string[] = [];
  word_list: string[] = [] || this.fetchWords();

  constructor() {}

  ngOnInit() {
    this.word_queue = this.genWords()
    console.log('why' + this.word_queue)
    // this.newRun()
  }

  newRun(): void {

  }

  fetchWords(): string[] {
    let temp: string[] = [];
    fetch('words.txt')
      .then((res) => res.text())
      .then((text) => {
        temp = text.split('\n')
      })
    return temp
  }

  genWords(): string[] {
    let temp = this.word_list
    let currentIndex = temp.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [temp[currentIndex], temp[randomIndex]] = [
        temp[randomIndex], temp[currentIndex]];
    }

    this.word_queue = temp
    return temp
  }
}
