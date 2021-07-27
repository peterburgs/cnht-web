import { ReadVarExpr } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from '@angular/platform-browser';
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
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  @Input()
  private code: string = '';
  url: SafeResourceUrl = '';
  html: SafeHtml = '';
  baseUrl = 'https://us-central1-supple-craft-318515.cloudfunctions.net/app';
  encodeUrl = '';
  topic: Topic = new Topic();
  isLoading = false;
  page: number = 1;
  emptyContent = false;
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.topic.id = params['id'];
      if (!this.topic.id) {
        this.router.navigateByUrl('/admin/topics').then();
      }
      this.isLoading = true;
      this.topicService.getTopicByIdRemote(this.topic.id).subscribe(
        (res) => {
          this.topic = res.topics[0];
        
          let url = `${this.baseUrl}${this.topic.fileUrl}`;
          let html = `<embed width="90%" height="100%" src="${url}" />`;
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.html = this.sanitizer.bypassSecurityTrustHtml(html);
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.emptyContent = true;
        }
      );
      // this.topicService.getFileFromUrl(this.tmpUrl).subscribe((data) => {
      //   let reader = new FileReader();
      //   reader.onload = (e: any) => {
      //     this.encodeUrl = e.target.result;
      //   };
      //   var downloadURL = window.URL.createObjectURL(data);
      //   reader.readAsArrayBuffer(data);
      // });
    });
  }
}
