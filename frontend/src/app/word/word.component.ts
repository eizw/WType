import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-word',
  standalone: true,
  imports: [],
  template: `
    <p>
      {{ value }}
    </p>
  `,
  styleUrl: './word.component.css'
})
export class WordComponent {
  @Input() value!: string;
}
