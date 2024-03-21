import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, ViewChildren  } from '@angular/core';
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
  @Output() selectedTime = new EventEmitter<number>();

  @ViewChildren('timeOption') timeOption: any;
  
  constructor() {}

  selectTime(x: any) {
    this.selectedTime.emit(x.target.innerHTML);
    this.selectedTime.forEach((time) => {
      time
    })
    x.target.id = 'selected-time'
  }
}
