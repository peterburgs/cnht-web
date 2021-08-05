import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {CourseService} from 'src/app/service/course.service';
import {Lecture} from "../../../../models/lecture.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
})
export class NoteComponent implements OnInit {
  noteText: string = '';
  lectureId!: string;
  isLoading: boolean = true;
  lecture: Lecture = new Lecture()

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private _snackBar: MatSnackBar,
    private http: HttpClient
  ) {
  }

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
          this.lecture = res.lectures[0];
          this.isLoading = false;
        });
    });
  }

  getResource() {
    let nameFormat = this.lecture.title.replace(/[^\x00-\xFF]/g, '');
    nameFormat = nameFormat.replace(/\s/g, '-');
    if (this.lecture.note) {
      const httpOptions = {
        responseType: 'blob' as 'json',
      };
      this.openSnackBar('This file is being downloaded', 'OK');
      this.http.get(this.lecture.note, httpOptions).subscribe(data => {
          let downloadURL = window.URL.createObjectURL(data);
          let link = document.createElement('a');
          link.href = downloadURL;
          link.download = `${nameFormat}.pdf`;
          link.click();
        },
        (error) => {
          this.openSnackBar('This file is not available now', 'OK');
        })

    } else {
      this.openSnackBar('This file is not available now', 'OK');
    }

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
