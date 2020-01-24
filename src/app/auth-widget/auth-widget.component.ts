import { Component, OnInit } from '@angular/core';
import { TokenPayload, AuthenticationService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth-widget',
  templateUrl: './auth-widget.component.html',
  styleUrls: ['./auth-widget.component.css']
})
export class AuthWidgetComponent implements OnInit {

  loginErrorMessage = "";
  signupErrorMessage="";
  
  loadingResponse:boolean = false;

  credentials: TokenPayload = {
    email: '',
    password: ''
  };

  constructor(private auth: AuthenticationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  login(loginForm : any) {
    //make sure that inputs are valid
    if (loginForm.invalid) { 
      Object.keys( loginForm.controls).forEach(key => {
       loginForm.controls[key].markAsDirty();
      });
      return;
    }
    
    //if all is well, call the service function
    this.loadingResponse = true;
    this.auth.login(this.credentials).subscribe(() => {
      this.loadingResponse = false;
      this.router.navigate(['/main']);
      return;
    }, (err) => {
      this.loginErrorMessage = "Login Failed";
      this.loadingResponse = false;
    });
  }

  signup(signupForm : any) {
    //make sure that inputs are valid
    if (signupForm.invalid) { 
      Object.keys( signupForm.controls).forEach(key => {
        signupForm.controls[key].markAsDirty();
      });
      return;
    }
    
    //if all is well, call the service function
    this.loadingResponse = true;
    this.auth.register(this.credentials).subscribe(() => {
      this.loadingResponse = false;
      return;
      
    }, (err) => {
      this.signupErrorMessage = "Sign Up Failed";
      this.loadingResponse = false;
    });
  }
}

