import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Comment } from '../models/comment.model';
@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private baseUrl: string = environment.baseUrl + '/api';

  constructor(private http: HttpClient) {}
  saveComment(comment: Comment) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : 'null';
    const config = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<{ message: string; count: number; comment: Comment }>(
      this.baseUrl + '/comments',
      comment,
      config
    );
  }
  getCommentByLectureId(lectureId: string) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : 'null';
    const tokenType = 'Bearer ';
    const header = new HttpHeaders().set('Authorization', tokenType + token);
    return this.http.get<{
      message: string;
      count: number;
      comments: Comment[];
    }>(this.baseUrl + '/comments', {
      params: new HttpParams()
        .set('lectureId', lectureId)
        .set('isHidden', false),
      headers: header,
    });
  }
}
