import { Component, Input, OnInit } from '@angular/core';
import { Lecture } from 'src/app/models/lecture.model';

import { ModifyType } from 'src/app/models/ModifyType';

import { VideoType } from 'src/app/models/VideoType.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FullCourseService } from 'src/app/service/full-course.service';
import { Subject, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-course-lecture',
  templateUrl: './course-lecture.component.html',
  styleUrls: ['./course-lecture.component.css'],
})
export class CourseLectureComponent implements OnInit {
  @Input() lecture: Lecture = new Lecture();
  @Input() lectureIndex: number = 0;
  @Input() sectionIndex: number = 0;
  @Input() globalLoading: boolean = false;

  @Input() maxLecture: number = 0;
  videoURL: SafeUrl = '';
  files?: File;
  hasVideo = false;
  changeLecture = false;
  videoFile: File = new File([], 'lecture-video');
  lectureTitle = '';
  fileToUpload = new File([], 'default');
  duration: number = 0;
  eventSave = false;
  tmpTimeVideo = 0;
  timeVideo = 0;
  sbjLoadingDuration = new Subject<number>();
  sbcMediaUpload = new Subscription();
  @Input() isUpLoading: boolean = false;
  constructor(
    private fullCourseService: FullCourseService,
    private sanitizer: DomSanitizer,
    private _snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.fullCourseService
      .getVideoInfo(this.lecture.id)
      .toPromise()
      .then((response) => {
        this.timeVideo = response.video.length;
      })
      .catch((error) => {
        this.timeVideo = -1;
      });
    this.sbjLoadingDuration.subscribe((duration) => {
      if (this.fileToUpload.name != 'default') {
        this.fullCourseService.handleUpdateWithVideo(
          this.fileToUpload,
          this.duration,
          this.sectionIndex,
          this.lectureIndex
        );
        this.sbcMediaUpload = this.fullCourseService
          .getSbjUploadMediaState()
          .subscribe((state) => {
            if (state == false) {
              this.sbcMediaUpload.unsubscribe();
            } else {
              this.timeVideo = this.tmpTimeVideo;
              this.sbjLoadingDuration.next(this.timeVideo);
              this.sbcMediaUpload.unsubscribe();
            }

            this.sbjLoadingDuration.unsubscribe();
          });
      }
    });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  getSbjLoadingDuration() {
    return this.sbjLoadingDuration.asObservable();
  }
  clickEditLecture($event: any) {
    this.eventSave = true;
    this.lectureTitle = $event.target.value;
  }
  saveLecture(idLecture: string) {
    this.fullCourseService.setSelection(
      idLecture,
      VideoType.lecture,
      ModifyType.edit
    );
    this.fullCourseService.handleEditTitleLecture(this.lectureTitle).subscribe(
      (response) => {
        this.openSnackBar('Changes saved', 'OK');
      },
      (error) => {
        alert('Server disconnect at this time, try again');
      }
    );
    this.eventSave = false;
  }
  enableChangeLecture(event: any) {
    this.changeLecture = true;
    this.lectureTitle = event?.target.value;
  }
  onEditLecture(id: string) {
    this.fullCourseService.setSelection(id, VideoType.lecture, ModifyType.edit);
  }

  onUpLecture(id: string) {
    this.fullCourseService.setItemIndex(this.lectureIndex);
    this.fullCourseService.setSelection(id, VideoType.lecture, ModifyType.goUp);
  }
  onDownLecture(id: string) {
    this.fullCourseService.setItemIndex(this.lectureIndex);
    this.fullCourseService.setSelection(
      id,
      VideoType.lecture,
      ModifyType.goDown
    );
  }

  onDeleteLecture(id: string) {
    this.fullCourseService.setSelection(
      id,
      VideoType.lecture,
      ModifyType.delete
    );
  }
  handleFileInput(event: Event, idLecture: string) {}

  readVideoUrl(event: any, idLecture: string) {
    const files = event.target.files;
    if (files && files[0]) {
      this.fullCourseService.setSelection(
        idLecture,
        VideoType.lecture,
        ModifyType.edit
      );
      this.fullCourseService.setPositionLoading(
        true,
        this.sectionIndex,
        this.lectureIndex
      );

      this.fileToUpload = files[0];
      this.videoURL = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(files[0])
      );
    }
  }
  getDuration(e: any) {
    this.duration = e.target.duration;
    this.tmpTimeVideo = Math.round(this.duration);
    this.sbjLoadingDuration.next(this.duration);
  }
  ngOnDestroy(): void {
    this.sbjLoadingDuration.unsubscribe();
    this.sbcMediaUpload.unsubscribe();
  }
}
