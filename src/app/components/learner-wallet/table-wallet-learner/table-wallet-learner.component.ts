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

@Component({
  selector: 'app-table-wallet-learner',
  templateUrl: './table-wallet-learner.component.html',
  styleUrls: ['./table-wallet-learner.component.css']
})
export class TableWalletLearnerComponent implements OnInit {

  message_view_img: string = "Show image deposit !";
  path_img_view:string = "../../../../../assets/images/ck.jpg";
  isViewImg:boolean = false;
  depositHistory: DepositRequest[]=[];
  learner!: User;
  pendding= STATUSES.PENDING;
  confirm= STATUSES.CONFIRM;
  deny = STATUSES.DENIED
  isLoading=true;
  selected_deposit!: DepositRequest;
  constructor(
    private userService: UserService,
    private depositRequestService: DepositRequestService
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('isLoggedin')=='true')
    {
      let email=localStorage.getItem('uemail');
      if(email!=null)
        this.userService.getUserByEmail(email).subscribe(responseData=>{
          this.learner= responseData.users[0];
          this.getDepositHistory();
        });
      }
      
  }
    

  isShowImg(){
    return this.isViewImg;
  }

  onHandleError(){
    this.isViewImg = false;
  }

  showImg(deposit: DepositRequest){
    this.isViewImg = true;
    this.selected_deposit=deposit;
  }

  getDepositHistory(){
    console.log("Click")
     this.depositRequestService.getByIdLearner(this.learner.id)
     .pipe(
      catchError((error)=>{
          console.log(error)
          if(error.error.count==0)
            this.isLoading= false;         
          return throwError(error)       
      })
    )
    .subscribe(responseData=>{
      this.depositHistory=responseData.depositRequests;
      this.isLoading= false;
    })
  }

  dateFormater(date: Date):string{
    return moment(date).format('MMMM Do YYYY, h:mm:ss a').toString();
  }

  priceFormat(price: number):any{
    return PriceFormat(price,0,3,'.',',')
  }

}
