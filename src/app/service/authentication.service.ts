import { Injectable } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { Observable, of, Subject } from 'rxjs';
import { ROLES } from '../models/user-roles';
import { User } from '../models/user.model';
import {HttpClient} from '@angular/common/http'
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export  class authenticationService {

  private logger = new Subject<boolean>();
  private loggedIn = false;

  constructor( 
    public socialAuthService: SocialAuthService,
    private http: HttpClient
    ) {
    if(localStorage.getItem('isLoggedin'))
    {
      let isLoggedin= localStorage.getItem('isLoggedin');
      if(isLoggedin?.toString()=='true')
          this.loggedIn= true;
      else
         this.loggedIn= false;
    }
  }

  storeUser(socialUser : SocialUser){
    if(typeof(localStorage))
      {
        localStorage.setItem('isLoggedin','true');
        localStorage.setItem('uname', socialUser.name);
        localStorage.setItem('uemail',socialUser.email);
        localStorage.setItem('uphotoUrl',socialUser.photoUrl);
      }
  }

  signUp(socialUser: SocialUser): boolean{
    //handle create new user
     const user:User = {
       id:"",
       email:socialUser.email,
       userRole: ROLES.LEARNER,
       balance: 0,
       avatarUrl:socialUser.photoUrl,
       fullName: socialUser.name
     }
     this.storeUser(socialUser);
     //TODO: save user by post method
     this.http
     .post<User>('URL', user)
     .subscribe(responseData=>{
       console.log(responseData);
     })

     this.loggedIn=true;
     this.logger.next(this.loggedIn);
     return true;

  }

  
  signIn(socialUser: SocialUser) : boolean{

      this.storeUser(socialUser);
      this.loggedIn=true;
     this.logger.next(this.loggedIn);
      return true;
  }

  isExistedAccount(email:string):boolean{
    return false;
  }

  checkIsLoggedin(): Observable<boolean>{
     return this.logger.asObservable();
  }

  logOut(){
    this.clearLocalStorage();
    this.socialAuthService.signOut();
    this.loggedIn= false;
  }

  clearLocalStorage(){
    localStorage.clear();
    localStorage.setItem('isLoggedin','false');
  }


}
