import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DepositRequest } from 'src/app/models/deposit-request.model';
import { User } from 'src/app/models/user.model';
import { authenticationService } from 'src/app/service/authentication.service';
import { DepositRequestService } from 'src/app/service/deposit-request.service';
import { UserService } from 'src/app/service/user.service';
import { BalanceFormat } from 'src/app/util/balance-format';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  balance_admin: number = 0;
  isAdmin: boolean = false;
  admin: User = new User();
  content_for_search: string = "Find deposit by learner name or learner email";
  //title
  constructor(
    private authService: authenticationService,
    private userService: UserService,
    private router: Router,
    public depositRequestService: DepositRequestService
  ) { }

  ngOnInit(): void {

    if(this.authService.isAdmin())
   
        this.isAdmin = true;
        this.getAllList();
        this.getAllListLearner();
        if(localStorage.getItem('isLoggedin')=='true'){
          let email=localStorage.getItem('uemail')?localStorage.getItem('uemail'):"null";
            if(email!=null)
            {
              this.userService.getAllUser().subscribe(dataUser=>{
                let learner_= dataUser.users.find((user)=> user.email===email);
                if(learner_){
                  this.balance_admin= learner_.balance;
                  this.admin = learner_;
                }
                
              })
            }
        }

  }

  depositRequests: DepositRequest[] = [];
  //TODO: get all list deposit requests
  getAllList(){
    this.depositRequestService.getAll().subscribe(depositRequest =>
      {
        if(depositRequest.count != 0)
        {
          this.depositRequests = depositRequest.depositRequests;
          this.listSearch = this.depositRequests
        
        } else this.listSearch = [];
       
      } );
  }

  listLearner :User[] = [];
  //TODO: get all list learner to get full name and email for table 
  getAllListLearner(){
    this.userService.getAllLearner().subscribe(
      users => {
        if(users.count != 0){
          this.listLearner = users.users
        }
      }
    )
  }


 //TODO: get learner by learner id
  getLearnerByIdLearner(learnerId: string): User{
   for(let learner of this.listLearner)
      if (learner.id == learnerId)
          return learner;
    return new User();
  }


  listSearch: DepositRequest[]= [];

  balanceFormat(balance : number){
    return BalanceFormat(balance);
  }
  
  updateBalanceAdmin($event :any){
    this.balance_admin = $event;
    window.scrollTo(0, 0);
  }

  refreshComponent(){
    this.router.navigate([this.router.url])
 }

  //TODO: search deposit request by title search
  searchDeposit($event: any){
    if($event == "")
      this.getAllList();
    else this.getDepositsByNameOrEmailLearner($event);
}

    //TODO: filter deposit request by name or email learner
  getDepositsByNameOrEmailLearner($event: string){
    this.listSearch = this.depositRequests.filter(
      learner => this.getLearnerByIdLearner(learner.learnerId).fullName.toLowerCase().includes($event.toLowerCase()) 
      || this.getLearnerByIdLearner(learner.learnerId).email.toLowerCase().includes($event.toLowerCase())
    )
  }


}
