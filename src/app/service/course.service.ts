import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { COURSE_TYPE } from "../models/course-type";
import { Course } from "../models/course.model";
import { Enrollment } from "../models/enrollment.model";
import { GRADES } from "../models/grades";
import { Lecture } from "../models/lecture.model";
import { Section } from "../models/section.model";
import { Video } from "../models/video.model";
import {lectureList, sectionList} from 'src/app/util/mockData'
import { authenticationService } from "./authentication.service";

@Injectable({
    providedIn: 'root'
  })

export class CourseService{

    private courses: Course[]=[{
        id: "1",
        title: "Giải phương trình bậc 3",
        courseDescription: "Description",
        price:150000,
        courseType: COURSE_TYPE.THEORY,
        grade: GRADES.TENTH,
        thumbnailUrl: "string",
        createdAt: new Date(),
        updatedAt: new Date(),
        isHidden: false
    },
    {
        id: "2",
        title: "Tìm diện tích khối trụ bằng phương pháp căn bản như trên",
        courseDescription: "Description",
        price:170000,
        courseType: COURSE_TYPE.THEORY,
        grade: GRADES.TWELFTH,
        thumbnailUrl: "string",
        createdAt:new Date(),
        updatedAt: new Date(),
        isHidden: false
        
    },
    {
        id: "3",
        title: "Giai tích căn bản",
        courseDescription: "Description",
        price:200000,
        courseType: COURSE_TYPE.THEORY,
        grade: GRADES.TWELFTH,
        thumbnailUrl: "string",
        createdAt: new Date(),
        updatedAt: new Date(),
        isHidden: false
    },
    {
        id: "4",
        title: "Giai tích căn bản",
        courseDescription: "Description",
        price:200000,
        courseType: COURSE_TYPE.THEORY,
        grade: GRADES.TWELFTH,
        thumbnailUrl: "string",
        createdAt: new Date(),
        updatedAt: new Date(),
        isHidden: false
    },
    {
        id: "5",
        title: "Giai tích căn bản",
        courseDescription: "Description",
        price:200000,
        courseType: COURSE_TYPE.THEORY,
        grade: GRADES.ELEVENTH,
        thumbnailUrl: "string",
        createdAt: new Date(),
        updatedAt: new Date(),
        isHidden: false
    },
    {
        id: "6",
        title: "Giai tích căn bản",
        courseDescription: "Description",
        price:200000,
        courseType: COURSE_TYPE.THEORY,
        grade: GRADES.ELEVENTH,
        thumbnailUrl: "string",
        createdAt: new Date(),
        updatedAt: new Date(),
        isHidden: false
    },
    {
        id: "7",
        title: "Tìm diện tích khối trụ bằng phương pháp căn bản như trên",
        courseDescription: "Description",
        price:170000,
        courseType: COURSE_TYPE.THEORY,
        grade: GRADES.TWELFTH,
        thumbnailUrl: "string",
        createdAt: new Date(),
        updatedAt: new Date(),
        isHidden: false
        
    },
    {
        id: "8",
        title: "Tìm diện tích khối trụ bằng phương pháp căn bản như trên",
        courseDescription: "Description",
        price:170000,
        courseType: COURSE_TYPE.THEORY,
        grade: GRADES.TENTH,
        thumbnailUrl: "string",
        createdAt: new Date(),
        updatedAt: new Date(),
        isHidden: false
        
    },
    {
        id: "9",
        title: "Tìm diện tích khối trụ bằng phương pháp căn bản như trên",
        courseDescription: "Description",
        price:170000,
        courseType: COURSE_TYPE.THEORY,
        grade: GRADES.TENTH,
        thumbnailUrl: "string",
        createdAt: new Date(),
        updatedAt: new Date(),
        isHidden: false
        
    },
    {
        id: "10",
        title: "Tìm diện tích khối trụ bằng phương pháp căn bản như trên",
        courseDescription: "Description",
        price:170000,
        courseType: COURSE_TYPE.EXAMINATION_SOLVING,
        grade: GRADES.TENTH,
        thumbnailUrl: "string",
        createdAt: new Date(),
        updatedAt: new Date(),
        isHidden: false
        
    },
    {
        id: "11",
        title: "Tìm diện tích khối trụ  bản như trên",
        courseDescription: "Description",
        price:170000,
        courseType: COURSE_TYPE.EXAMINATION_SOLVING,
        grade: GRADES.TWELFTH,
        thumbnailUrl: "string",
        createdAt: new Date(),
        updatedAt: new Date(),
        isHidden: false
        
    }
    
];
    private baseUrl:string= 'https://us-central1-supple-craft-318515.cloudfunctions.net/app/api';

    private httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: this.authService.getToken()
        })
      };


    constructor(private http : HttpClient, private authService: authenticationService){
        
    }

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

    //!DONE 
    getListCourseGrade(level_: GRADES, type_:COURSE_TYPE){

       
       return this.http
        .get<{message:string,count:number, courses: Course[]}>(
        this.baseUrl+ '/courses',
        {
            params:new HttpParams().set('grade', level_).set('courseType',type_).set('isHidden',false)
        })
        
    }


    //TODO: send request getting all course
    getListCourse():Observable<Course[]>{
        
        this.http
        .get<{message:string,count:number, courses: Course[]}>(
            this.baseUrl+'/courses'
        )
        
        const courses= this.courses;
        return of(courses);
        
    }

    //!DONE
    //* Get course by course id
    getCourseById(id : string){
        
       return this.http
        .get<{message:string,count:number, courses: Course[]}>(
            this.baseUrl+'/courses',
            {
              
                params:new HttpParams().set('id',id )
            }
        ).pipe(
            
            catchError(this.handleError)
        );
    }

    getCourses(){
        return this.courses;
    }

    //TODO: CHECK PARAM courseType
    getListCourseFilter(courseType: COURSE_TYPE ,grade: GRADES){
        // const courses= this.courses.filter(course =>course.grade===grade && course.courseType === courseType);
        // return of(courses);
         // return this.http
         return this.http
         .get<{message:string,count:number, courses: Course[]}>(
             'https://us-central1-supple-craft-318515.cloudfunctions.net/app/api/courses',
             {
                 params:new HttpParams().set('grade', grade).set('courseType',courseType)
             }
         ).subscribe(response=>
         {
             console.log(response.courses)
         })
          
     }

     getAllCourse(){
        
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'token');
       return this.http
        .get<{message:string,count:number, courses: Course[]}>(
            this.baseUrl+ '/courses',
            {
                headers: headers
            }
        ).pipe(
            catchError(this.handleError)
          );
     }


     //DONE!
    getListCourseByTitle(title: string){
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'token');
       return this.http
        .get<{message:string,count:number, courses: Course[]}>(
            this.baseUrl+ '/courses',
            {
                headers: headers,
                params:new HttpParams().set('title',title).set('isHidden',false)
            }
        ).pipe(
            catchError(this.handleError)
          );
    }

    //TODO: Get student join  in a course
    getstudentJoinedNumber(courseId:string){
        //get enrollment where courseId return list enrollment
        return this.http
        .get<{message:string,count:number,enrollments: Enrollment[]}>(this.baseUrl+'/enrollments', 
            {
                params: new HttpParams().set('courseId', courseId)
            }
        )
        .pipe(
            
            catchError(this.handleError)
        );
              
    }

    
    //TODO: get the number of lecture by courseId
    getLectureByCourseId(courseId: string){
        return this.http
        .get<{message:string,count:number,lectures: Lecture[]}>(this.baseUrl+'/courses/'+courseId+"/lectures" 
        )
        .pipe(
            
            catchError(this.handleError)
        );
    }

    //!DONE
    /**
     * REMOVE RETURN TYPE
     * @param courseId 
     * @returns 
     */
    getSectionByCourseId(courseId: string){
       

       return this.http
        .get<{message:string,count:number, sections: Section[]}>(
            this.baseUrl+ '/sections',
        {
            params: new HttpParams().set('courseId', courseId)
        })
        
       // return sectionList.filter(section=> section.courseId === courseId);
    }

    // use http open command when have API
    //TODO : get lecture list by section id
    getLecturesBySectionId(sectionId: string){
        
        return this.http
        .get<{message:string,count:number, lectures: Lecture[]}>(
            this.baseUrl+'/lectures',
        {
            params: new HttpParams().set('sectionId', sectionId)
        })
        .pipe(
            catchError(this.handleError)
        );
    }

    //TODO: get video of a lecture by its id
    getVideoByLectureId(lectureId: string){
        // Open command when have
        // return this.http
        // .get<Video>('URL',
        // {
        //     params: new HttpParams().set('lectureId', lectureId)
        // }).pipe(
        //     map((responseData)=>{ 
        //         return responseData;
        //     })
        // );
    }


    //TODO: send request get all course of learner in by id learner
    /**
     * Send request to enrollment, get enrollment by learnerId
     * @param learnerId 
     * @returns Observable<Course[]>
     */
    getMyCourses(learnerId: string){
        return this.http
        .get<{message:string,count:number, enrollments: Enrollment[]}>(this.baseUrl+ '/enrollments',
        {
            params: new HttpParams().set('learnerId', learnerId)
        })
   
    }

    //TODO:send request get list learner of a course and count
    /**
     * 
     * @param id
     * @returns total learner
     */
    getTotalLeanerOfCourse(id: string):number{
        var number = 0;
       this.getstudentJoinedNumber(id).subscribe(list => number = list.count);
       return number;
    }
}