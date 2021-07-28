import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { DepositRequest } from '../models/deposit-request.model';
import { STATUSES } from '../models/statuses';
import { User } from '../models/user.model';
import { authenticationService } from './authentication.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class DepositRequestService {
  private depositRequests: DepositRequest[] = [];

  private baseUrl: string =
    'https://us-central1-supple-craft-318515.cloudfunctions.net/app/api';
  private userList?: User[];
  private depositRequestList: DepositRequest[] = [];
  constructor(
    private userService: UserService,
    private http: HttpClient,
    private authService: authenticationService
  ) {}

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.authService.getToken(),
    }),
  };

  getAll() {
    return this.http.get<{
      message: string;
      count: number;
      depositRequests: DepositRequest[];
    }>(this.baseUrl + '/deposit-requests', {
      headers: this.httpOptions.headers,
    });
  }

  getByIdLearner(learnerId: string) {
    return this.http.get<{
      message: string;
      count: number;
      depositRequests: DepositRequest[];
    }>(this.baseUrl + '/deposit-requests', {
      params: new HttpParams().set('learnerId', learnerId),
      headers: this.httpOptions.headers,
    });
  }

  getByLearner(learner: User): Observable<DepositRequest[]> {
    const depositRequests = this.depositRequests.filter(
      (depositRequest) => depositRequest.learnerId == learner.id
    );
    return of(depositRequests);
  }

  setStatusName(deposit: DepositRequest): string {
    if (
      deposit.depositRequestStatus == STATUSES.CONFIRM ||
      deposit.depositRequestStatus == STATUSES.DENIED
    )
      return deposit.depositRequestStatus + ' ' + deposit.updatedAt;
    return deposit.depositRequestStatus;
  }

  isPending(deposit: DepositRequest): boolean {
    if (deposit.depositRequestStatus == STATUSES.PENDING) return true;
    return false;
  }

  updateStatus(deposit: DepositRequest, status: STATUSES) {
    const body = {
      id: deposit.id,
      learnerId: deposit.learnerId,
      amount: deposit.amount,
      imageUrl: deposit.imageUrl,
      depositRequestStatus: status,
      createdAt: deposit.createdAt,
      updatedAt: deposit.updatedAt,
    };
    return this.http.put<any>(
      this.baseUrl + '/deposit-requests/' + deposit.id,
      body,
      {
        headers: this.httpOptions.headers,
      }
    );
  }

  createDepositRequest(deposit: DepositRequest) {
    const token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : 'null';
    const config = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    return this.http.post<{
      message: string;
      count: number;
      depositRequest: DepositRequest;
    }>(this.baseUrl + '/deposit-requests', deposit, config);
  }

  uploadDepositImage(file: File, depositRequestId: string) {
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
            reject();
          }
        };

        xhr.onerror = reject;

        xhr.send(chunk);
      });
    };

    const sendNext = () => {
      if (!chunksQueue.length) {
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
          }

          sendNext();
        })
        .catch(() => {
          chunksQueue.push(chunkId!);
          alert('System error. Please try again!');
        });
    };

    sendNext();
  }
}
