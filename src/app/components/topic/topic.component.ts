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

interface StatusTopic {
  value: string;
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
  message: string = 'Find topic by title';
  titleSearch: string = '';
  listTopic: Topic[] = [];
  listSortedTopic: Topic[] = [];
  topicType = 'all';
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
        this.getAllByDate();
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

  getAllByDate() { //ok
    this.sortByDate(this.selectedExpBy);
    this.getAllByFilter();
  }


  searchCourse($event: string) {
    this.titleSearch = $event;
    this.getAllByFilter();
  }

  sortByDate(order: number) { //ok
    if (order == 0) {
      this.listSortedTopic= this.topics.sort((a, b) => {
        return <any>new Date(b.updatedAt) - <any>new Date(a.updatedAt);
      });
    } else {
      this.listSortedTopic = this.topics.sort((a, b) => {
        return <any>new Date(a.updatedAt) - <any>new Date(b.updatedAt);
      });
    }
  }

  getAllListByTitle() { //ok
    this.listTopic = this.listSortedTopic.filter((topic) =>
    topic.title.toLowerCase().includes(this.titleSearch.toLowerCase())
    );
  }

  ngOnDestroy(): void {
    this.sbcCreateTopic.unsubscribe();
    this.sbcTopics.unsubscribe();
  }

  selectedExpBy: number = 0;

  listStatus: StatusTopic[] = [
    { value: "all", viewValue: 'All' },
    { value: TOPICS.ALGEBRA, viewValue: 'Algebra' },
    { value: TOPICS.GEOMETRY, viewValue: 'Geometry' },
    { value: TOPICS.COMBINATION, viewValue: 'Combination' }
  ];

  listExpStatus: Status[] = [
    { value: 0, viewValue: 'Newest' },
    { value: 1, viewValue: 'Oldest' },
  ];

  getAllByFilter() {
    console.log("type: " + this.topicType);
    switch (this.topicType) {
      case "all":
        this.getAllListByTitle(); //ok
        break;
      default:
        this.getListByTopicType(this.topicType); //0k
         break;
    }
  }
  getDownLoad(idTopic:string){
      
  }


  goEdit(idTopic:string){
    this.router.navigateByUrl('/admin/topics/'+idTopic).then();
  }

  getListByTopicType(type: string) {
    console.log("get by type: " + this.topicType);
      this.listTopic = this.listSortedTopic.filter(
        (topic) =>
          topic.title.toLowerCase().includes(this.titleSearch.toLowerCase()) &&
          topic.topicType == type
      );
  }

}
