import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Section } from 'src/app/models/section.model';
import { CourseService } from 'src/app/service/course.service';
import { Lecture } from 'src/app/models/lecture.model';
import { Video } from 'src/app/models/video.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-section-course',
  templateUrl: './section-course.component.html',
  styleUrls: ['./section-course.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class SectionCourseComponent implements OnInit {
  @Input() section!: Section;
  @Input() firstSectionOrder!: number;
  listLecture: Lecture[] = [];
  video!: Video;
  selectedLecture!: string;

  constructor(
    private courseService: CourseService,
    private route: Router,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.courseService
      .getLecturesBySectionId(this.section.id)
      .subscribe((responseData) => {
        this.listLecture = responseData.lectures.sort((a, b) => {
          return a.lectureOrder - b.lectureOrder;
        });
        for (let i = 0; i < this.listLecture.length; i++) {
          this.courseService
            .getVideoLength(this.listLecture[i].id)
            .toPromise()
            .then((data) => {
              this.listLecture[i].length = data.video.length;
            })
            .catch();
        }
      });

    this.activeRoute.params.subscribe((params) => {
      let lectureId = params['lectureId'];
      this.selectedLecture = lectureId;
    });
  }

  getLecturesBySectionId(sectionId: string) {
    this.courseService
      .getLecturesBySectionId(sectionId)
      .toPromise()
      .then((responseData) => {
        this.listLecture = responseData.lectures.sort((a, b) => {
          return a.lectureOrder - b.lectureOrder;
        });

        for (let i = 0; i < this.listLecture.length; i++) {
          this.courseService
            .getVideoLength(this.listLecture[i].id)
            .toPromise()
            .then((data) => {
              this.listLecture[i].length = data.video.length;
            })
            .catch((error) => {
              this.listLecture[i].length = 0;
            });
        }
        this.loadLecture(this.listLecture[0].id);
      });
  }

  formatTime(time: number) {
    if (isNaN(time) || time <= 0) return '00:00';
    return (
      (~~(time / 60) + '').padStart(2, '0') +
      ':' +
      (~~(((time / 60) % 1) * 60) + '').padStart(2, '0')
    );
  }

  loadLecture(lectureId: string) {
    let courseId;
    this.activeRoute.fragment.subscribe((fragment) => {
      if (fragment == 'learning') {
        this.activeRoute.params.subscribe((params) => {
          courseId = params['courseId'];
        });
      }
    });

    this.route.navigate(['/learning', courseId, this.section.id, lectureId], {
      fragment: 'learning',
    });
  }
}
