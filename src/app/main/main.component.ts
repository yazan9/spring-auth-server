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

  token:string;
  details: string;
  validity: string;

  ngOnInit() {
    this.loadPage();
  }

  loadPage(){
    this.token = this.auth.getToken();
    if(!this.token){
      this.router.navigate(['/login']);
      return;
    }
    this.details = JSON.stringify(this.auth.getUserDetails());
  }

  logout(){
    this.auth.logout();
  }

  validateToken(){
    this.auth.validateToken(this.token).subscribe(()=>{
      this.loadPage();
      this.validity = "Your token is valid";
    }, (err)=>{
      this.validity = "Your token is invalid";
      this.details = "";
    })
  }

}
