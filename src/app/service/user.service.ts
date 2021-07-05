import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
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
    
    getUserInLocalStore():User{
        let learner = new User;
        let email=localStorage.getItem('uemail')?localStorage.getItem('uemail'):"null";
        if(email!=null)
        {
            console.log(email)
            this.getUserByEmail(email).subscribe(user=>{
            learner= user;
          })
        }
        console.log(learner)
        return learner;
    }

    checkCourseBought(courseId: string, userId: string):boolean{
        //TODO: interact with database and check that user bought that course or not

        return true;
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

    getUserByEmail(email:string): Observable<User>{
        const user = this.users.find(user=>user.email === email)!;
        return of(user);
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