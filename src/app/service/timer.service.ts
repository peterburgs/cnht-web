import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GoogleLoginProvider, SocialAuthService } from "angularx-social-login";
import { authenticationService } from "./authentication.service";

@Injectable({
    providedIn: 'root'
  })
export class Timer implements OnInit{
    interval: any;
    timeLeft: number=3540;
    constructor(private authService: authenticationService,
      private socialAuthService: SocialAuthService ,
      private router: Router ){}


    ngOnInit(){
      
      this.socialAuthService.authState.subscribe((user) => {
        let isAdmin= false;
        localStorage.setItem('token_created_at', Date.now().toString())
        localStorage.setItem('expires_in', user.response.expires_in)
        
        if(localStorage.getItem('role')=='admin')
          isAdmin=true;
          
        this.authService.signIn(user.idToken,isAdmin)
        .subscribe(responseData=>{

          this.timeLeft=Number(user.response.expires_in)-60;
          this.authService.storeUser(responseData.user,responseData.token);
          this.startTimer(this.timeLeft);  
        })              
      });
    }

    startTimer(timeLeft:number) {
      this.timeLeft= timeLeft;
        this.interval = setInterval(() => {
          if(this.timeLeft > 0) {
            this.timeLeft--;
          } else
           if(this.timeLeft<=0){
            
            let isAdmin= false;
            if(localStorage.getItem('role')=='admin')
              isAdmin=true;
            this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID).then(()=>{
              let token = localStorage.getItem('token')
            })
            .catch(()=>{
              this.router.navigate(['/login']);
            })

            
          }
        },1000)
    }

    pauseTimer() {
      if(this.interval)
        {
        clearInterval(this.interval);
        } 
    }

    ngOnDestroy(): void {
     localStorage.setItem('time_out',Date.now().toString())
     this.pauseTimer();
      
    }

    refreshToken(expiredTime: number){

      this.socialAuthService.authState.subscribe((user) => {
        let isAdmin= false;
        localStorage.setItem('token_created_at', Date.now().toString())
        localStorage.setItem('expires_in', user.response.expires_in)
        
        if(localStorage.getItem('role')=='admin')
          isAdmin=true;
          
        this.authService.signIn(user.idToken,isAdmin)
        .subscribe(responseData=>{

          this.timeLeft=Number(user.response.expires_in)-60;
          this.authService.storeUser(responseData.user,responseData.token);
          this.startTimer(this.timeLeft);  
        })              
      });
      this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID)
          .then(()=>{
            let token = localStorage.getItem('token')
            this.startTimer(expiredTime);
          })
    }
}

