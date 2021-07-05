import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService,GoogleLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css'],
  encapsulation :ViewEncapsulation.Emulated
})
export class LoginScreenComponent implements OnInit {
  
  constructor(private router:Router,
   ) { }

  ngOnInit(): void {
  }
  signInHandler(): void {

  }
}
