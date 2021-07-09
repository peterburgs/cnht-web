import { Injectable } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { Observable, of, Subject } from 'rxjs';
import { ROLES } from '../models/user-roles';
import { User } from '../models/user.model';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export  class authenticationService {

  private baseUrl:string= 'https://us-central1-supple-craft-318515.cloudfunctions.net/app/api';
  public logger = new Subject<boolean>();
  public loggedIn = false;

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

  storeUser(user : User,token:string){
    if(typeof(localStorage))
      {
        
        localStorage.setItem('isLoggedin','true');
        localStorage.setItem('uname', user.fullName);
        localStorage.setItem('uemail',user.email);
        localStorage.setItem('uphotoUrl',user.avatarUrl);
        localStorage.setItem('role',user.userRole);
        localStorage.setItem('token',token);

        //for admin        
      }
  }

  isAdmin(){ //checkadmin login
    if(typeof(localStorage)){
      if( localStorage.getItem('isLoggedin')=='true' && localStorage.getItem('role') == ROLES.ADMIN)
        return true;
    }
    return false;
  }

  getToken(){
    if(typeof(localStorage)){
       return "Bearer " + localStorage.getItem('token');}
      return "token";
  }

  getBalane(){

    var balance:string = "";
    if(typeof(localStorage)){
       balance ="0"+ localStorage.getItem('balance');}
    return Number(balance);
  }


  //TODO: authenticate 
  signIn(socialUser: SocialUser){

    let isDone:boolean=false;
    const data = {'authorization': socialUser.idToken};
    const config = { 
      headers: new HttpHeaders().set('Authorization','Bearer '+ socialUser.idToken) ,
      params:new HttpParams().set('userRole', ROLES.ADMIN)
    };
    console.log(config);
    return  this.http
     .post<{token:string, user: User}>( this.baseUrl+'/auth',data,config)
     

      //return of(isDone);
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

export class VerifyUser{
  verifiedUser!: {
    fullName: string,
    email: string
  };
  avatarUrl: string="";
  verifiedRole: number=0;
  verifiedToken: string="";
}