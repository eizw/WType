import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';

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

  axis: number[] = [];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    this.cd.detectChanges()
    this.calcAxis(changes);

  }

  calcAxis(changes: any) {
    let n = changes.runData.currentValue.comp.length;
    let q1 = Math.ceil(n / 4);
    let q3 = 3 * Math.ceil(n / 4);
    this.axis = [q1, Math.ceil(n / 2), q3, n]
  }
}
