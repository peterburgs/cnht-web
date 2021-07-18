import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { authenticationService } from './service/authentication.service';
import { Timer } from './service/timer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Cùng nhau học toán';
  currentUrl=""
  isShowNavbar= true;
  isShowNavbarAdmin = false;
  expiredTime=10;
  
  constructor(private router: Router,
    private timer: Timer,
    public socialAuthService: SocialAuthService,
    private authService: authenticationService){}
    validSignIn:boolean= false;

  ngOnInit(): void {
    
    let expiredTime = localStorage.getItem('expires_in')
    if(expiredTime)
      this.expiredTime= Number(expiredTime)-60;
    
    this.router.events.subscribe(router=>{
      this.currentUrl= this.router.url; 
      if(this.currentUrl.includes("/login")){
        this.isShowNavbar= false;
      }
      else this.isShowNavbar= true;

      if(this.currentUrl.includes("#admin")){
        this.isShowNavbarAdmin= true;
        this.isShowNavbar = false;

      }
      else this.isShowNavbarAdmin= false;
    })

    this.socialAuthService.authState.subscribe((user) => {
      console.log('AuthState: ', this.socialAuthService.authState);
      let isAdmin= false;
      localStorage.setItem('expires_in', user.response.expires_in)
      localStorage.setItem('token_created_at', Date.now().toString())
      
      if(localStorage.getItem('role')=='admin')
        isAdmin=true;
      
      this.authService.signIn(user.idToken,isAdmin)
      .subscribe(responseData=>{
          
        console.log('new token:',responseData.token)
        this.authService.storeUser(responseData.user,responseData.token);
        this.expiredTime= user.response.expires_in-60;
        this.timer.startTimer(this.expiredTime);   
        this.validSignIn= true;

      })              
    });

    
    this.socialAuthService.initState.subscribe((state)=>{
      if(state)
        this.checkValidToken();
    })
      
  }

  checkValidToken(){
    //Check valid token 
    let loggedIn = localStorage.getItem('isLoggedin')
    if(loggedIn=='true'){

      let token_created_at =Number(localStorage.getItem('token_created_at'));
      let current_time = Date.now();

      //get valid remaining time of token and count
      if(token_created_at){

        console.log(new Date(token_created_at))
        console.log(current_time-token_created_at)
        let remaining_time= Math.floor((current_time- token_created_at)/1000);
        console.log('Remaining time:' ,this.expiredTime-remaining_time)
        if(remaining_time>=this.expiredTime)
        {
        
          this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID)
          .then(()=>{
            let token = localStorage.getItem('token')
            console.log('old token:',token)
            this.timer.startTimer(this.expiredTime);
          })
        
        }
        else{
          //sign in to server 
          let token = localStorage.getItem('token');
          let isAdmin= localStorage.getItem('role')=='admin';
          if(token)
            this.authService.signIn(token, isAdmin)
            .pipe(
              catchError((error)=>{
                  console.log("ERROR") 
                  if(error.status==500 ) 
                  {
                    this.validSignIn=true;
                    this.authService.logOut()
                    this.router.navigate(['/login'])
                  }                  
                  return throwError(error) 
              })
            )
            .subscribe((responseData)=>{
              this.validSignIn=true;
              this.authService.storeUser(responseData.user,responseData.token);
              this.authService.loggedIn=true;
              this.authService.logger.next(this.authService.loggedIn);
              this.timer.startTimer(this.expiredTime-remaining_time);

            })
        }
      }
    
    }
    else{
      this.validSignIn= true;
    }
  }

  ngOnDestroy(): void {
    this.timer.pauseTimer();
  }

 
}
