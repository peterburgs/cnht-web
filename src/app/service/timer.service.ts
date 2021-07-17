import { Injectable, OnInit } from "@angular/core";
import { GoogleLoginProvider, SocialAuthService } from "angularx-social-login";
import { authenticationService } from "./authentication.service";

@Injectable({
    providedIn: 'root'
  })
export class Timer implements OnInit{
    interval: any;
    timeLeft: number=3540;
    constructor(private authService: authenticationService,
      private socialAuthService: SocialAuthService  ){}


    ngOnInit(){
      this.socialAuthService.authState.subscribe((user) => {
        console.log('AuthState: ', this.socialAuthService.authState);
        let isAdmin= false;
          if(localStorage.getItem('role')=='admin')
            isAdmin=true;
          this.authService.signIn(user,isAdmin)
          .subscribe(responseData=>{
              this.authService.storeUser(responseData.user,responseData.token);
              this.startTimer(3540);  
          })              
      });
    }

    startTimer(timeLeft:number) {
      this.timeLeft= timeLeft;
        this.interval = setInterval(() => {
          if(this.timeLeft > 0) {
            this.timeLeft--;
            console.log(this.timeLeft)
          } else
           if(this.timeLeft<=0){
            
            let isAdmin= false;
            if(localStorage.getItem('role')=='admin')
              isAdmin=true;
            this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID).then(()=>{
              let token = localStorage.getItem('token')
             console.log('new token:',token)
             this.timeLeft=3540;
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
}

