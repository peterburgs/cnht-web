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
  isLoading: boolean= false;
  constructor( 
    public socialAuthService: SocialAuthService,
    public route: Router,
    public authService: authenticationService) { }

  ngOnInit(): void {
    //Get user information form google account and authenticate it on server
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      //if user !=null, it is log in, else log out
      this.isLoggedin = (user != null);
      console.log(this.socialAuthService.authState);
      if(this.isLoggedin){
        console.log(this.socialUser);
        this.isLoading=true;
        //authenticate on server
        this.authService.signIn(this.socialUser)
        .subscribe(responseData=>{
          
            console.log(responseData);
            this.authService.storeUser(responseData.user,responseData.token);
            this.authService.loggedIn=true;
            this.authService.logger.next(this.authService.loggedIn);
            //navigate to home screen and stop loading
           // this.route.navigate(['/home']);
           if(this.authService.isAdmin() ){
                    console.log("isadmin");
                    this.isAdminSignIn();}
          else
          this.route.navigate(['/home']);
            this.isLoading=false;
        })      
    
      }  
      //   if(this.authService.isExistedAccount(this.socialUser.email))
      //   {
      //     if(this.authService.signIn(this.socialUser)){
      //       if(this.authService.isAdmin() ){
      //         console.log("isadmin");
      //         this.isAdminSignIn();}
      //         else
      //         this.route.navigate(['/home']);
      //     };
      //   }
      //   else{
      //      if(this.authService.signUp(this.socialUser)){
      //       if(this.authService.isAdmin() ){
      //         console.log("isadmin");
      //         this.isAdminSignIn();}
      //         else
      //         this.route.navigate(['/home']);
      //      }
      //   } 
      // }
     
      
    });
  }

  loginWithGoogle(): void {
     this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    
  }

  isAdminSignIn(){
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate(['/admin/home']);
   
  }


}
