import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TOPICS } from 'src/app/models/TOPIC';
import { Topic } from 'src/app/models/topic.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TopicService } from 'src/app/service/topic.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-modify-topic',
  templateUrl: './modify-topic.component.html',
  styleUrls: ['./modify-topic.component.css'],
})
export class ModifyTopicComponent implements OnInit {
  @ViewChild('content', { static: true }) content?: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private topicService: TopicService,
    private modalService: NgbModal,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.topic.id = params['id'];
      if (!this.topic.id) {
        this.router.navigateByUrl('/admin/topics').then();
      }
      this.isLoading = true;
      this.topicService.getTopicByIdRemote(this.topic.id).subscribe(
        (res) => {
          this.topic = res.topics[0];
          let formatTitle = this.topic.title.replace(/[^\x00-\xFF]/g, '');
          formatTitle = formatTitle.replace(/\s/g, '_');

          this.fileName = formatTitle;
          this.isLoading = true;
        },
        (error) => {
          this.isLoading = true;
          this.router.navigate(['/not-found'], { relativeTo: this.route });
        }
      );
    });
    this.sbcUploadFile = this.topicService.getIsUpdateFile().subscribe(
      (data) => {
        if (!data) {
          this.isUpdate = false;
          this.topicService
            .getTopicByIdRemote(this.topic.id)
            .subscribe((res) => {
              this.topic = res.topics[0];
              this.fileName = this.fileToUpLoad.name;
              this.openSnackBar('File uploaded successfully', 'OK');
            });
        }
      },
      (error) => {
        this.isUpdate = false;
      }
    );
  }
  isLoading = false;
  isUpdate = false;
  isSaving = false;
  topic: Topic = new Topic();
  fileName = '';
  fileToUpLoad = new File([], 'default');
  tmpFileName = '';
  sbcUploadFile: Subscription = new Subscription();
  types = [
    TOPICS.ALGEBRA,
    TOPICS.ANALYSIS,
    TOPICS.ARITHMETIC,
    TOPICS.COMBINATION,
    TOPICS.GEOMETRY,
  ];
  handleFileInput(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.isUpdate = true;
      this.fileToUpLoad = <File>fileList.item(0);

      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.tmpFileName = this.fileToUpLoad.name.replace(/[^\x00-\x7F]/g, '');
        Object.defineProperty(this.fileToUpLoad, 'name', {
          writable: true,
          value: this.tmpFileName,
        });
        this.topicService.updateTopicFile(this.topic.id, this.fileToUpLoad);
      };

      reader.readAsDataURL(this.fileToUpLoad);
    }
  }
  changeType(e: any) {
    this.topic.topicType = e.target.value;
  }
  updateTopic() {
    this.isSaving = true;
    this.topicService.onUpdate(this.topic).subscribe(
      (res) => {
        this.topicService.updateTopicInList(res.topic);
        this.isSaving = false;
        this.openSnackBar('All changes saved', 'OK');
      },
      (error) => {
        this.isSaving = false;
        alert('Can not save topic now');
      }
    );
  }
  goBack() {
    this.router.navigateByUrl('/admin/topics').then();
  }
  onDelete() {
    this.modalService.dismissAll();
    this.isLoading = true;
    this.topicService.onDeleteTopic(this.topic.id).subscribe(
      (res) => {
        this.router.navigateByUrl('/admin/topics').then();
        this.isLoading = false;
      },
      (error) => {
        alert('Error happen!!! try again');
        this.isLoading = false;
      }
    );
  }
  onConfirmDelete() {
    this.modalService.open(this.content, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sbcUploadFile.unsubscribe();
  }
  goUrl() {
    let formatTitle = this.topic.title.replace(/[^\x00-\xFF]/g, '');
    formatTitle = formatTitle.replace(/\s/g, '_');
    let baseUrl = window.location.origin;

    let urlReview =
      window.location.origin +
      '/topics/' +
      formatTitle +
      '/' +
      this.topic.id +
      '/view';

    window.open(urlReview);
  }
}
