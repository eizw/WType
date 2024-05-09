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

  constructor(private http: HttpClient) {}

  async onSubmit(f: NgForm) {
    let params = f.value
    console.log(params)
    await this.http.post<any>(this.login_url, { email: params.email, password: params.password }).subscribe({
      next: data => {
        localStorage.setItem('access_token', JSON.stringify(data.access_token));
      },
      error: err => {
        console.log(err)
      }
    })
  } 
}
