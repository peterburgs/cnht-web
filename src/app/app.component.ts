import { Component, OnDestroy, OnInit } from '@angular/core';

import { Event, NavigationEnd, Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { authenticationService } from './service/authentication.service';
import { Timer } from './service/timer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Cùng nhau học toán';
  currentUrl = '';
  isShowNavbar = true;
  isShowNavbarAdmin = false;
  expiredTime = 10;
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private timer: Timer,
    public socialAuthService: SocialAuthService,
    private authService: authenticationService
  ) {}
  validSignIn: boolean = false;

  ngOnInit(): void {
    let expiredTime = localStorage.getItem('expires_in');
    if (expiredTime) this.expiredTime = Number(expiredTime) - 60;
    let role = localStorage.getItem('role');
    if (role && role == 'admin') this.isAdmin = true;
    else this.isAdmin = false;

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = this.router.url;
        console.log('*40 url: ' + this.currentUrl);
        if (this.currentUrl.includes('/login')) {
          {
            this.isShowNavbar = false;
            this.isShowNavbarAdmin = false;
            console.log('*42');
          }
        } else this.isShowNavbar = true;

        if (this.currentUrl.includes('/admin')) {
          console.log('*46');
          let role = localStorage.getItem('role');
          if (role && role == 'admin') this.isAdmin = true;
          else this.isAdmin = false;

          if (this.isAdmin) {
            this.isShowNavbarAdmin = true;
            this.isShowNavbar = false;
            console.log('*');
          } else {
            this.router.navigate(['/not-found']);
          }
        } else {
          if (this.currentUrl.includes('/view') && this.isAdmin) {
            this.isShowNavbarAdmin = true;
          } else this.isShowNavbarAdmin = false;
        }
      }
      if(this.currentUrl.includes('/view')) this.isNotShowFooter = true;
      else this.isNotShowFooter = false;
    });
    this.socialAuthService.initState.subscribe((state) => {
      if (state) this.checkValidToken();
    });
  }

  checkValidToken() {
    let loggedIn = localStorage.getItem('isLoggedin');
    if (loggedIn == 'true') {
      let token_created_at = Number(localStorage.getItem('token_created_at'));
      let current_time = Date.now();
      if (token_created_at) {
        let remaining_time = Math.floor(
          (current_time - token_created_at) / 1000
        );
        if (remaining_time >= this.expiredTime) {
          this.timer.refreshToken(this.expiredTime);
          this.validSignIn = true;
        } else {
          let token = localStorage.getItem('token');
          let isAdmin = false;
          if (localStorage.getItem('role') == 'admin') isAdmin = true;

          if (token)
            this.authService
              .signIn(token, isAdmin)
              .pipe(
                catchError((error) => {
                  if (error.status == 500 || error.status == 401) {
                    this.validSignIn = true;
                    this.authService.logOut();
                    this.router.navigate(['/login']);
                  }

                  return throwError('');
                })
              )
              .subscribe((responseData) => {
                this.validSignIn = true;
                this.authService.storeUser(
                  responseData.user,
                  responseData.token
                );
                this.authService.loggedIn = true;
                this.authService.logger.next(this.authService.loggedIn);
                this.timer.startTimer(this.expiredTime - remaining_time);
              });
        }
      } else {
        this.validSignIn = true;
      }
    } else {
      this.validSignIn = true;
    }
  }
  ngOnDestroy(): void {
    this.timer.pauseTimer();
  }

  isNotShowFooter = false;
}
