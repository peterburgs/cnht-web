import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SocialAuthService,
  SocialUser,
  GoogleLoginProvider,
} from 'angularx-social-login';
import { authenticationService } from 'src/app/service/authentication.service';
import { Timer } from 'src/app/service/timer.service';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class LoginScreenComponent implements OnInit {
  socialUser = new SocialUser();
  isLoggedin: boolean = false;
  isLoading: boolean = false;
  isAdmin = false;
  timeLeft: number = 10;
  interval: any;

  constructor(
    public socialAuthService: SocialAuthService,
    public route: Router,
    private activeRouter: ActivatedRoute,
    public authService: authenticationService,
    private timer: Timer
  ) {}

  ngOnInit(): void {
    this.activeRouter.fragment.subscribe((frag) => {
      if (frag == 'admin') {
        this.isAdmin = true;
      } else this.isAdmin = false;
    });

    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        this.socialUser = user;
        localStorage.setItem('expires_in', user.response.expires_in);
        localStorage.setItem('token_created_at', Date.now().toString());

        this.isLoggedin = user != null;
        if (this.isLoggedin) {
          this.isLoading = true;
          this.authService
            .signIn(this.socialUser.idToken, this.isAdmin)
            .subscribe((responseData) => {
              this.timer.startTimer(Number(user.response.expires_in) - 60);
              this.authService.storeUser(responseData.user, responseData.token);
              this.authService.loggedIn = true;
              this.authService.logger.next(this.authService.loggedIn);
              if (this.authService.isAdmin()) {
                this.isAdminSignIn();
              } else this.route.navigate(['/home']);
              this.isLoading = false;
            });
        }
      } else {
        this.route.navigate(['/login']);
      }
    });
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  isAdminSignIn() {
    this.route.navigate(['/home']);
  }
}
