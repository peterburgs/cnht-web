import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { authenticationService } from 'src/app/service/authentication.service';
import { Timer } from 'src/app/service/timer.service';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css'],
})
export class NavbarAdminComponent implements OnInit {
  titleSearch: string = '';
  isLoggedin: boolean = false;
  photo: any;
  activeButton: number = 1;
  constructor(
    public socialAuth: SocialAuthService,
    public authService: authenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private timer: Timer
  ) {}

  ngOnInit(): void {
    this.setActiveButtonByRouter();
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
  }

  // logOut() {
  //   this.authService.logOut();
  //   this.isLoggedin = false;
  //   this.router.navigate(['/login']);
  // }

  logOut() {
    this.authService.logOut().then((data) => {
      this.timer.pauseTimer();
      this.isLoggedin = false;
      this.router.navigate(['/login']);
    }).catch(error => {
      this.router.navigate(['/login']);
    });
  }

  setActiveButton(number: number) {
    this.activeButton = number;
  }

  goToHomeAdmin() {
    this.router.navigate(['/admin/home']);
    this.activeButton = 1;
  }

  setActiveButtonByRouter() {
    this.router.url.includes('/wallet')
      ? (this.activeButton = 4)
      : this.router.url.includes('/learner')
      ? (this.activeButton = 3)
      : this.router.url.includes('/topic')
      ? (this.activeButton = 2)
      : (this.activeButton = 1);
  }

  selectedBtnTest() {
    this.openSnackBar('This feature is being developed.', 'OK');
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
