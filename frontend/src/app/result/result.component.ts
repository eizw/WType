import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent {
  @Input() runData: any;

  constructor() {}

  
}
