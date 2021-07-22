import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { authenticationService } from 'src/app/service/authentication.service';
import { Timer } from 'src/app/service/timer.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class NavbarComponent implements OnInit {
  titleSearch: string = '';
  isLoggedin: boolean = false;
  isAdmin: boolean = false;
  photo: any;

  constructor(
    public socialAuth: SocialAuthService,
    public authService: authenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private timer: Timer
  ) {}

  ngOnInit(): void {
    if (typeof localStorage) {
      if (localStorage.getItem('isLoggedin') == 'true') {
        this.photo = localStorage.getItem('uphotoUrl');
        this.isLoggedin = true;
      }

      this.authService.checkIsLoggedin().subscribe((loggedIn) => {
        this.isLoggedin = loggedIn;

        if (loggedIn) this.photo = localStorage.getItem('uphotoUrl');
      });
    }

    if (this.authService.isAdmin()) this.isAdmin = true;
  }

  logOut() {
    this.authService.logOut();
    this.timer.pauseTimer();
    this.isLoggedin = false;
    this.router.navigate(['/login']);
  }

  goToHomeAdmin() {
    this.router.navigate(['/admin/home']);
  }

  refreshComponent() {
    this.router.navigate([this.router.url]);
  }

  changeRouter() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  onLoadSearch() {
    if (this.titleSearch != '') {
      this.router.navigate(['search'], {
        queryParams: { title: this.titleSearch },
      });
      this.titleSearch = '';
    }
  }
}
