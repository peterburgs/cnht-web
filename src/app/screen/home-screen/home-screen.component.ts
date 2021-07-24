import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCourseService } from 'src/app/service/full-course.service';
import { Course } from 'src/app/models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FilterComponent } from 'src/app/components/course/search/filter/filter.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface Status {
  value: Number;
  viewValue: string;
}

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.css'],
})

export class HomeScreenComponent implements OnInit {
  courses: Course[] = [];
  isLoading = true;
  message: string = 'Find course by title';
  titleSearch: string = '';
  listCourse: Course[] = [];
  listSortedCourse: Course[] = [];
  grade = '';
  typeCourse = '';
  sbcCreate: Subscription = new Subscription();
  sbcCourses: Subscription = new Subscription();
  public userDetails? = Object;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fullCourseService: FullCourseService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.fullCourseService.initCourses().subscribe(
      (response) => {
        this.fullCourseService.setCourses(response.courses);
        this.courses = response.courses;

        this.listSortedCourse = this.courses;
        this.sortByDate(this.selectedExpBy);
        this.listCourse = this.listSortedCourse;

        this.isLoading = false;
      },
      (error) => {
        this.courses = [];
        this.listCourse = [];
        this.listSortedCourse = this.courses;
        this.isLoading = false;
      }
    );
  }

  signOut(): void {
    localStorage.removeItem('google_auth');
    this.router.navigateByUrl('/admin/login').then();
  }

  getAllByDate() {
    this.sortByDate(this.selectedExpBy);
    this.getAllByFilter();
  }

  searchCourse($event: string) {
    this.titleSearch = $event;
    this.getAllByFilter();
  }

  sortByDate(order: number) {
    this.courses = this.courses.filter(course => course.isPublished == true);
    
    if (order == 0) {
      this.listSortedCourse = this.courses.sort((a, b) => {
        return <any>new Date(b.updatedAt) - <any>new Date(a.updatedAt);
      });
    } else {
      this.listSortedCourse = this.courses.sort((a, b) => {
        return <any>new Date(a.updatedAt) - <any>new Date(b.updatedAt);
      });
    }
  }


  getAllListByTitle() {
    this.listCourse = this.listSortedCourse.filter((course) =>
      course.title.toLowerCase().includes(this.titleSearch.toLowerCase())
    );
  }

  ngOnDestroy(): void {
    this.sbcCreate.unsubscribe();
    this.sbcCourses.unsubscribe();
  }

  receiveGrade($event: any) {
    this.grade = $event;
  }

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
    this.grade = '';
    this.typeCourse = '';
    this.getAllByFilter();
  }

  selectedExpBy: number = 0;


  listExpStatus: Status[] = [
    { value: 0, viewValue: 'Newest' },
    { value: 1, viewValue: 'Oldest' },
  ];

  getAllByFilter() {
    this.getListByAllFilterCourse(true);

  }

  getListByAllFilterCourse(status: boolean) {
    if (this.grade == '' || this.typeCourse == '')
      this.getAllListByTitleAndStatus(status);
    else
      this.listCourse = this.listSortedCourse.filter(
        (course) =>
          course.title.toLowerCase().includes(this.titleSearch.toLowerCase()) &&
          course.courseType.toString() == this.typeCourse &&
          course.grade.toString() == this.grade &&
          course.isPublished == status
      );
  }

  getAllListByTitleAndStatus(status: boolean) {
    this.listCourse = this.listSortedCourse.filter(
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
    this.listCourse = this.listSortedCourse.filter(
      (course) =>
        course.title.toLowerCase().includes(this.titleSearch.toLowerCase()) &&
        course.courseType.toString() == this.typeCourse &&
        course.grade.toString() == this.grade
    );
  }
}
