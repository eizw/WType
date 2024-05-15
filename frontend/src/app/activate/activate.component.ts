import { Component, Input } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [],
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.css'
})
export class ActivateComponent {
  @Input() uid: string = '';
  @Input() token: string = '';

  constructor(private authService: AuthService) {}

  activateAccount() {
    this.authService.activate({uid: this.uid, token: this.token})
  }
}
