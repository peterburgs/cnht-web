import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { GRADES } from 'src/app/models/grades';
import { TOPICS } from 'src/app/models/TOPIC';
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
  grade: GRADES = GRADES.NHSGE;
  topic: TOPICS = TOPICS.ALGEBRA;

  constructor(
    public socialAuth: SocialAuthService,
    public authService: authenticationService,
    private router: Router,
    private timer: Timer,
    private _snackBar: MatSnackBar
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
    this.authService
      .logOut()
      .then((data) => {
        this.timer.pauseTimer();
        this.isLoggedin = false;
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        this.router.navigate(['/login']);
      });
  }

  goToHomeAdmin() {
    this.router.navigate(['/admin/home']);
  }

  refreshComponent() {
    this.router.navigate([this.router.url]);
  }

  onLoadSearch() {
    if (this.titleSearch != '') {
      this.router.navigate(['search'], {
        queryParams: { title: this.titleSearch },
      });
      this.titleSearch = '';
    }
  }

  setGradeChangeRouter(number: number) {
    let isGoHome = false;
    switch (number) {
      case 1: {
        this.grade = GRADES.NHSGE;
        break;
      }
      case 2: {
        this.grade = GRADES.TWELFTH;
        break;
      }
      case 3: {
        this.grade = GRADES.ELEVENTH;
        break;
      }
      case 4: {
        this.grade = GRADES.TENTH;
        break;
      }
      case 5: {
        this.grade = GRADES.NINTH;
        break;
      }
      case 6: {
        isGoHome = true;
        break;
      }
      default:
        break;
    }
    this.setRouter(isGoHome);
  }

  getGradeChangeRouter() {
    return this.grade;
  }

  setRouter(isGoHome: boolean) {
    !isGoHome
      ? this.router.navigate(['/home', this.grade])
      : this.router.navigate(['/home']);
  }

  selectedBtnTest() {
    this.openSnackBar('This feature is being developed.', 'OK');
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  navigateToTopics(topicName: string) {
    this.router.navigate(['/topics', topicName]);
  }

  public get topics(): typeof TOPICS {
    return TOPICS;
  }

  getKeys(): Array<string> {
    return Object.values(this.topics);
  }
}
