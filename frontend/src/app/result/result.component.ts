import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts'

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [
    CommonModule,
    CanvasJSAngularChartsModule,
  ],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent {
  @Input() runData: any;

  constructor() {}

  
}
