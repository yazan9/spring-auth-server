import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export interface UserDetails {
  id: string;
  email: string;
  exp: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private AuthenticationURL:string
  env = environment;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private router: Router) {
    this.AuthenticationURL = `${this.env.backendUri}`;
   }
  
   private saveToken(token: string): void {
    localStorage.removeItem('auth-token');
    localStorage.setItem('auth-token', token);
  }

  public getToken(): string {
    return localStorage.getItem('auth-token');
  }

  public logout(): void {
    window.localStorage.removeItem('auth-token');
    this.router.navigate(['/login'])
  }
  
  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
     payload = token.split('.')[1];
     payload = window.atob(payload);
     return JSON.parse(payload);
    }
    else {
     return null;
    }
  }
  
  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } 
    else {
      return false;
    }
  }
  
  public register(user: TokenPayload): Observable<any> {
    return this.http.post(this.AuthenticationURL+'/register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    let base = this.http.post(this.AuthenticationURL+'/authenticate', user);
    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
        })
      );    
      return request;
  }
  
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
    return throwError(
    `${error.error.message}`);
    };
  }

  validateToken(t:string){
    return this.http.post(this.AuthenticationURL+'/validate_token', t);
  }

  private getHeaders()
   {
     return new HttpHeaders({
       'Content-Type':  'application/json',
       'Authorization': `Bearer ${this.getToken()}`
     })
   }
}