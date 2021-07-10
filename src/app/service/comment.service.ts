import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Comment } from "../models/comment.model";
import { listComment } from "../util/mockData";

@Injectable({
    providedIn: 'root'
  })
export class CommentService{
    
  private baseUrl:string= 'https://us-central1-supple-craft-318515.cloudfunctions.net/app/api';

  constructor(
    private http: HttpClient
  ){}

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
        // A client-side or network error occurred. Handle it accordingly.
        //console.error('An error occurred:', error.error);
    } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        // console.error(
        // `Backend returned code ${error.status}, ` +
        // `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
        'Something bad happened; please try again later.');
}

    //TODO:  send post request to create new sub comment
    /**
     * 
     * @param comment 
     */
    saveComment(comment: Comment){
      const token= localStorage.getItem('token')?localStorage.getItem('token'):"null";
      const config = { 
        headers: new HttpHeaders().set('Authorization','Bearer '+ token) ,
      };
      return  this.http
      .post<{message:string, count:number, comment:Comment }>( this.baseUrl+'/comments',comment,config)
    }

  
    //TODO:send get request comments by lecture id
  /**
   * 
   * @param lectureId 
   * @returns Observable<Comment[]>
   */
  getCommentByLectureId(lectureId:string){
    
    const token= localStorage.getItem('token')?localStorage.getItem('token'):"null";
    const tokenType= "Bearer "
    const header = new HttpHeaders().set('Authorization', tokenType + token);
    return this.http
        .get<{message:string,count:number, comments: Comment[]}>(
            this.baseUrl+ '/comments',
            {
                params:new HttpParams().set('lectureId',lectureId).set('isHidden',false),
                headers: header
            }
        )
        .pipe(
          catchError(this.handleError)
        );
  }
  

}