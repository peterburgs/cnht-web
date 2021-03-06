import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
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
  private baseUrl: string = environment.baseUrl + '/api';

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

  getListCourseGrade(level_: GRADES) {
    return this.http
      .get<{ message: string; count: number; courses: Course[] }>(
        this.baseUrl + '/courses',
        {
          params: new HttpParams().set('grade', level_).set('isHidden', false),
        }
      )
      .pipe();
  }

  getListCourseByGrade(level_: string) {
    return this.http
      .get<{ message: string; count: number; courses: Course[] }>(
        this.baseUrl + '/courses',
        {
          params: new HttpParams().set('grade', level_),
          headers: this.httpOptions.headers,
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

  getListCourseFilter(grade: GRADES) {
    return this.http
      .get<{ message: string; count: number; courses: Course[] }>(
        environment.baseUrl + '/api/courses',
        {
          params: new HttpParams().set('grade', grade),
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

  getLectureByLectureId(lectureId: string) {
    return this.http.get<{
      message: string;
      count: number;
      lectures: Lecture[];
    }>(this.baseUrl + '/lectures?id=' + lectureId);
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
