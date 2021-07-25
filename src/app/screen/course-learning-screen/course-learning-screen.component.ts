import {
  Component,
  HostListener,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/service/course.service';
import { Course } from 'src/app/models/course.model';
import { Observable, of, throwError } from 'rxjs';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/models/user.model';
import { catchError } from 'rxjs/operators';
import { authenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-course-learning-screen',
  templateUrl: './course-learning-screen.component.html',
  styleUrls: ['./course-learning-screen.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class CourseLearningScreenComponent implements OnInit {
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key == 'f') {
      console.log('*** lofkey f');
    }
  }
  current_course = new Course();
  courseId!: Observable<string>;
  sectionId!: Observable<string>;
  lectureId!: Observable<string>;
  lectureIdObser!: string;
  noteClicked: boolean= false;
  commentClicked: boolean= false;

  videoURL: any;
  learner = new User();
  hidden_comment = true;
  isLoadingVideo = false;
  isLeaving = false;
  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private _sanitizer: DomSanitizer,
    private userService: UserService,
    private router: Router,
    private authenService: authenticationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.courseId = of(params['courseId']);
      this.lectureId = of(params['lectureId']);
      this.sectionId = of(params['sectionId']);
      this.lectureId.subscribe((id) => {
        this.lectureIdObser = id;
        this.getVideo(id);
      });
    });

    let isLoggin = localStorage.getItem('isLoggedin');
    if (isLoggin == 'true') {
      let email = localStorage.getItem('uemail');
      if (email != null)
        this.userService.getAllUser().subscribe((responseData) => {
          let learner_ = responseData.users.find(
            (user) => user.email === email
          );
          if (learner_) this.learner = learner_;
          this.checkEnrolled();
        });

      this.courseId.subscribe((id) => {
        this.courseService.getCourseById(id).subscribe((course) => {
          this.current_course = course.courses[0];
        });
      });
    } else {
      this.router.navigate(['/detail', this.current_course.id]);
    }
  }

  getVideo(lectureId: string) {
    this.isLoadingVideo = true;
    this.courseService
      .getVideoByLectureId(lectureId)
      .pipe(
        catchError((error) => {
          this.isLoadingVideo = false;
          return throwError(error);
        })
      )
      .toPromise()
      .then((data) => {
        this.isLoadingVideo = false;
        this.videoURL = this._sanitizer.bypassSecurityTrustResourceUrl(
          data.signedUrl
        );
      });
  }

  checkEnrolled() {
    this.userService
      .checkEnrollment(this.current_course.id, this.learner.id)
      .subscribe((data) => {
        if (data.count == 0) {
          this.router.navigate(['/detail', this.current_course.id]);
        }
      });
  }

  openNotes(){
    this.noteClicked=!this.noteClicked;
  }

  openComments(){
    this.commentClicked=!this.commentClicked;
  }
}
