import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
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
        
    }
    
];

    constructor(private http : HttpClient){
        
    }

    getListCourseGrade(level_: GRADES):Observable<Course[]>{
        const courses= this.courses.filter(course =>course.grade===level_);
        return of(courses);
    }

    getListCourse():Observable<Course[]>{
        const courses= this.courses;
        return of(courses);
    }

    getCourseById(id : string):Observable<Course>{
        const course = this.courses.find(course => course.id===id)!;
        return of(course);
    }

    getCourses(){
        return this.courses;
    }

    //TODO: CHECK PARAM courseType
    getListCourseFilter(courseType: string ,grade: string):Observable<Course[]>{
        const courses= this.courses.filter(course =>course.grade===grade && course.courseType === COURSE_TYPE.THEORY);
        return of(courses);
    }

    getListCourseByTitle(title: string):Observable<Course[]>{
        const courses = this.courses.filter(course => course.title === title);
        return of(courses);
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

    //TODO: get section of course by course id
    /**
     * REMOVE RETURN TYPE
     * @param courseId 
     * @returns 
     */
    getSectionByCourseId(courseId: string):Section[]{
       
       /*return this.http
        .get<Section[]>('URL',
        {
            params: new HttpParams().set('courseId', courseId)
        }).pipe(
            map((responseData)=>{ 
                return responseData;
            })
        );*/
        return sectionList.filter(section=> section.courseId === courseId);
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