import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  username!: any;
  
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.loginStatusChange().subscribe(isLoggedIn => {
      console.log('logged in')
      if (isLoggedIn) {
        this.username = localStorage.getItem('currentUser')
      } else {
        this.username = null;
      }
    })
  }
}
