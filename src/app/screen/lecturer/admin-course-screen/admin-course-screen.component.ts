import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCourseService } from 'src/app/service/full-course.service';
import { Course } from 'src/app/models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FilterComponent } from 'src/app/components/course/search/filter/filter.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoDialogComponent } from 'src/app/components/alert/info-dialog/info-dialog.component';
import { GRADES } from 'src/app/models/grades';

interface Status {
  value: Number;
  viewValue: string;
}

interface Grades {
  value: string;
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
  listSortedCourse: Course[] = [];
  grade = 'all';
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

  onCreateCourse() {
    // this.isLoading = true;
    // this.fullCourseService.createCourse();

    // this.sbcCreate = this.fullCourseService.getSbjCreateCourse().subscribe(
    //   (course) => {
    //     this.isLoading = false;
    //     this.router.navigate(
    //       ['../', 'course', this.fullCourseService.getCourseInfo().id],
    //       { relativeTo: this.route }
    //     );
    //   },
    //   (error) => {
    //     this.isLoading = false;
    //     alert('Can not create new course now!!! Try again');
    //   }
    // );
    this.openModalCreateCourse();
  }
  openModalCreateCourse() {
    const modalRef = this.modalService.open(InfoDialogComponent, {
      centered: true, size:'lg',backdrop: 'static',
    });
      

    modalRef.result.then((result: boolean) => {
      if (result) {
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
      } else {
      }
    });
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

  selectedViewBy: Number = 0;
  selectedExpBy: number = 0;
  listStatus: Status[] = [
    { value: 0, viewValue: 'All' },
    { value: 1, viewValue: 'Published' },
    { value: -1, viewValue: 'Not Published' },
  ];

  listExpStatus: Status[] = [
    { value: 0, viewValue: 'Newest' },
    { value: 1, viewValue: 'Oldest' },
  ];

  listGradeStatus: Grades[] = [
    { value: "all", viewValue: 'All' },
    { value: GRADES.NHSGE, viewValue: 'Tốt nghiệp THPT' },
    { value: GRADES.TWELFTH, viewValue: 'Grade 12' },
    { value: GRADES.ELEVENTH, viewValue: 'Grade 11' },
    { value: GRADES.TENTH, viewValue: 'Grade 10' },
    { value: GRADES.NINTH, viewValue: 'Grade 9' }
  ]

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
    if (this.grade == 'all' )
      this.getAllListByTitleAndStatus(status);
    else
      this.listCourse = this.listSortedCourse.filter(
        (course) =>
          course.title.toLowerCase().includes(this.titleSearch.toLowerCase()) &&
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
    if (this.grade == 'all' ) this.getAllListByTitle();
    else this.getListByFilterAndTitleSearch();
  }

  getListByFilterAndTitleSearch() {
    this.listCourse = this.listSortedCourse.filter(
      (course) =>
        course.title.toLowerCase().includes(this.titleSearch.toLowerCase()) &&
        course.grade.toString() == this.grade
    );
  }
}
