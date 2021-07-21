import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { COURSE_TYPE } from 'src/app/models/course-type';
import { Course } from 'src/app/models/course.model';
import { GRADES } from 'src/app/models/grades';
import { CourseService } from 'src/app/service/course.service';
import { FullCourseService } from 'src/app/service/full-course.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  listCourse: Course[] = [];
  titleSearch: string = 'All course';
  grade: GRADES = GRADES.TWELFTH;
  category: COURSE_TYPE = COURSE_TYPE.THEORY;
  isUseFilter: boolean = false;
  textSearch: string = '';
  listFilter = [COURSE_TYPE.THEORY, COURSE_TYPE.EXAMINATION_SOLVING];
  listGrade = ['Grade 12', 'Grade 11', 'Grade 10'];
  listAllCourse: Course[] = [];
  isLoading: boolean = true;
  isAdmin = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private fullCourseService: FullCourseService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.isAdmin = this.checkAdmin();
    this.getTitleFormRouter();
    this.getAllCourse();
    this.getListSearch();
    this.getFormFilterRouter();
    window.scrollTo(0, 0);
  }

  checkAdmin() {
    if (this.router.url.includes('/admin')) return true;
    return false;
  }
  changeRouter() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
  }
  getAllCourse() {
    this.isLoading = true;
    this.courseService.getAllCourse().subscribe((list) => {
      this.listAllCourse = list.courses;
      this.isLoading = false;
      if (this.isAdmin) this.listCourse = this.listAllCourse;
      if (this.titleSearch && !this.isAdmin)
        this.listCourse = this.listAllCourse.filter((course) =>
          course.title.toLowerCase().includes(this.titleSearch.toLowerCase())
        );
    });
  }

  setTextSearch(title: string) {
    this.textSearch = title;
  }

  getNameTypeCourseByEnum(categoryIndex: number) {
    return this.listFilter[categoryIndex];
  }

  getNameGradeByEnum(gradeIndex: number) {
    return this.listGrade[gradeIndex];
  }
  getListSearch() {
    if (this.titleSearch) {
      this.listCourse = this.listAllCourse.filter((course) =>
        course.title.toLowerCase().includes(this.titleSearch.toLowerCase())
      );
      this.isUseFilter = false;
      this.setTextSearch(`\"${this.titleSearch}\"`);
    } else if (this.listCourse.length === 0) {
      this.isUseFilter = true;
    }
  }

  getTitleFormRouter() {
    this.route.queryParams.subscribe((queryParams: Params) => {
      if (this.isAdmin) this.titleSearch = 'All course';
      else this.titleSearch = queryParams['title'];
      this.getAllCourse();
      this.getListSearch();
    });
  }
  getFormFilterRouter() {
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.category = queryParams['type'];
      this.grade = queryParams['grade'];
      this.getListCourseFilter();
    });
  }

  receiveGrade($event: any) {
    this.grade = $event;
  }

  receiveCategory($event: any) {
    this.listCourse = [];
    this.category = $event;
    this.isUseFilter = true;
    this.getListCourseFilter();
  }

  getListCourseFilter() {
    if (this.grade && this.isUseFilter) {
      if (!this.category) {
        this.category = COURSE_TYPE.THEORY;
        this.grade = GRADES.TWELFTH;
      }
      this.isLoading = true;
      if (this.listAllCourse.length == 0) {
        this.courseService
          .getListCourseGrade(this.grade, this.category)
          .subscribe((data) => {
            if (data.count != 0) {
              this.listCourse = data.courses;
              this.isLoading = false;
            } else {
              this.listCourse = [];
              this.isLoading = false;
            }
          });
      } else {
        this.isLoading = false;
        this.listCourse = this.listAllCourse.filter(
          (course) =>
            course.grade == this.grade && course.courseType == this.category
        );
      }
      this.setTextSearch(`\"${this.category}\"`);
      if (this.listCourse.length == 0) this.isLoading = false;
    }
  }

  reloadRouter() {
    if (!this.isAdmin) {
      this.router.navigate([], {
        queryParams: { type: this.category, grade: this.grade },
      });
    }
  }

  isFindList() {
    if (this.isLoading == false) if (this.listCourse.length === 0) return false;
    return true;
  }
}
