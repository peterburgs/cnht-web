import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { ReturnStatement } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Enrollment } from "../models/enrollment.model";
import { ROLES } from "../models/user-roles";
import { User } from "../models/user.model";
import { authenticationService } from "./authentication.service";

@Injectable({
    providedIn: 'root'
  })

export class UserService{

    
    private baseUrl:string= 'https://us-central1-supple-craft-318515.cloudfunctions.net/app/api';

    constructor(private http:HttpClient,
        private authService: authenticationService){}    

   
    private httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: this.authService.getToken()
        })
      };

    
    //TODO: EDIT THIS FUNCTION
    getUserInLocalStore(){
        let learner = new User;
        let email=localStorage.getItem('uemail');
        if(email!=null)
        {
            console.log(email)
            this.getAllUser().subscribe(dataResponse=>{
                let learner_= dataResponse.users.find((user)=> user.email===email);
                if(learner_)
                    learner= learner_;
          })
        }
        console.log(learner)
        return of(learner);
    }

    
    checkEnrollment(courseId: string, userId: string){
        //TODO: interact with database and check that user enrollment that course or not
        const token= localStorage.getItem('token')?localStorage.getItem('token'):"null";
        const tokenType= "Bearer "
        const header = new HttpHeaders().set('Authorization', tokenType + token);
        return this.http
        .get<{message:string,count:number, enrollments: Enrollment[]}>(
            this.baseUrl+'/enrollments',
            {
                headers: header,
                params:new HttpParams().set('courseId', courseId ).set('learnerId',userId)
            }
        )
    }



    getTotalCourses(userId: string):number{
        return 1;
    }


    getAllEnrollment(){
        
        const token= localStorage.getItem('token')?localStorage.getItem('token'):"null";
        const tokenType= "Bearer "
        const header = new HttpHeaders().set('Authorization', tokenType + token);
       return this.http
        .get<{message:string,count:number, enrollments: Enrollment[]}>(
            this.baseUrl+ '/enrollments', {headers: header})
    }


    getAllLearner(){
        //return this.users;
       return this.http
        .get<{message:string,count:number, users: User[]}>(
            this.baseUrl+ '/users', {
                headers: this.httpOptions.headers,
                params: new HttpParams().set('userRole', ROLES.LEARNER)
            })
    }

    getAllUser(){
        //return this.users;
        const token= localStorage.getItem('token')?localStorage.getItem('token'):"null";
        const tokenType= "Bearer "
        const header = new HttpHeaders().set('Authorization', tokenType + token);
        const headers = { headers: header};
       return this.http
        .get<{message:string,count:number, users: User[]}>(
            this.baseUrl+ '/users', headers)
    }


    updateUser(user: User){
        const body = {
           "email":  user.email,
            "userRole": user.userRole,
            "balance": user.balance,
            "createdAt":user.createdAt,
            "updateAt": user.updatedAt
        }

        return this.http.put<{message:string,count:number, user: User}>
            (this.baseUrl + "/users/" +user.id, body, {
                headers: this.httpOptions.headers,
               // params: new HttpParams().set('id', deposit.id)
             })
    }
   
    //Get user by email
    getUserByEmai(email:string){

        const token= localStorage.getItem('token')?localStorage.getItem('token'):"null";
        const tokenType= "Bearer "
        const header = new HttpHeaders().set('Authorization', tokenType + token);
        const headers = { headers: header ,params:new HttpParams().set('email', email)};
        return this.http
        .get<{message:string,count:number, users: User[]}>( this.baseUrl+'/users',headers)
        
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
    getUserById(learnerId:string){

        const token= localStorage.getItem('token')?localStorage.getItem('token'):"null";
        const tokenType= "Bearer "
        const header = new HttpHeaders().set('Authorization', tokenType + token);
        const headers = { headers: header ,params:new HttpParams().set('id', learnerId)};
        return this.http
        .get<{message:string,count:number, users: User[]}>( this.baseUrl+'/users',headers)
    }
}