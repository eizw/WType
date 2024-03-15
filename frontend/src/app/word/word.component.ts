import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NgIterable, SimpleChanges } from '@angular/core';
import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-word',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
  template: `
    <span
      *ngFor="let letter of word?.split(''); index as i"
      [ngClass]="{'letter': true, 'letter-right': hl[i]==1, 'letter-wrong': hl[i]==2}"
    >{{letter}}</span><span
      *ngFor="let letter of extra?.split('')"
      class="letter letter-extra"
    >{{letter}}</span>
  `,
  styleUrl: './word.component.css'
})
export class WordComponent {
  @Input() word!: string;
  @Input() extra!: string;

  hl: number[] = []; // 0 : none, 1 : correct, : 2 : incorrect

  constructor() {}

  ngOnChanges(changes: any) {
    this.hl = Array(changes.word.currentValue.length).fill(0);
  }

  checkLetters(pword: string): void {
    let letters = document.querySelectorAll('.letter')
    if (pword.length > this.word.length) {
      this.extra = pword.substring(this.word.length, pword.length)
    }
    this.hl.forEach((letter, i) => {
      if (!pword[i]) {
        return;
      }
      if (this.word[i] == pword[i]) {
        this.hl[i] = 1;
      } else {
        this.hl[i] = 2
      }
    })
  }
}
