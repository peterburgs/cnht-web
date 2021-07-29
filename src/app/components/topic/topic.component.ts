import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  message: string = 'Find a topic';
  titleSearch: string = '';
  listTopic: Topic[] = [];
  listSortedTopic: Topic[] = [];
  topicType = 'all';
  typeCourse = '';
  sbcTopics: Subscription = new Subscription();
  sbcCreateTopic = new Subscription();
  isAdmin: boolean = false;
  selectedExpBy: number = 0;
  currentTopic: string = TOPICS.ALGEBRA;
  public userDetails? = Object;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private topicService: TopicService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    let role = localStorage.getItem('role');
    if (role && role == 'admin' && this.router.url.includes('/admin'))
      this.isAdmin = true;
    else this.isAdmin = false;
    this.route.params.subscribe((params) => {
      this.isLoading = true;
      let topicType = params['name'];
      this.listTopic = [];
      this.sbcTopics = this.topicService.getTopics().subscribe(
        (res) => {
          this.topics = res.topics;
          if (this.isAdmin) this.getAllByDate();
          else {
            if (topicType) {
              this.topicType = topicType;
              this.sortByDate(this.selectedExpBy);
              this.getListByTopicType(this.topicType);
            } else {
              this.router.navigateByUrl('/not-found');
            }
          }
          this.isLoading = false;
        },
        (error) => {
          this.listTopic = [];
          this.isLoading = false;
          this.topicType = topicType;
        }
      );
    });
  }

  signOut(): void {
    localStorage.removeItem('google_auth');
    this.router.navigateByUrl('/admin/login').then();
  }

  onCreateCourse() {
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
            this.router
              .navigateByUrl('/admin/topics/' + res.topic.id + '/edit')
              .then();
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            alert('error');
          }
        );
      } else {
      }
    });
  }

  getAllByDate() {
    //ok
    this.sortByDate(this.selectedExpBy);
    this.getAllByFilter();
  }

  searchCourse($event: string) {
    this.titleSearch = $event;
    this.getAllByFilter();
  }

  sortByDate(order: number) {
    //ok
    if (order == 0) {
      this.listSortedTopic = this.topics.sort((a, b) => {
        return <any>new Date(b.updatedAt) - <any>new Date(a.updatedAt);
      });
    } else {
      this.listSortedTopic = this.topics.sort((a, b) => {
        return <any>new Date(a.updatedAt) - <any>new Date(b.updatedAt);
      });
    }
  }

  getAllListByTitle() {
    //ok
    this.listTopic = this.listSortedTopic.filter((topic) =>
      topic.title.toLowerCase().includes(this.titleSearch.toLowerCase())
    );
  }

  ngOnDestroy(): void {
    this.sbcCreateTopic.unsubscribe();
    this.sbcTopics.unsubscribe();
  }

  listStatus: StatusTopic[] = [
    { value: 'all', viewValue: 'All' },
    { value: TOPICS.ALGEBRA, viewValue: 'Algebra' },
    { value: TOPICS.GEOMETRY, viewValue: 'Geometry' },
    { value: TOPICS.COMBINATION, viewValue: 'Combination' },
  ];

  listExpStatus: Status[] = [
    { value: 0, viewValue: 'Newest' },
    { value: 1, viewValue: 'Oldest' },
  ];

  getAllByFilter() {
    switch (this.topicType) {
      case 'all':
        this.getAllListByTitle();
        break;
      default:
        this.getListByTopicType(this.topicType);
        break;
    }
  }

  getListByTopicType(type: string) {
    if (type == 'all') this.getAllByDate();
    else
      this.listTopic = this.listSortedTopic.filter(
        (topic) =>
          topic.title.toLowerCase().includes(this.titleSearch.toLowerCase()) &&
          topic.topicType == type
      );
  }

  viewFile(topicTitle: string, topicId: string) {
    let formatTitle = topicTitle.replace(/[^\x00-\xFF]/g, '');
    formatTitle = formatTitle.replace(/\s/g, '_');
    this.router
      .navigate(['topics/' + formatTitle + '/' + topicId + '/view'], {
        state: { redirect: this.router.url },
      })
      .then();
  }

  getDownLoad(topicTile: string, topicId: string, topicUrl: string) {
    let nameFormat = topicTile.replace(/[^\x00-\xFF]/g, '');
    nameFormat = nameFormat.replace(/\s/g, '-');
    this.openSnackBar('File is being downloaded. Please wait', 'OK');
    this.topicService.downloadFile(topicUrl).subscribe(
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
    this.router.navigate([idTopic, 'edit'], { relativeTo: this.route });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  copyMessage(topicTitle: string, topicId: string) {
    let formatTitle = topicTitle.replace(/[^\x00-\xFF]/g, '');
    formatTitle = formatTitle.replace(/\s/g, '_');
    let urlReview =
      window.location.origin +
      '/topics/' +
      formatTitle +
      '/' +
      topicId +
      '/view';

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = urlReview;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.openSnackBar('Link copied to clipboard!', 'OK');
  }
}
