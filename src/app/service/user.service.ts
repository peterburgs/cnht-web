import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Enrollment } from "../models/enrollment.model";
import { ROLES } from "../models/user-roles";
import { User } from "../models/user.model";

@Injectable({
    providedIn: 'root'
  })

export class UserService{

    private users: User[] = [{
        id : "user01",
        fullName  : "Le Thi Ngoc Yen",
        avatarUrl: "",
        email : "ngocyen174308@gmail.com",
        userRole :  ROLES.LEARNER,
        balance : 200000,
        createdAt :new Date(),
        updatedAt : new Date()
    },

    {
        id : "user02",
        fullName  : "Nguyen Thi Minh Hoang",
        avatarUrl: "",
        email : "hoangnguyen@gmail.com",
        userRole :  ROLES.LEARNER,
        balance : 20000,
        createdAt : new Date(),
        updatedAt : new Date(),
    },

    {
        id : "user03",
        fullName  : "Le Thi Phuong Thao",
        avatarUrl: "",
        email : "thaole@gmail.com",
        userRole :  ROLES.LEARNER,
        balance : 20000,
        createdAt : new Date(),
        updatedAt : new Date(),
    },
    {
        id : "user04",
        fullName  : "Nguyen Thi Minh Hoang",
        avatarUrl: "",
        email : "nguyenhoang13166@gmail.com",
        userRole :  ROLES.LEARNER,
        balance : 200000,
        createdAt : new Date(),
        updatedAt : new Date(),

    }
];
    private baseUrl:string= 'https://us-central1-supple-craft-318515.cloudfunctions.net/app/api';

    constructor(private http:HttpClient){}    

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
    
    getUserInLocalStore():User{
        let learner = new User;
        let email=localStorage.getItem('uemail')?localStorage.getItem('uemail'):"null";
        if(email!=null)
        {
            console.log(email)
            this.getUserByEmail(email).subscribe(dataResponse=>{
             learner= dataResponse.users[0];
          })
        }
        console.log(learner)
        return learner;
    }

    //if learner bought that course, return true
    checkCourseBought(courseId: string, userId: string){
        //TODO: interact with database and check that user bought that course or not
        return this.http
        .get<{message:string,count:number, enrollments: Enrollment[]}>(
            this.baseUrl+'/enrollments',
            {

                params:new HttpParams().set('courseId', courseId ).set('learnerId',userId)
            }
        )
    }

    getTotalCourses(userId: string):number{
        return 1;
    }

    getAllUser(){
        return this.users;
    }
    
    getListUserByTitle(title: string):Observable<User[]>{
        const users = this.users.filter(user => user.fullName == title || user.email == title);
        return of(users);
        
    }

    //Get user by email
    getUserByEmail(email:string){

        const token= localStorage.getItem('token')?localStorage.getItem('token'):"null";
        const tokenType= "Bearer "
        const header = new HttpHeaders().set('Authorization', tokenType + token);
        const headers = { headers: header ,params:new HttpParams().set('email', email)};
        return this.http
        .get<{message:string,count:number, users: User[]}>( this.baseUrl+'/users',headers)
        // .pipe(
        //     catchError(this.handleError)
        // );
    }
    

    buyCourse(learnerId :string, courseId: string){
        //create a enrollment
        const enrollment: Enrollment={
            id:"",
            courseId:courseId,
            learnerId: learnerId,
            createdAt: new Date(),
            updatedAt:new Date()
        }

        //get token
        const token= localStorage.getItem('token')?localStorage.getItem('token'):"null";
        const config = { 
        headers: new HttpHeaders().set('Authorization','Bearer '+ token) 
        };

        return  this.http
        .post<{message:string,count:number, enrollment: Enrollment}>( this.baseUrl+'/enrollments',enrollment,config)
    
        //update balance of use

    }

    //TODO:SEND GET METHOD TO GET USER BY USER ID
    getUserById(learnerId:string):Observable<User>{
        return of(this.users.find(user=> user.id===learnerId)!);
    }

    
    getUserByUserId(id:string): User{
        const user = this.users.find(user=>user.id == id)!;
        return user;
    }
}