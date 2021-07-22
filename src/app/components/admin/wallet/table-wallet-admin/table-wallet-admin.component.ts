import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/service/user.service';
import { ThemePalette } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DepositRequest } from 'src/app/models/deposit-request.model';
import { DepositRequestService } from 'src/app/service/deposit-request.service';
import { STATUSES } from 'src/app/models/statuses';
import { Router } from '@angular/router';
import { BalanceFormat } from 'src/app/util/balance-format';

const enum action {
  CONFIRMED,
  DENIED,
}

const enum SORT {
  CURRENT,
  INCREASE,
  DECREASE,
}

interface Status {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-table-wallet-admin',
  templateUrl: './table-wallet-admin.component.html',
  styleUrls: ['./table-wallet-admin.component.css'],
})
export class TableWalletAdminComponent implements OnInit {
  @Input() listSearch: DepositRequest[] = [];
  message_view_img: string = 'Deposit Request Information';
  path_img_view: string = '../../../../../assets/images/ck.jpg';
  isViewImg: boolean = false;
  @Input() isAdmin: boolean = true;
  isCallAlert = false;
  nameActionToAlert: string = '';
  messageToAction: string = '';
  isAcceptAction: boolean = false;
  depositCurrentRow: DepositRequest = new DepositRequest();
  colorSlideFilter: ThemePalette = 'primary';
  content_for_search: string = 'Find deposit by learner name or learner email';
  typeOfAction: action = action.CONFIRMED;
  newStatusDeposit: STATUSES = STATUSES.CONFIRM;
  @Input() getTitleSearch = new EventEmitter<string>();
  depositRequests: DepositRequest[] = [];
  @Input() admin: User = new User();
  isLoading: boolean = true;
  @Output() changeBalanceAdmin = new EventEmitter<number>();
  page = 1;
  pageSize = 10;
  selectedFitler = 'all';
  isLoadingAccept = false;
  constructor(
    public userService: UserService,
    private _snackBar: MatSnackBar,
    public depositRequestService: DepositRequestService,
    private router: Router
  ) {}

  listStatus: Status[] = [
    { value: 'all', viewValue: 'All' },
    { value: STATUSES.CONFIRM, viewValue: 'Confirmed' },
    { value: STATUSES.DENIED, viewValue: 'Denied' },
    { value: STATUSES.PENDING, viewValue: 'Pending' },
  ];

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.getAllList();
    this.getAllListLearner();
  }

  getListDepositRequestByFitler() {
    if (this.selectedFitler.toString() == 'all') {
      this.listSearch = this.depositRequests;
    } else
      this.listSearch = this.depositRequests.filter(
        (deposit) =>
          deposit.depositRequestStatus.toString() == this.selectedFitler
      );
  }
  eSortDate: SORT = SORT.CURRENT;
  isSortDateUp: boolean = false;
  isSortDateDown: boolean = false;
  sortDate() {
    this.isSortDateUp = false;
    this.isSortDateDown = false;
    this.isSortAmountUp = false;
    this.isSortAmountDown = false;
    this.eSortAmount = SORT.CURRENT;
    this.eSortDate = this.eSortDate + this.updateSort(this.eSortDate);

    if (this.eSortDate == SORT.CURRENT) {
      this.getAllList();
    } else if (this.eSortDate == SORT.DECREASE) {
      this.isSortDateDown = true;
      this.listSearch = this.listSearch.sort((a, b) => {
        return <any>new Date(b.createdAt) - <any>new Date(a.createdAt);
      });
    } else {
      this.isSortDateUp = true;
      this.listSearch = this.listSearch.sort((a, b) => {
        return <any>new Date(a.createdAt) - <any>new Date(b.createdAt);
      });
    }
  }

  eSortAmount: SORT = SORT.CURRENT;
  isSortAmountUp: boolean = false;
  isSortAmountDown: boolean = false;
  sortAmount() {
    this.eSortDate = SORT.CURRENT;
    this.eSortAmount = this.eSortAmount + this.updateSort(this.eSortAmount);
    this.isSortAmountUp = false;
    this.isSortAmountDown = false;
    this.isSortDateUp = false;
    this.isSortDateDown = false;
    if (this.eSortAmount == SORT.CURRENT) {
      this.getAllList();
    } else if (this.eSortAmount == SORT.INCREASE) {
      this.isSortAmountUp = true;
      this.listSearch = this.listSearch.sort(function (deposit1, deposit2) {
        return deposit1.amount - deposit2.amount;
      });
    } else {
      this.isSortAmountDown = true;
      this.listSearch = this.listSearch.sort(function (deposit1, deposit2) {
        return deposit2.amount - deposit1.amount;
      });
    }
  }
  updateSort(sort: SORT) {
    if (sort == SORT.CURRENT || sort == SORT.INCREASE) return 1;
    else return -2;
  }
  isDeny(status: STATUSES) {
    if (status == STATUSES.DENIED) return true;
    return false;
  }
  listTemp: DepositRequest[] = [];
  getAllList() {
    this.depositRequestService.getAll().subscribe((depositRequest) => {
      if (depositRequest.count != 0) {
        (this.depositRequests = depositRequest.depositRequests),
          (this.listSearch = this.depositRequests),
          (this.listTemp = this.depositRequests);
      } else this.depositRequests = [];
    });
  }
  listLearner: User[] = [];
  getAllListLearner() {
    this.userService.getAllLearner().subscribe((users) => {
      if (users.count != 0) {
        (this.listLearner = users.users), (this.isLoading = false);
      }
    });
  }
  getLearnerByIdLearner(learnerId: string): User {
    for (let learner of this.listLearner)
      if (learner.id == learnerId) return learner;
    return new User();
  }
  searchDeposit($event: any) {
    if ($event == '') this.getAllList();
    else this.getDepositsByNameOrEmailLearner($event);
  }
  getDepositsByNameOrEmailLearner($event: string) {
    this.listSearch = this.depositRequests.filter(
      (learner) =>
        this.getLearnerByIdLearner(learner.learnerId)
          .fullName.toLowerCase()
          .includes($event.toLowerCase()) ||
        this.getLearnerByIdLearner(learner.learnerId)
          .email.toLowerCase()
          .includes($event.toLowerCase())
    );
  }
  getAcceptFromAlert($event: any) {
    this.isAcceptAction = $event;
    if (this.isAcceptAction) this.updateStatusDeposit();
  }

  titleAlert: string = '';
  setActionConfirm() {
    this.titleAlert = 'Confirm deposit request';
    this.setMessageToAlert(
      'Are you sure to comfirm this deposit request !',
      'Confirm'
    );
    this.newStatusDeposit = STATUSES.CONFIRM;
  }
  setActionDeny() {
    this.titleAlert = 'Deny deposit request';
    this.setMessageToAlert(
      'Are you sure to deny this deposit request !',
      'Deny'
    );
    this.newStatusDeposit = STATUSES.DENIED;
  }

  updateStatusDeposit() {
    this.isLoadingAccept = true;
    this.depositRequestService
      .updateStatus(this.depositCurrentRow, this.newStatusDeposit)
      .subscribe((any) => {
        this.getAllList();
        this.isLoadingAccept = false;
        this.openSnackBar('Deposit was updated !', 'OK');
        if (this.newStatusDeposit == STATUSES.CONFIRM) {
          var user = this.getLearnerByIdLearner(
            this.depositCurrentRow.learnerId
          );
          user.balance = user.balance + this.depositCurrentRow.amount;
          this.admin.balance =
            this.admin.balance + this.depositCurrentRow.amount;
          this.userService.updateUser(user).subscribe();
          this.userService.updateUser(this.admin).subscribe((any) => {
            this.changeBalanceAdmin.emit(this.admin.balance);
          });
        }
      });
  }

  getDepositCurrentRow(item: DepositRequest) {
    this.depositCurrentRow = item;
  }

  setMessageToAlert(message: string, nameAction: string) {
    this.messageToAction = message;
    this.nameActionToAlert = nameAction;
    this.isCallAlert = true;
  }

  reloadPage() {
    window.location.reload();
  }

  isShowImg() {
    return this.isViewImg;
  }

  onHandleError() {
    this.isCallAlert = false;
    this.isViewImg = false;
  }

  showImg() {
    this.isViewImg = true;
  }

  refreshComponent() {
    this.router.navigate([this.router.url]);
  }

  balanceFormat(price: number) {
    return BalanceFormat(price);
  }
}
