import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {SocialAuthService, SocialUser, GoogleLoginProvider} from 'angularx-social-login'
import {  authenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css'],
  encapsulation :ViewEncapsulation.Emulated
})
export class LoginScreenComponent implements OnInit {

  socialUser = new SocialUser();
  isLoggedin: boolean= false;  

  constructor( 
    public socialAuthService: SocialAuthService,
    public route: Router,
    public authService: authenticationService) { }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = (user != null);
      console.log(this.socialAuthService.authState);
      if(this.isLoggedin){
        console.log(this.socialUser);
        if(this.authService.isExistedAccount(this.socialUser.email))
        {
          if(this.authService.signIn(this.socialUser)){
            this.route.navigate(['/home']);
          };
        }
        else{
           if(this.authService.signUp(this.socialUser)){
             this.route.navigate(["/home"]);
           }
        } 
      }
     
      
    });
  }

  loginWithGoogle(): void {
     this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    
  }



}
