import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CourseService } from 'src/app/service/course.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
})
export class NoteComponent implements OnInit {
  noteText: string = '';
  lectureId!: string;
  isLoading: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.lectureId = params['lectureId'];
      this.isLoading = true;
      this.courseService
        .getLectureByLectureId(this.lectureId)
        .pipe(
          catchError((error) => {
            this.isLoading = false;
            return throwError(error);
          })
        )
        .subscribe((res) => {
          let note = res.lectures[0].note;
          if (note) this.noteText = note;
          else this.noteText = '';
          this.isLoading = false;
        });
    });
  }
}
