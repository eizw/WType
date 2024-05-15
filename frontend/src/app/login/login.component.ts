import { NgFor } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private login_url = 'http://localhost:8000/auth/jwt/create/'

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(f: NgForm) {
    let params = f.value
    this.http.post<any>(this.login_url, { username: params.username, password: params.password }).subscribe({
      next: data => {
        localStorage.setItem('token', JSON.stringify(data.access));
        this.router.navigate(['/'])
      },
      error: err => {
        console.log(err)
      }
    })
  } 
}
