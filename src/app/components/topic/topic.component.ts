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
import { MatSnackBar } from '@angular/material/snack-bar';

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
  mTopics: Topic[] = [];

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
    private topicService: TopicService,
    private _snackBar: MatSnackBar
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

  getListByTopicType(type: string) {
    console.log("get by type: " + this.topicType);
      this.listTopic = this.listSortedTopic.filter(
        (topic) =>
          topic.title.toLowerCase().includes(this.titleSearch.toLowerCase()) &&
          topic.topicType == type
      );
  }

 
  reviewFile(topicTitle: string, topicId: string) {
    let formatTitle = topicTitle.replace(/[^\x00-\xFF]/g, '');
    formatTitle = formatTitle.replace(/\s/g, '');
    console.log('*** topic ' + formatTitle + ' ' + topicId);
    this.router
      .navigateByUrl('admin/home/topics/' + formatTitle + '/' + topicId)
      .then();
  }
  getDownLoad(topicTile: string, topicId: string, topicUrl: string) {
    let nameFormat = topicTile.replace(/[^\x00-\xFF]/g, '');
    nameFormat = nameFormat.replace(/\s/g, '');
   
    this.topicService.downloadFile(nameFormat).subscribe(
      (data) => {
        //let blob = new Blob([data],{type:'application/pdf'})
        var downloadURL = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = `${nameFormat}.pdf`;
        link.click();
      },
      (error) => {
        this.openSnackBar('This file is not available now', 'OK');
      }
    );
  }
  goEdit(idTopic: string) {
    // this.router.navigateByUrl('/admin/topics/' + idTopic).then();
    this.router.navigate([idTopic], { relativeTo: this.route });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
