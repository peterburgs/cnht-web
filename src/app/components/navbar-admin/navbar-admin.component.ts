import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { authenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent implements OnInit {

  titleSearch: string = "";
  isLoggedin:boolean= false;
  photo: any;

  constructor(public socialAuth: SocialAuthService,
     public authService: authenticationService,
     private router: Router,
     private route: ActivatedRoute) { }


  ngOnInit(): void {
    if(typeof(localStorage))
    {
      if(localStorage.getItem('isLoggedin')=='true')
      {
        this.photo= localStorage.getItem('uphotoUrl');
        this.isLoggedin=true;
      } 
      
      this.authService.checkIsLoggedin().subscribe((loggedIn)=>
      {
        console.log(localStorage.getItem('isLoggedin'));
        this.isLoggedin= loggedIn;

        if(loggedIn)
          this.photo= localStorage.getItem('uphotoUrl');
      }
      );
    }
  }

  logOut(){
    //this.socialAuth.signOut();
    //this.authService.clearLocalStorage();
    this.authService.logOut();
    this.isLoggedin= false;
    this.router.navigate(['/login'])
  
    
  }

}
