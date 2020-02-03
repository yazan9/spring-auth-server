import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserDetails } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(public auth:AuthenticationService, private router:Router) { }

  access_token:string;
  refresh_token:string;
  details: string;
  validity: string;

  ngOnInit() {
    this.loadPage();
  }

  loadPage(){
    this.access_token = this.auth.getAccessToken();
    this.refresh_token = this.auth.getrefreshToken();
    if(!this.access_token){
      this.router.navigate(['/login']);
      return;
    }
    this.details = JSON.stringify(this.auth.getUserDetails());
  }

  logout(){
    this.auth.logout();
  }

  validateToken(){
    this.auth.validateToken(this.access_token).subscribe(()=>{
      this.loadPage();
      this.validity = "Your access token is valid";
    }, (err)=>{
      this.validity = "Your access token is invalid";
      this.details = "";
    })
  }

  requestNewAccessToken(){
    this.auth.replaceAccessToken().subscribe((res)=> {
      this.loadPage();
    })
  }

}
