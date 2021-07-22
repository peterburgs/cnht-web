import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DepositRequest } from 'src/app/models/deposit-request.model';
import { STATUSES } from 'src/app/models/statuses';
import { User } from 'src/app/models/user.model';
import { DepositRequestService } from 'src/app/service/deposit-request.service';
import { UserService } from 'src/app/service/user.service';
import { PriceFormat } from 'src/app/util/priceformat';

const enum SORT {
  CURRENT,
  INCREASE,
  DECREASE,
}
@Component({
  selector: 'app-table-wallet-learner',
  templateUrl: './table-wallet-learner.component.html',
  styleUrls: ['./table-wallet-learner.component.css'],
})
export class TableWalletLearnerComponent implements OnInit {
  message_view_img: string = 'Deposit Request Information';
  path_img_view: string = '../../../../../assets/images/ck.jpg';
  isViewImg: boolean = false;
  depositHistory: DepositRequest[] = [];
  learner!: User;
  pendding = STATUSES.PENDING;
  confirm = STATUSES.CONFIRM;
  deny = STATUSES.DENIED;
  isLoading = true;
  selected_deposit!: DepositRequest;
  constructor(
    private userService: UserService,
    private depositRequestService: DepositRequestService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('isLoggedin') == 'true') {
      let email = localStorage.getItem('uemail');
      if (email != null)
        this.userService.getAllUser().subscribe((responseData) => {
          let learner_ = responseData.users.find(
            (user) => user.email === email
          );
          if (learner_) this.learner = learner_;
          this.getDepositHistory();
        });
    }
  }

  isShowImg() {
    return this.isViewImg;
  }

  onHandleError() {
    this.isViewImg = false;
  }

  showImg(deposit: DepositRequest) {
    this.isViewImg = true;
    this.selected_deposit = deposit;
  }

  getDepositHistory() {
    this.isSortDateUp = false;
    this.isSortDateDown = false;
    this.eSortDate = SORT.CURRENT;
    this.depositRequestService
      .getByIdLearner(this.learner.id)
      .pipe(
        catchError((error) => {
          if (error.error.count == 0) this.isLoading = false;
          return throwError(error);
        })
      )
      .toPromise()
      .then((responseData) => {
        this.depositHistory = responseData.depositRequests.sort((a, b) => {
          return <any>new Date(b.createdAt) - <any>new Date(a.createdAt);
        });

        this.isLoading = false;
      });
  }

  dateFormater(date: Date): string {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a').toString();
  }

  priceFormat(price: number): any {
    return PriceFormat(price, 0, 3, '.', ',');
  }

  eSortDate: SORT = SORT.CURRENT;
  isSortDateUp: boolean = false;
  isSortDateDown: boolean = false;
  sortDate() {
    this.isSortDateUp = false;
    this.isSortDateDown = false;
    this.eSortDate = this.eSortDate + this.updateSort(this.eSortDate);

    if (this.eSortDate == SORT.CURRENT) {
      this.getDepositHistory();
    } else if (this.eSortDate == SORT.DECREASE) {
      this.isSortDateDown = true;
      this.depositHistory = this.depositHistory.sort((a, b) => {
        return <any>new Date(b.createdAt) - <any>new Date(a.createdAt);
      });
    } else {
      this.isSortDateUp = true;
      this.depositHistory = this.depositHistory.sort((a, b) => {
        return <any>new Date(a.createdAt) - <any>new Date(b.createdAt);
      });
    }
  }

  updateSort(sort: SORT) {
    if (sort == SORT.CURRENT || sort == SORT.INCREASE) return 1;
    else return -2;
  }
}
