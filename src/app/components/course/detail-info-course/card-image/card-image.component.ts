import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Course } from 'src/app/models/course.model';
import { Lecture } from 'src/app/models/lecture.model';
import { Section } from 'src/app/models/section.model';
import { User } from 'src/app/models/user.model';
import { authenticationService } from 'src/app/service/authentication.service';
import { CourseService } from 'src/app/service/course.service';
import { UserService } from 'src/app/service/user.service';
import { PriceFormat } from 'src/app/util/priceformat';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-card-image',
  templateUrl: './card-image.component.html',
  styleUrls: ['./card-image.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class CardImageComponent implements OnInit, OnChanges {
  @Input() course!: Course;
  isBought!: boolean;
  isLoggedin!: Observable<boolean>;
  learner!: User;
  baseUrl: string = environment.baseUrl;
  isLoading = true;
  message: string = '';
  actionToAlert: string = '';
  showInform: boolean = false;
  action: string = '';
  title: string = '';
  successfullBought = false;

  sections: Section[] = [];
  lecture: Lecture[] = [];
  lectureId: string = '';
  sectionId: string = '';
  isBuying = false;
  failBought = false;
  isAdmin = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private courseService: CourseService,
    private authService: authenticationService,
    private activeRouter: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.course == null || this.course == undefined) {
      this.activeRouter.params.subscribe((params) => {
        const id = params['id'];
        this.courseService.getCourseById(id).subscribe((responseData) => {
          this.course = responseData.courses[0];
        });
      });
    }

    if (localStorage.getItem('isLoggedin') == 'true') {
      this.isLoggedin = of(true);
      this.authService.checkIsLoggedin().subscribe((isLoggedin) => {
        this.isLoggedin = of(isLoggedin);
      });
    } else {
      this.isLoggedin = of(false);
      this.isBought = false;
      this.isLoading = false;
    }

    this.isLoggedin.subscribe((islogin) => {
      if (islogin) {
        let email = localStorage.getItem('uemail')
          ? localStorage.getItem('uemail')
          : 'null';
        if (email != null) {
          this.userService
            .getAllUser()
            .pipe(
              catchError(() => {
                return throwError('');
              })
            )
            .subscribe((responseData) => {
              let learner = responseData.users.find(
                (user) => user.email === email
              );
              if (learner) this.learner = learner;
              else {
                this.authService.logOut();
                this.router.navigate(['/login']);
              }
              this.isBought_();
            });
        }
      } else {
        this.isBought = false;
      }
    });

    this.isAdmin = this.authService.isAdmin();
    if (this.course.id != '') this.getFirstSection(this.course.id);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isBought) this.isBought_();
  }

  isBought_() {
    if (!this.isLoggedin) {
      this.isBought = false;
    } else {
      if (this.course != undefined) {
        this.userService
          .checkEnrollment(this.course.id, this.learner.id)
          .pipe(
            catchError(() => {
              this.isBought = false;
              this.isLoading = false;
              return throwError('');
            })
          )
          .subscribe((responseData) => {
            this.isBought = true;
            this.isLoading = false;
          });
      }
    }
  }

  handlePriceFormat(price: number): any {
    return PriceFormat(price, 0, 3, '.', ',');
  }

  goToCourse(courseId: string, sectionId: string, lectureId: string) {
    this.router.navigate(['/learning', courseId, sectionId, lectureId], {
      fragment: 'learning',
    });
  }

  getFirstSection(courseId: string) {
    this.courseService.getSectionByCourseId(courseId).subscribe((data) => {
      this.sections = data.sections;
      if (this.sections.length > 0) {
        this.sectionId = this.sections.sort((a, b) => {
          return a.sectionOrder - b.sectionOrder;
        })[0].id;
        this.getFirstLecture(this.sectionId);
      }
    });
  }

  getFirstLecture(sectionId: string) {
    this.courseService
      .getLecturesBySectionId(sectionId)
      .subscribe((responseData) => {
        this.lecture = responseData.lectures;
        if (this.lecture.length > 0)
          this.lectureId = this.lecture.sort(
            (a, b) => a.lectureOrder - b.lectureOrder
          )[0].id;
        else this.lectureId = '';
      });
  }

  goToWallet() {
    if (localStorage.getItem('isLoggedin') == 'true') {
      let email = localStorage.getItem('uemail')
        ? localStorage.getItem('uemail')
        : 'null';
      if (email != null) {
        if (this.learner.balance < this.course.price) {
          this.actionToAlert = 'Confirm';
          this.title = 'Confirmation';
          this.message =
            'Your balance is not affordable to buy this course? Please top up more.';
          this.showInform = true;
          this.action = 'wallet';
        } else {
          this.showInform = true;
          this.title = 'Confirmation';
          this.actionToAlert = 'Confirm';
          this.message = 'Are you sure to buy this course?';
          this.action = 'buy';
        }
      }
    } else this.router.navigate(['/login']);
  }

  closeHandler() {
    this.showInform = false;
    this.successfullBought = false;
    this.failBought = false;
  }

  implementAction(action_return: string) {
    if (action_return == 'wallet') {
      this.router.navigate(['/wallet']);
    } else {
      let email = localStorage.getItem('uemail')
        ? localStorage.getItem('uemail')
        : 'null';
      if (email != null) {
        if (this.learner.id != undefined) {
          this.isBuying = true;
          this.userService
            .buyCourse(this.learner.id, this.course.id)
            .pipe(
              catchError(() => {
                this.failBought = true;
                this.isBuying = false;
                return throwError('');
              })
            )
            .subscribe((responseData) => {
              const user: User = this.learner;
              user.balance = user.balance - this.course.price;
              this.userService
                .updateUser(user)
                .pipe(
                  catchError(() => {
                    this.failBought = true;
                    this.isBuying = false;
                    return throwError('');
                  })
                )
                .subscribe((data) => {
                  this.learner = data.user;
                  this.isBuying = false;
                  this.isBought = true;
                  this.successfullBought = true;
                });
            });
        }
      }
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
