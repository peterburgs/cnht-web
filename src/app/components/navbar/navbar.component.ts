import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { authenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class NavbarComponent implements OnInit {

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
    window.location.reload();
  
    
  }

  refreshComponent(){
    this.router.navigate([this.router.url])
 }

  onLoadSearch(){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['search'], {queryParams: {title: this.titleSearch }, fragment: 'loading'});
   
  }
}
