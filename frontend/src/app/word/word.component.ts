import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NgIterable } from '@angular/core';
import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-word',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
  template: `
    <span
      *ngFor="let letter of value.split('')"
      class="letter"
    >{{letter}}</span><span
      *ngFor="let letter of extra?.split('')"
      class="letter letter-extra"
    >{{letter}}</span>
  `,
  styleUrl: './word.component.css'
})
export class WordComponent {
  @Input() value: string = "";
  @Input() extra!: string;
}
