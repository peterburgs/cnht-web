import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Topic } from 'src/app/models/topic.model';
import { TopicService } from 'src/app/service/topic.service';
import { environment } from 'src/environments/environment';

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

  baseUrl = environment.baseUrl;
  topic: Topic = new Topic();
  isLoading = false;
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
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
        }
      );
    });
  }

  goBack() {
    history.back();
  }
}
