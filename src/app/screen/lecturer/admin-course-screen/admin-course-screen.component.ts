import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { CourseService } from 'src/app/service/course.service';
import { FullCourseService } from 'src/app/service/full-course.service';
import { Course } from 'src/app/models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { authenticationService } from 'src/app/service/authentication.service';
import { Subscription } from 'rxjs';
import { FilterComponent } from 'src/app/components/course/search/filter/filter.component';

interface Status {
  value: Number;
  viewValue: string;
}

@Component({
  selector: 'app-admin-course-screen',
  templateUrl: './admin-course-screen.component.html',
  styleUrls: ['./admin-course-screen.component.css'],
})
export class AdminCourseScreenComponent implements OnInit {
  courses: Course[] = [];
  isLoading = true;
  message: string = 'Find my course by title';
  titleSearch: string = '';
  listCourse: Course[] = [];
  grade = '';
  typeCourse = '';
  sbcCreate: Subscription = new Subscription();
  sbcCourses: Subscription = new Subscription();
  //Login check
  public userDetails? = Object;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fullCourseService: FullCourseService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    //Get all course
    this.fullCourseService.initCourses().subscribe(
      (response) => {
        this.fullCourseService.setCourses(response.courses);
        this.courses = response.courses;
        this.listCourse = this.courses;
        this.isLoading = false;
      },
      (error) => {
        this.courses = [];
        this.listCourse = [];
        this.isLoading = false;
      }
    );
  }

  signOut(): void {
    localStorage.removeItem('google_auth');
    this.router.navigateByUrl('/admin/login').then();
  }

  onCreateCourse() {
    this.isLoading = true;
    this.fullCourseService.createCourse();

    this.sbcCreate = this.fullCourseService.getSbjCreateCourse().subscribe(
      (course) => {
        this.isLoading = false;
        this.router.navigate(
          ['../', 'course', this.fullCourseService.getCourseInfo().id],
          { relativeTo: this.route }
        );
      },
      (error) => {
        this.isLoading = false;
        alert('Can not create new course now!!! Try again');
      }
    );
  }

  searchCourse($event: string) {
    this.titleSearch = $event;
    this.getAllByFilter();
  }

  getListCourseByTitle() {
    switch (this.selectedViewBy) {
      case 0:
        this.getAllListByTitle();
        break;
      case 1:
        this.getAllListByTitleAndStatus(true);
        break;
      case -1:
        this.getAllListByTitleAndStatus(false);
        break;
      default:
        break;
    }
  }

  getAllListByTitle() {
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

  //TODO: receive grade from filter
  receiveGrade($event: any) {
    this.grade = $event;
  }

  //TODO: receive type course from filter, and get list for filter
  receiveCategory($event: any) {
    this.typeCourse = $event;
    this.getAllByFilter();
  }

  @ViewChild(FilterComponent, { static: false }) childC?: FilterComponent;
  resetChildForm() {
    this.childC?.resetChildForm();
    window.scrollTo(0, 0);
  }

  onResetFitler() {
    this.resetChildForm();
    this.grade = ''; //TODO: reset value grade and type course
    this.typeCourse = '';
    // this.titleSearch = "";
    this.getAllByFilter();
  }

  selectedViewBy: Number = 0;

  listStatus: Status[] = [
    { value: 0, viewValue: 'All' },
    { value: 1, viewValue: 'Published' },
    { value: -1, viewValue: 'Not Published' },
  ];

  //TODO: get all list course
  getAllByFilter() {
    switch (this.selectedViewBy) {
      case 0:
        this.getListAllByFilterAndTitleSearch();
        break;
      case 1:
        this.getListByAllFilterCourse(true);
        break;
      case -1:
        this.getListByAllFilterCourse(false);
        break;
      default:
        break;
    }
  }

  getListByAllFilterCourse(status: boolean) {
    if (this.grade == '' || this.typeCourse == '')
      this.getAllListByTitleAndStatus(status);
    else
      this.listCourse = this.courses.filter(
        (course) =>
          course.title.toLowerCase().includes(this.titleSearch.toLowerCase()) &&
          course.courseType.toString() == this.typeCourse &&
          course.grade.toString() == this.grade &&
          course.isPublished == status
      );
  }

  getAllListByTitleAndStatus(status: boolean) {
    this.listCourse = this.courses.filter(
      (course) =>
        course.title.toLowerCase().includes(this.titleSearch.toLowerCase()) &&
        course.isPublished == status
    );
  }

  getListAllByFilterAndTitleSearch() {
    if (this.grade == '' || this.typeCourse == '') this.getAllListByTitle();
    else this.getListByFilterAndTitleSearch();
  }

  getListByFilterAndTitleSearch() {
    this.listCourse = this.courses.filter(
      (course) =>
        course.title.toLowerCase().includes(this.titleSearch.toLowerCase()) &&
        course.courseType.toString() == this.typeCourse &&
        course.grade.toString() == this.grade
    );
  }
}
