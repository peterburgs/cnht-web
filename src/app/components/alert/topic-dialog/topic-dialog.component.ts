import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { COURSE_TYPE } from 'src/app/models/course-type';
import { Course } from 'src/app/models/course.model';
import { GRADES } from 'src/app/models/grades';
import { TOPICS } from 'src/app/models/TOPIC';
import { Topic } from 'src/app/models/topic.model';
import { FullCourseService } from 'src/app/service/full-course.service';
import { TopicService } from 'src/app/service/topic.service';
import { FormatPrice } from 'src/app/util/priceformat';

@Component({
  selector: 'app-topic-dialog',
  templateUrl: './topic-dialog.component.html',
  styleUrls: ['./topic-dialog.component.css'],
})
export class TopicDialogComponent implements OnInit {
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private topicService: TopicService
  ) {}
  entryForm!: FormGroup;
  error: string | undefined;
  topic: Topic = new Topic();
  result = false;

  types = [
    TOPICS.ALGEBRA,
    TOPICS.GEOMETRY,
    TOPICS.COMBINATION,
  ];
  grades = [GRADES.TWELFTH, GRADES.ELEVENTH, GRADES.TENTH];
  ngOnInit(): void {
    this.createForm();
  }
  onCancel() {
    this.result = false;
    this.activeModal.close(this.result);
  }

  onCreate() {
    console.log('*** get Info: ');
    // this.topic.courseType = this.entryForm.value.category;
    // this.topic.grade = this.entryForm.value.grade;
    // this.topic.price = parseInt(this.entryForm.value.price.replace(/\D/g, ''));
    this.topic.title = this.entryForm.value.title;
    this.topic.topicType = this.entryForm.value.category;
    this.topicService.setTopicCreate(this.topic);
    console.log("*** from dialog")
    console.log(this.entryForm.value.type);
    // if (this.topic.title && this.topic.courseDescription) {
    //   this.fullCourseService.setCourse(this.topic);
    this.result = true;
    this.activeModal.close(this.result);
    //   this.activeModal.close(this.result);
    // }
  }

  // reactive form
  private createForm() {
    this.entryForm = this.formBuilder.group({
      title: [''],
      category: [''],
    });
  }
}
