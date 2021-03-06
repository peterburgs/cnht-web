import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from 'src/app/models/course.model';
import { Section } from 'src/app/models/section.model';
import { CourseService } from 'src/app/service/course.service';
@Component({
  selector: 'app-content-course',
  templateUrl: './content-course.component.html',
  styleUrls: ['./content-course.component.css'],
})
export class ContentCourseComponent implements OnInit, OnChanges {
  @Input() current_course!: Course;
  @Input() fragment: string = 'learning';
  firstSectionOrder!: number;
  isLoading = true;
  courseId: string = '';
  listSection: Section[] = [];

  constructor(
    private courseService: CourseService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.params.subscribe((param) => {
      this.courseId = param['courseId'];
    });

    this.getListSection();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.courseId != '') {
      this.getListSection();
    }
  }

  getListSection() {
    if (this.current_course.id != '') {
      this.courseService
        .getSectionByCourseId(this.current_course.id)
        .toPromise()
        .then((data) => {
          this.listSection = data.sections.sort((a, b) => {
            return a.sectionOrder - b.sectionOrder;
          });
          this.firstSectionOrder = this.listSection[0].sectionOrder;
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
        });
    }
  }
}
