import { ReadVarExpr } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Topic } from 'src/app/models/topic.model';
import { TopicService } from 'src/app/service/topic.service';

@Component({
  selector: 'app-topic-screen',
  templateUrl: './topic-screen.component.html',
  styleUrls: ['./topic-screen.component.css'],
})
export class TopicScreenComponent implements OnInit {
  constructor(
    private topicService: TopicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  // tmpUrl='https://us-central1-supple-craft-318515.cloudfunctions.net/app/api/topics/files/e15776e2-5277-4384-8a34-02848221aefd.pdf'
  tmpUrl='https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf'
  encodeUrl='';
  topic: Topic = new Topic();
  isLoading = false;
  page:number=1
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.topic.id = params['id'];
      if (!this.topic.id) {
        this.router.navigateByUrl('/admin/topics').then();
      }
      this.isLoading = true;

      this.topicService.getFileFromUrl(this.tmpUrl).subscribe(data=>{
        let reader= new FileReader();
        reader.onload=(e:any)=>{
          this.encodeUrl=e.target.result;

        }
        var downloadURL = window.URL.createObjectURL(data);
        reader.readAsArrayBuffer(data)
      })
      
      // this.topicService.getTopicById(this.topic.id).subscribe(
      //   (res) => {
      //     this.topic = res.topic;
      //     this.isLoading = true;
      //   },
      //   (error) => {
      //     this.isLoading = true;
      //     this.router.navigate(['error/not-found'], { relativeTo: this.route });
      //   }
      // );
    });
  }
}
