import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { COURSE_TYPE } from '../models/course-type';
import { Course } from '../models/course.model';
import { Enrollment } from '../models/enrollment.model';
import { GRADES } from '../models/grades';
import { Lecture } from '../models/lecture.model';
import { Section } from '../models/section.model';
import { Video } from '../models/video.model';
import { authenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private baseUrl: string =
    'https://us-central1-supple-craft-318515.cloudfunctions.net/app/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.authService.getToken(),
    }),
  };
  constructor(
    private http: HttpClient,
    private authService: authenticationService
  ) {}

  getListCourseGrade(level_: GRADES, type_: COURSE_TYPE) {
    return this.http
      .get<{ message: string; count: number; courses: Course[] }>(
        this.baseUrl + '/courses',
        {
          params: new HttpParams()
            .set('grade', level_)
            .set('courseType', type_)
            .set('isHidden', false),
        }
      )
      .pipe();
  }

  getListCourseByGrade(level_: GRADES) {
    return this.http
      .get<{ message: string; count: number; courses: Course[] }>(
        this.baseUrl + '/courses',
        {
          params: new HttpParams()
            .set('grade', level_)
            .set('isHidden', true),
        }
      )
      .pipe();
  }

  getCourseById(id: string) {
    return this.http.get<{ message: string; count: number; courses: Course[] }>(
      this.baseUrl + '/courses',
      {
        params: new HttpParams().set('id', id),
      }
    );
  }

  getListCourseFilter(courseType: COURSE_TYPE, grade: GRADES) {
    return this.http
      .get<{ message: string; count: number; courses: Course[] }>(
        'https://us-central1-supple-craft-318515.cloudfunctions.net/app/api/courses',
        {
          params: new HttpParams()
            .set('grade', grade)
            .set('courseType', courseType),
        }
      )
      .subscribe((response) => {});
  }

  getAllCourse() {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'token');
    return this.http.get<{ message: string; count: number; courses: Course[] }>(
      this.baseUrl + '/courses',
      {
        headers: headers,
      }
    );
  }
  getListCourseByTitle(title: string) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'token');
    return this.http.get<{ message: string; count: number; courses: Course[] }>(
      this.baseUrl + '/courses',
      {
        headers: headers,
        params: new HttpParams().set('title', title).set('isHidden', false),
      }
    );
  }
  getstudentJoinedNumber(courseId: string) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : 'null';
    const tokenType = 'Bearer ';
    const header = new HttpHeaders().set('Authorization', tokenType + token);
    return this.http.get<{
      message: string;
      count: number;
      enrollments: Enrollment[];
    }>(this.baseUrl + '/enrollments', {
      params: new HttpParams().set('courseId', courseId),
      headers: header,
    });
  }

  getLectureByCourseId(courseId: string) {
    return this.http.get<{
      message: string;
      count: number;
      lectures: Lecture[];
    }>(this.baseUrl + '/courses/' + courseId + '/lectures');
  }

  getSectionByCourseId(courseId: string) {
    return this.http.get<{
      message: string;
      count: number;
      sections: Section[];
    }>(this.baseUrl + '/sections', {
      params: new HttpParams().set('courseId', courseId),
    });
  }

  getLecturesBySectionId(sectionId: string) {
    return this.http.get<{
      message: string;
      count: number;
      lectures: Lecture[];
    }>(this.baseUrl + '/lectures', {
      params: new HttpParams().set('sectionId', sectionId),
    });
  }

  getVideoByLectureId(lectureId: string) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : 'null';

    const key =
      'RGhqHqXSZfjAiyXgzznYnHSKRvxiHBWvzLZFZTUxXhRjvqsagFwHzfXuQPWcTQALWHqGKUPBFmuLWmKavtRvBWriLgXWtCAuDrsukwgTBQfuPVOiSeWtLbNTgSjtgYtICvCzYSmxwIXGeurxyOcGlrjvcDaAIsDIBDziWipcZbBPVUlzwhnpvjPrVHghlOppHdRUxctaGRUcBQXUJutPBhNSzebikzpytuIADtOEswqcJxZsBvkwvDayDXrofHfpxOrYzTXLSvZTkXodWNimYNiTAlFywOcRFMFSaNYOQAsxsHiDFxnvwFHkwMivNjJqAalJaUqmUDHkrWnGWnPLEZogCTwQSbnTEZIIZEHoCdxWftJaddNbreSHUVlPhLTWSAcmdwkgCDASTRLGjClarTYPmTZppYyKJcCmQyKmmFFFvhFsSZevKWKCGcQVUmnbPKiIXGQWyUieQZEgBhqlJhbKkzmMoWZPzsioovcdmKBQNRRHKfBtnaROdYhrXaeA=' +
      token;
    const URL = this.baseUrl + `/lectures/${lectureId}/video/streaming?${key}`;
    return this.http.get<{ message: string; signedUrl: string }>(URL);
  }

  getMyCourses(learnerId: string) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : 'null';
    const tokenType = 'Bearer ';
    const header = new HttpHeaders().set('Authorization', tokenType + token);
    return this.http.get<{
      message: string;
      count: number;
      enrollments: Enrollment[];
    }>(this.baseUrl + '/enrollments', {
      headers: header,
      params: new HttpParams().set('learnerId', learnerId),
    });
  }

  getTotalLeanerOfCourse(id: string): number {
    var number = 0;
    this.getstudentJoinedNumber(id).subscribe((list) => (number = list.count));
    return number;
  }

  getVideoLength(lectureId: string) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : 'null';
    const tokenType = 'Bearer ';
    const header = new HttpHeaders().set('Authorization', tokenType + token);
    return this.http.get<{ message: string; count: number; video: Video }>(
      this.baseUrl + `/lectures/${lectureId}/video`,
      {
        headers: header,
      }
    );
  }
}
