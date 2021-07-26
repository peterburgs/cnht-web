import { Component, OnInit } from '@angular/core';
import { TOPICS } from 'src/app/models/TOPIC';
import { Topic } from 'src/app/models/topic.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TopicService } from 'src/app/service/topic.service';
@Component({
  selector: 'app-modify-topic',
  templateUrl: './modify-topic.component.html',
  styleUrls: ['./modify-topic.component.css'],
})
export class ModifyTopicComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private topicService: TopicService
  ) {}

  ngOnInit(): void {
    // if (this.authService.isAdmin()) {
    this.route.params.subscribe((params: Params) => {
      this.topic.id = params['id'];
      if (!this.topic.id) {
        this.router.navigateByUrl('/admin/topics').then();
      }
      this.topic = this.topicService.getTopicById(this.topic.id);
    });
  }
  isUpdate = false;
  isSaving=false;
  topic: Topic = new Topic();
  uploadTopic = false;
  fileToUpLoad = new File([], 'default');
  tmpFileName = '';
  types = [TOPICS.ALGEBRA, TOPICS.COMBINATION, TOPICS.GEOMETRY];
  handleFileInput(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.uploadTopic = true;
      this.isUpdate = true;
      this.fileToUpLoad = <File>fileList.item(0);

      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.tmpFileName = this.fileToUpLoad.name.replace(/[^\x00-\x7F]/g, '');
        Object.defineProperty(this.fileToUpLoad, 'name', {
          writable: true,
          value: this.tmpFileName,
        });
        this.topicService
          .updateTopicFile(this.topic.id, this.fileToUpLoad)
          .subscribe(
            (response) => {
              console.log(response);
              this.isUpdate = false;
            },
            (error) => {
              console.log(error);
              this.isUpdate = false;
            }
          );
      };

      reader.readAsDataURL(this.fileToUpLoad);
    }
  }
  changeType(e: any) {
    this.topic.topicType = e.target.value;
  }
  updateTopic() {
    console.log(this.topic);
    this.isSaving=true;
    this.topicService.onUpdate(this.topic).subscribe((res) => {
      console.log(res.message);
      this.topicService.updateTopicInList(res.topic);
      this.isSaving=false;
    }, error=>{
      this.isSaving=false;
      alert('Can not save topic now')
    });
  }
}
