import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DepositRequest } from 'src/app/models/deposit-request.model';
import { STATUSES } from 'src/app/models/statuses';
import { User } from 'src/app/models/user.model';
import { DepositRequestService } from 'src/app/service/deposit-request.service';
import { UserService } from 'src/app/service/user.service';

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

  constructor(
    private userService: UserService,
    private depositRequestService: DepositRequestService
  ) { }

  ngOnInit(): void {
    this.userService.getUserByEmail(this.userService.getUserInLocalStore().email)
    .subscribe(dataUser=>this.learner= dataUser.users[0]);
   // console.log(this.learner);
    this.getDepositHistory();
  }

  isShowImg(){
    return this.isViewImg;
  }

  onHandleError(){
    this.isViewImg = false;
  }

  showImg(imageUrl: string){
    this.isViewImg = true;
    this.path_img_view= imageUrl;
  }

  getDepositHistory(){
     this.depositRequestService.getByIdLearner(this.learner.id)
     .subscribe(depositRequest=>{
        this.depositHistory=depositRequest;
      })
  }

  dateFormater(date: Date):string{
    return moment(date).format('MMMM Do YYYY, h:mm:ss a').toString();
  }

}
