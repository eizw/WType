import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  private register_url = 'http://localhost:8000/auth/users/'

  constructor(private http: HttpClient, private router: Router) {}

  async onSubmit(f: NgForm) {
    let params = f.value
    console.log(params)
    await this.http.post<any>(this.register_url, { 
      username: params.username,
      email: params.email, 
      password: params.password,
      re_password: params.re_password }).subscribe({
      next: data => {
        this.router.navigate(['/login'])
      },
      error: err => {
        console.log(err.error)
      }
    })
  } 
}
