import { NgFor } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private login_url = 'http://localhost:8000/auth/jwt/create'
  private register_url = 'http://localhost:8000/auth/users'

  constructor(private http: HttpClient) {}

  async onSubmit(f: NgForm) {
    await this.http.get<any>(this.login_url, { params: f.value }).subscribe({
      next: data => {
        localStorage.setItem('access_token', JSON.stringify(data.access_token));
      },
      error: err => {
        console.log(err)
      }
    })
  } 
}
