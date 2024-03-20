import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-boardoptions',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './boardoptions.component.html',
  styleUrl: './boardoptions.component.css'
})
export class BoardoptionsComponent {
  times = [15, 30, 60, 120]
  
  constructor() {}
}
