import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { authenticationService } from './service/authentication.service';
import { Timer } from './service/timer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Cùng nhau học toán';
  currentUrl=""
  isShowNavbar= true;
  isShowNavbarAdmin = false;
  expiredTime= 3540;
  
  constructor(private router: Router,
    private timer: Timer,
    public socialAuthService: SocialAuthService,
    private authService: authenticationService){}
    

  ngOnInit(): void {
    
    console.log("App init")
    this.router.events.subscribe(router=>{
      this.currentUrl= this.router.url; 
      if(this.currentUrl.includes("/login")){
        this.isShowNavbar= false;
      }
      else this.isShowNavbar= true;

      if(this.currentUrl.includes("/admin")){
        this.isShowNavbarAdmin= true;
        this.isShowNavbar = false;
      }
      else this.isShowNavbarAdmin= false;
    })

    this.socialAuthService.authState.subscribe((user) => {
      console.log('AuthState: ', this.socialAuthService.authState);
      let isAdmin= false;
        if(localStorage.getItem('role')=='admin')
          isAdmin=true;
        this.authService.signIn(user,isAdmin)
        .subscribe(responseData=>{
            this.authService.storeUser(responseData.user,responseData.token);
            this.timer.startTimer(3540);  
        })              
    });
    this.checkValidToken();
    
        
  }


checkValidToken(){
  //Check valid token 
  let loggedIn = localStorage.getItem('isLoggedin')
  if(loggedIn=='true'){
    let token_created_at =Number(localStorage.getItem('token_created_at'));
  let current_time = Date.now();
  if(token_created_at){
    console.log(new Date(token_created_at))
    console.log(new Date(current_time))
    console.log(current_time-token_created_at)
    let remaining_time= Math.floor((current_time- token_created_at)/1000);
    console.log('Remaining time:' ,3540-remaining_time)
    if(remaining_time>=this.expiredTime)
    {
      console.log("refresh token")
      
        this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID).then(()=>{
          
        });
     
    }
    else{
      console.log("Continue count")
      this.timer.startTimer(3540-remaining_time);

    }
  }
  
  }
}

  ngOnDestroy(): void {
    this.timer.pauseTimer();
    
  }

 
}
