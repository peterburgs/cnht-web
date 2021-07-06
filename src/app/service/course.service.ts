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

    

    constructor(private http : HttpClient){
        
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

        //*Create header
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'token');
       return this.http
        .get<{message:string,count:number, courses: Course[]}>(
            this.baseUrl+ '/courses',
            {
                headers: headers,
                params:new HttpParams().set('grade', level_).set('courseType',type_).set('isHidden',true)
            }
        ).pipe(
            catchError(this.handleError)
          );
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

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'token');
       return this.http
        .get<{message:string,count:number, courses: Course[]}>(
            this.baseUrl+'/courses',
            {
                headers: headers,
                params:new HttpParams().set('id',id )
            }
        ).pipe(
            
            catchError(this.handleError)
        );

       
        // const course = this.courses.find(course => course.id===id)!;
        // return of(course);
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
        .get<Enrollment[]>('url', 
            {
                params: new HttpParams().set('courseId', courseId)
            }
        )
        // .pipe(
        //     map((responseData) =>{
        //     const enrollments :Enrollment[]=[];
        //     for(let data in responseData)
        //      enrollments.push(data);
            
        //     return enrollments;
        // }));
       
    }

    //TODO: get the number of lecture by courseId
    getLectureByCourseId(courseId: string){
        return this.http
        .get<Lecture[]>('URL', 
            {
                params: new HttpParams().set('courseId', courseId)
            }
        )
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
        }).pipe(
            catchError(this.handleError)
        );
       // return sectionList.filter(section=> section.courseId === courseId);
    }

    // use http open command when have API
    //TODO : get lecture list by section id
    getLecturesBySectionId(sectionId: string):Lecture[]{
        
        /*return this.http
        .get<Lecture[]>('URL',
        {
            params: new HttpParams().set('sectionId', sectionId)
        }).pipe(
            map((responseData)=>{ 
                return responseData;
            })
        );*/

        //use mockup data- temperory
        console.log(lectureList)
        return lectureList.filter(lecture=>lecture.sectionId === sectionId )
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
    getMyCourses(learnerId: string):Observable<Course[]>{
        // return this.http
        // .get<Course[]>('URL',
        // {
        //     params: new HttpParams().set('learnerId', learnerId)
        // }).pipe(
        //     map((responseData)=>{ 
        //         return responseData;
        //     })
        // );
        //Mock data
        return of(this.courses);
   
    }

    //TODO:send request get list learner of a course and count
    /**
     * 
     * @param id
     * @returns total learner
     */
    getTotalLeanerOfCourse(id: string):number{
        return 10;
    }

    //TODO: get lecture by section
    getLectureBySectionId(sectionId:string){

    }
}