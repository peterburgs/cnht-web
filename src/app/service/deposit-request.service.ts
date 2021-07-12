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

    getByIdLearner(learnerId : string){
        return this.http
        .get<{message:string,count:number, depositRequests: DepositRequest[]}>(
            this.baseUrl+ '/deposit-requests',
            {
                params: new HttpParams().set('learnerId',learnerId),
                headers: this.httpOptions.headers
            }
        )
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
        const  body = {
            "id": deposit.id,
            "learnerId": deposit.learnerId,
            "amount": deposit.amount,
            "imageUrl": deposit.imageUrl,
            "depositRequestStatus": status,
            "createdAt":deposit.createdAt,
            "updatedAt": deposit.updatedAt
        };
        return this.http.put<(any)>( this.baseUrl+ '/deposit-requests/' + deposit.id, body, {
            headers: this.httpOptions.headers,
         }).pipe(
            catchError(this.handleError)
          );
    }

    createDepositRequest(deposit:DepositRequest){
        
        const token= localStorage.getItem('token')?localStorage.getItem('token'):"null";
        const config = { 
            headers: new HttpHeaders().set('Authorization','Bearer '+ token) ,
        };
        return this.http
        .post<{message:string, count:number, depositRequest:DepositRequest }>
        ( this.baseUrl+'/deposit-requests',deposit,config)
        
    }


    uploadDepositImage(file: File, depositRequestId: string) {
            
        console.log('Upload Thumbnail');
        console.log(file);
       
        const fileId = new Date().getTime().toString();
        const chunkSize = 5 * 1024 * 1024;
        const chunksQuantity = Math.ceil(file.size / chunkSize);
        const chunksQueue = [...Array(chunksQuantity)]
          .map((_, index) => index)
          .reverse();
    
        const upload = (chunk: Blob, chunkId: number) => {
          return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(
              'post',
              `${this.baseUrl}/deposit-requests/${depositRequestId}/upload`
            );
    
            xhr.setRequestHeader('Content-Type', 'application/octet-stream');
            xhr.setRequestHeader('X-Chunk-Id', String(chunkId));
            xhr.setRequestHeader('X-Content-Id', fileId);
            xhr.setRequestHeader('X-Chunk-Length', String(chunk.size));
            xhr.setRequestHeader('X-Content-Length', String(file.size));
            xhr.setRequestHeader('X-Content-Name', file.name);
            xhr.setRequestHeader('X-Chunks-Quantity', String(chunksQuantity));
    
            // Set token to request header
            xhr.setRequestHeader(
              'Authorization',
              `Bearer ` + localStorage.getItem('token')
            );
    
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4 && xhr.status === 200) {
                resolve({ status: 200, data: JSON.parse(this.responseText) });
              }
              if (xhr.readyState === 4 && xhr.status === 201) {
                resolve({ status: 201, data: JSON.parse(this.responseText) });
              }

              if (xhr.readyState === 4 && xhr.status === 500) {
                console.log(JSON.parse(this.responseText))
              }
            };
    
            xhr.onerror = reject;
    
            xhr.send(chunk);
          });
        };
    
        const sendNext = () => {
          if (!chunksQueue.length) {
            console.log('All parts uploaded');
    
            return;
          }
          const chunkId = chunksQueue.pop();
          const begin = chunkId! * chunkSize;
          const chunk = file.slice(begin, begin + chunkSize);
    
          upload(chunk, chunkId!)
            .then((res) => {
              const castedData = res as {
                status: number;
                data: { [index: string]: string };
              };
              if (castedData.status === 201) {
                console.log(castedData.data);
                console.log('***', 'Upload successfully');
              }
              
    
              sendNext();
            })
            .catch(() => {
              chunksQueue.push(chunkId!);
            });
        };
    
        sendNext();
    }

}