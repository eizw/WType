import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NgIterable } from '@angular/core';
import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-word',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [],
  template: `
    <p>
      {{ value }}
    </p>
  `,
  styleUrl: './word.component.css'
})
export class WordComponent {
  @Input() value: string = "";
}
