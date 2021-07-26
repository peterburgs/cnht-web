import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCourseService } from 'src/app/service/full-course.service';
import { Course } from 'src/app/models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FilterComponent } from 'src/app/components/course/search/filter/filter.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TopicDialogComponent } from '../alert/topic-dialog/topic-dialog.component';
import { Topic } from 'src/app/models/topic.model';
import { TOPICS } from 'src/app/models/TOPIC';
import { TopicService } from 'src/app/service/topic.service';

interface Status {
  value: Number;
  viewValue: string;
}
@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css'],
})
export class TopicComponent implements OnInit {
  mTopics: Topic[] = [
    {
      id: 'ss',
      title:
        'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
      fileUrl: '',
      topicType: TOPICS.ALGEBRA,
      isHidden: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'sss',
      title:
        'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
      fileUrl: '',
      topicType: TOPICS.ALGEBRA,
      isHidden: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  topics: Topic[] = [];
  isLoading = false;
  message: string = 'Find my course by title';
  titleSearch: string = '';
  listCourse: Course[] = [];
  listSortedCourse: Course[] = [];
  grade = '';
  typeCourse = '';
  sbcTopics: Subscription = new Subscription();
  sbcCreateTopic = new Subscription();
  public userDetails? = Object;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private topicService: TopicService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.sbcTopics = this.topicService.getTopics().subscribe(
      (res) => {
        this.topics = res.topics;
        this.isLoading = false;

      },
      (error) => {
        this.topics = [];
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
    const modalRef = this.modalService.open(TopicDialogComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.result.then((result: boolean) => {
      if (result) {
        this.isLoading = true;
        this.sbcCreateTopic = this.topicService.onCreateTopic().subscribe(
          (res) => {
            this.topicService.addTopic(res.topic);
            this.router.navigateByUrl('/admin/topics/' + res.topic.id).then();
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            alert('error');
          }
        );
        // this.fullCourseService.createCourse();
        // this.sbcCreate = this.fullCourseService.getSbjCreateCourse().subscribe(
        //   (course) => {
        //      this.isLoading = false;
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
        // this.router.navigate(
        //   [ '/edit'],
        //   { relativeTo: this.route }
        // );
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
    // if (order == 0) {
    //   this.listSortedCourse = this.topics.sort((a, b) => {
    //     return <any>new Date(b.updatedAt) - <any>new Date(a.updatedAt);
    //   });
    // } else {
    //   this.listSortedCourse = this.topics.sort((a, b) => {
    //     return <any>new Date(a.updatedAt) - <any>new Date(b.updatedAt);
    //   });
    // }
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
    this.sbcCreateTopic.unsubscribe();
    this.sbcTopics.unsubscribe();
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
  getDownLoad(idTopic:string){
      
  }
  goEdit(idTopic:string){
    this.router.navigateByUrl('/admin/topics/'+idTopic).then();
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
