import { Component, OnInit, EventEmitter } from '@angular/core';
import { CourseService } from 'src/app/service/course.service';
import { FullCourseService } from 'src/app/service/full-course.service';
import { Course } from 'src/app/models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { authenticationService } from 'src/app/service/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-course-screen',
  templateUrl: './admin-course-screen.component.html',
  styleUrls: ['./admin-course-screen.component.css'],
})
export class AdminCourseScreenComponent implements OnInit {
  courses: Course[] = [];
  isLoading = true;
  message: string = 'Find my course by title ....';
  titleSearch: string = '';
  listCourse: Course[] = [];
  sbcCreate: Subscription = new Subscription();
  sbcCourses: Subscription = new Subscription();
  //Login check
  public userDetails? = Object;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
   
    private fullCourseService: FullCourseService,
    private authSevice: authenticationService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.fullCourseService.initCourses().subscribe((response) => {
      this.fullCourseService.setCourses(response.courses);
      this.courses = response.courses;
      this.listCourse = this.courses;
      this.isLoading = false;
    });

    const storage = localStorage.getItem('google_auth');

    console.log(storage);
    // if (storage) {
    //   this.userDetails = JSON.parse(storage);
    // } else {
    //   this.signOut();
    // }

    // if (storage) {
    //   this.userDetails = JSON.parse(storage);
    // } else {
    //  // this.signOut();
    // }
    // if(this.authSevice.isAdmin())
    // this.fullCourseService.initCourses().subscribe((response)=>{
    //   this.courses=response.courses;
    // })
    // else this.router.navigateByUrl('/home').then();
    // this.fullCourseService.initCourses().subscribe((response)=>{
    //      this.courses=response.courses;
    //    })
    if (this.authSevice.isAdmin())
      this.fullCourseService.initCourses().subscribe((response) => {
        this.courses = response.courses;
        this.listCourse = this.courses;
      });
    else this.router.navigateByUrl('/home').then();
  }

  signOut(): void {
    localStorage.removeItem('google_auth');
    this.router.navigateByUrl('/admin/login').then();
  }
  onCreateCourse() {
    this.isLoading = true;
    this.fullCourseService.createCourse();

    this.sbcCourses = this.sbcCreate = this.fullCourseService
      .getSbjCreateCourse()
      .subscribe((course) => {
        this.isLoading = false;
        this.router.navigate(
          ['../', 'course', this.fullCourseService.getCourseInfo().id],
          { relativeTo: this.route }
        );
      });
  }

  searchCourse($event: string) {
    this.titleSearch = $event;
    this.getListCourseByTitle();
  }

  getListCourseByTitle() {
    this.listCourse = this.courses.filter((course) =>
      course.title.toLowerCase().includes(this.titleSearch.toLowerCase())
    );
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sbcCreate.unsubscribe();
    this.sbcCourses.unsubscribe();
  }
}
