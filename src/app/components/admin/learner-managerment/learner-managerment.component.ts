import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ROLES } from 'src/app/models/user-roles';
import { User } from 'src/app/models/user.model';
import { authenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';
import { BalanceFormat } from 'src/app/util/balance-format';

@Component({
  selector: 'app-learner-managerment',
  templateUrl: './learner-managerment.component.html',
  styleUrls: ['./learner-managerment.component.css'],
})
export class LearnerManagermentComponent implements OnInit {
  titleSearch: string = '';
  listUsers: User[] = [];
  APPROVE: string = 'error';
  isChange = false;
  isAdmin: boolean = false;
  isLoading: boolean = true;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: authenticationService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      this.isAdmin = true;
      this.getAllUser();
    }
  }

  getListUser() {
    this.userService.getAllLearner().subscribe((users) => {
      this.isLoading = false;
      if (users.count != 0) {
        this.listUsers = users.users.filter(
          (user) => user.userRole == ROLES.LEARNER
        );
        this.listSearch = this.listUsers;
      } else this.listUsers = [];
    });
  }

  balanceFormat(balance: number) {
    return BalanceFormat(balance);
  }

  searchUser() {
    if (this.titleSearch == '') this.getAllUser();
    else {
      this.getListUserByTitle(this.titleSearch);
    }
  }

  listSearch: User[] = [];
  getListUserByTitle(title: string) {
    this.listSearch = this.listUsers.filter(
      (user) =>
        user.email.toLowerCase().includes(title.toLowerCase()) ||
        user.fullName.toLowerCase().includes(title.toLowerCase())
    );
  }

  getAllUser() {
    this.onLoadRouterDefault();
    this.getListUser();
  }

  isPaging() {
    return true;
  }

  isChooseChange() {
    this.isChange = true;
  }

  show() {
    return this.isChange;
  }

  onHandleError() {
    this.isChange = false;
  }

  onLoadRouter() {
    this.router.navigate(['admin/management/learner'], {
      queryParams: { searchUser: this.titleSearch },
      fragment: 'adminSearch',
    });
  }

  onLoadRouterDefault() {
    this.router.navigate(['admin/management/learner']);
  }
}
