import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { DepositRequest } from "../models/deposit-request.model";
import { STATUSES } from "../models/statuses";
import { User } from "../models/user.model";
import { authenticationService } from "./authentication.service";
import { UserService } from "./user.service";
import { catchError, map } from "rxjs/operators";
import * as moment from "moment";

@Injectable({
    providedIn: 'root'
  })

export class DepositRequestService{

    private depositRequests: DepositRequest[] = [{
        id: "01",
        learnerId: "user04",
        amount: 10000,
        imageUrl: "../../assets/images/img1.jpg",
        depositRequestStatus: STATUSES.PENDING,
        createdAt: new Date(),
        updatedAt: new Date()
    },

    {
        id: "02",
        learnerId: "user04",
        amount: 10000,
        imageUrl: "../../assets/images/wellet.png",
        depositRequestStatus: STATUSES.CONFIRM,
        createdAt: new Date(),
        updatedAt: new Date()
    },

    {
        id: "03",
        learnerId: "user04",
        amount: 10000,
        imageUrl: "../../assets/images/wellet1.png",
        depositRequestStatus: STATUSES.PENDING,
        createdAt: new Date(),
        updatedAt: new Date()
    },


    {
        id: "03",
        learnerId: "user01",
        amount: 10000,
        imageUrl: "",
        depositRequestStatus: STATUSES.CONFIRM,
        createdAt: new Date(),
        updatedAt: new Date()
    },

    {
        id: "04",
        learnerId: "user01",
        amount: 10000,
        imageUrl: "",
        depositRequestStatus: STATUSES.DENIED,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "05",
        learnerId: "user03",
        amount: 10000,
        imageUrl: "",
        depositRequestStatus: STATUSES.CONFIRM,
        createdAt: new Date(),
        updatedAt: new Date()
    },


    {
        id: "06",
        learnerId: "user02",
        amount: 10000,
        imageUrl: "",
        depositRequestStatus: STATUSES.CONFIRM,
        createdAt: new Date(),
        updatedAt: new Date()
    },


    {
        id: "07",
        learnerId: "user01",
        amount: 10000,
        imageUrl: "",
        depositRequestStatus: STATUSES.PENDING,
        createdAt: new Date(),
        updatedAt: new Date()
    },

    {
        id: "08",
        learnerId: "user03",
        amount: 10000,
        imageUrl: "",
        depositRequestStatus: STATUSES.CONFIRM,
        createdAt: new Date(),
        updatedAt: new Date()
    }
]

private baseUrl:string= 'https://us-central1-supple-craft-318515.cloudfunctions.net/app/api';
private userList?:User[];
private depositRequestList: DepositRequest[] = [];
    constructor(
        private userService: UserService,
        private http: HttpClient,
        private authService : authenticationService
    ){}

    private httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: this.authService.getToken()
        })
      };

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
    
    //DONE 
    getAll(){
        
       return this.http
        .get<{message:string,count:number, depositRequests: DepositRequest[]}>(
            this.baseUrl+ '/deposit-requests',
            {
                headers: this.httpOptions.headers
            }
        ).pipe(
            // catchError(this.handleError)
          );
    }

    getAllNotYetConfirm():Observable<DepositRequest[]>{
        const depositRequests = this.depositRequests.filter(depositRequest => depositRequest.depositRequestStatus == STATUSES.PENDING);
        return of (depositRequests);
}

    getByIdLearner(learnerId : string): Observable<DepositRequest[]>{
        const depositRequests = this.depositRequests.filter(depositRequest => depositRequest.learnerId == learnerId);
        return of (depositRequests);
    }

    getByLearner(learner: User): Observable<DepositRequest[]>{
        const depositRequests = this.depositRequests.filter(depositRequest => depositRequest.learnerId == learner.id);
        return of (depositRequests);
    }

    setStatusName(deposit: DepositRequest): string{
        if(deposit.depositRequestStatus == STATUSES.CONFIRM || deposit.depositRequestStatus == STATUSES.DENIED)
            return deposit.depositRequestStatus + " " + deposit.updatedAt;
        return deposit.depositRequestStatus;
    }

    isPending(deposit: DepositRequest):boolean{
        if(deposit.depositRequestStatus == STATUSES.PENDING)
            return true;
        return false;
    }

    updateStatus(deposit: DepositRequest, status: STATUSES){
        // update status
        //deposit.depositRequestStatus = status;
        const  body = {
            "id": deposit.id,
            "learnerId": deposit.learnerId,
            "amount": deposit.amount,
            "imageUrl": deposit.imageUrl,
            "depositRequestStatus": status,
            "createdAt":deposit.createdAt,
            "updatedAt": deposit.updatedAt
        };
        // deposit.depositRequestStatus = status;
        // deposit.updatedAt = new Date();
        //this.httpOptions.headers = this.httpOptions.headers.set('id', deposit.id);
        return this.http.put<(any)>( this.baseUrl+ '/deposit-requests/' + deposit.id, body, {
            headers: this.httpOptions.headers,
           // params: new HttpParams().set('id', deposit.id)
         }).pipe(
            catchError(this.handleError)
          );
          
         console.log("updade !");
        // add wallet to wallet learner
        // return true;
    }

    updateStatusForAllNotConfirm(){
        //get All list not yet confirm
        // foreach list
        // update each deposit
    }

    getDepositsByNameOrEmailLearner(content: string): Observable<DepositRequest[]>{
       
      
         this.userList = [];
         this.depositRequestList= [];
        //depositRequestList
     //  this.userService.getListUserByTitle(content).subscribe(user => this.userList = user);
        for(let user of this.userList){
            console.log(user.fullName);
          const depositRequestList = this.depositRequests.filter(deposit => deposit.learnerId == user.id); 
          if(depositRequestList.length > 0)
                depositRequestList.forEach(deposit => this.depositRequestList.push(deposit));
            console.log(depositRequestList.length);
            console.log("list: " + this.depositRequestList.length);
        }
        return of(this.depositRequestList);
        
    }
}