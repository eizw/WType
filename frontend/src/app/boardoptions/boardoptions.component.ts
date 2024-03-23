import { CommonModule } from '@angular/common';
import { ElementSchemaRegistry } from '@angular/compiler';
import { Component, Output, EventEmitter, ViewChildren, OnInit  } from '@angular/core';
@Component({
  selector: 'app-boardoptions',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './boardoptions.component.html',
  styleUrl: './boardoptions.component.css'
})
export class BoardoptionsComponent implements OnInit {
  times = [15, 30, 60, 120]
  currTime = 15;
  @Output() selectedTime = new EventEmitter<number>();

  @ViewChildren('timeOption') timeOption: any;
  
  constructor() {}

  ngOnInit(): void {
    this.selectedTime.emit(15);
  }

  selectTime(x: any) {
    this.currTime = x.target.innerHTML;
    this.selectedTime.emit(this.currTime);
  }
}
