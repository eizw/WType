import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NgIterable, SimpleChanges, Output, ViewChild, ViewChildren, OnChanges, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Component, Input, QueryList } from '@angular/core';
@Component({
  selector: 'app-word',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
  template: `
    <span 
      #letter
      *ngFor="let letter of word?.split(''); index as i"
      [ngClass]="{'letter': true, 'letter-right': hl[i]==1, 'letter-wrong': hl[i]==2, 'cursor': i == cursor}"
    >{{letter}}</span><span
      #letter
      *ngFor="let letter of extra?.split(''); index as i"
      [ngClass]="{'letter': true, 'letter-extra': true, 'cursor': cursor == (i + word.length + 1)}"
    >{{letter}}</span>
  `,
  styleUrl: './word.component.css'
})
export class WordComponent implements OnChanges {
  @Input() word!: string; 
  extra!: string;

  @Output() letters!: string[];
  @ViewChildren('letter') letterSpan!: QueryList<any>

  cursor: number = -1; // -1 = cursor is not on this word
  hl: number[] = []; // 0 : none, 1 : correct, : 2 : incorrect

  constructor(private cd: ChangeDetectorRef, private elRef: ElementRef) {}

  ngOnChanges(changes: any) {
    this.hl = Array(changes.word.currentValue.length).fill(0);
    this.cd.detectChanges();
  }

  changeCursor(d: number) : void {
    this.cursor = d;
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

  backspace(d: number): void {
    for (let i = this.cursor - 1; i >= d; i--) {
      if (i < this.word.length) {
        this.hl[i] = 0
      } else {
        this.extra = this.extra.slice(0, i - this.word.length);
      }
    }
    this.changeCursor(d);
  }

  getYPos(ref: ElementRef) {
    console.log(this.elRef.nativeElement.offsetTop)
    return this.elRef.nativeElement.offsetTop
  }
}
