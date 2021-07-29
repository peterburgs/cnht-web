import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCourseService } from 'src/app/service/full-course.service';
import { Course } from 'src/app/models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { COURSE_TYPE } from 'src/app/models/course-type';
import { GRADES } from 'src/app/models/grades';
import { CourseService } from 'src/app/service/course.service';

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
  message: string = 'Find a course';
  titleSearch: string = '';
  listCourse: Course[] = [];
  listSortedCourse: Course[] = [];
  grade = 'All Grade';
  typeCourse = '';
  sbcCreate: Subscription = new Subscription();
  sbcCourses: Subscription = new Subscription();
  public userDetails? = Object;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fullCourseService: FullCourseService,
    private courseService: CourseService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getGradeOnRouter();
  }

  getAllCourse() {
    this.grade = "All Grade"; 
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

  getAllCourseGrade() {
    this.courseService.getListCourseByGrade(this.grade).subscribe(
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

  getGradeOnRouter() {
    this.route.params.subscribe((params) => {
      this.isLoading = true;
      this.grade = params['grade'];
      if (!this.grade) {this.getAllCourse(); }
      else this.getAllCourseGrade();
    });
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
    this.courses = this.courses.filter((course) => course.isPublished == true);

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

  selectedExpBy: number = 0;

  listExpStatus: Status[] = [
    { value: 0, viewValue: 'Newest' },
    { value: 1, viewValue: 'Oldest' },
  ];

  getAllByFilter() {
    this.getAllListByTitle();
  }
}
