import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private login_url = 'http://localhost:8000/auth/jwt/create/'
  private register_url = 'http://localhost:8000/auth/users/'
  private activation_url = 'http://localhost:8000/auth/users/activation/'


  private isLoggedIn: Subject<boolean> = new ReplaySubject<boolean>();

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  login(params: any) {
    this.http.post<any>(this.login_url, { username: params.username, password: params.password }).subscribe({
      next: data => {
        localStorage.setItem('token', JSON.stringify(data.access));
        localStorage.setItem('currentUser', params.username)

        this.isLoggedIn.next(true)
        this.router.navigate(['/'])
      },
      error: err => {
        console.log(err.error)
      }
    })
  }

  register(params: any) {
    this.http.post<any>(this.register_url, { 
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

  activate(params: any) {
    this.http.post<any>(this.activation_url, {
      uid: params.uid,
      token: params.token
    }).subscribe({
      next: data => {
        this.router.navigate(['/login'])
      },
      error: err => {
        console.log(err.error)
      }
    })
  }

  loginStatusChange(): Observable<boolean> {
    return this.isLoggedIn.asObservable();
  }
}
