import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export interface UserDetails {
  id: string;
  sub: string;
  exp: number;
}

interface TokenResponse {
  access_token: string;
  refresh_token:string;
}

export interface TokenPayload {
  email: string;
  password: string;
}

export interface NewAccessTokenRequestPayload{
  email: string;
  token: string;
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
  
  private saveAccessToken(token: string): void {
    localStorage.removeItem('access-token');
    localStorage.setItem('access-token', token);
  }

  public getAccessToken(): string {
    return localStorage.getItem('access-token');
  }

  private saveRefreshToken(token: string): void {
    localStorage.removeItem('refresh-token');
    localStorage.setItem('refresh-token', token);
  }

  public getrefreshToken(): string {
    return localStorage.getItem('refresh-token');
  }

  public logout(): void {
    window.localStorage.removeItem('auth-token');
    this.router.navigate(['/login'])
  }
  
  public getUserDetails(): UserDetails {
    const token = this.getAccessToken();
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
    return this.pipeRequest(base);
  }

  public replaceAccessToken(){
    let xxx = this.getUserDetails().sub;
    let credentials: NewAccessTokenRequestPayload = {
      email: this.getUserDetails().sub, 
      token: this.getrefreshToken()
    }
    let base = this.http.post(this.AuthenticationURL+'/replace_access_token', credentials);
    return this.pipeRequest(base);
  }

  public pipeRequest(base){
    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.access_token && data.refresh_token) {
          this.saveAccessToken(data.access_token);
          this.saveRefreshToken(data.refresh_token);
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
       'Authorization': `Bearer ${this.getAccessToken()}`
     })
   }
}