import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/service/user.service';
import { PriceFormat } from 'src/app/util/priceformat';
import {ThemePalette} from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DepositRequest } from 'src/app/models/deposit-request.model';
import { DepositRequestService } from 'src/app/service/deposit-request.service';
import { STATUSES } from 'src/app/models/statuses';
import { Router } from '@angular/router';
import { Observable, of, throwError } from "rxjs";

const enum action {
  CONFIRMED,
  DENIED
}

const enum SORT{
  CURRENT,
  INCREASE,
  DECREASE
 
}

@Component({
  selector: 'app-table-wallet-admin',
  templateUrl: './table-wallet-admin.component.html',
  styleUrls: ['./table-wallet-admin.component.css']
})
export class TableWalletAdminComponent implements OnInit {

  message_view_img: string = "Show image deposit !";
  path_img_view:string = "../../../../../assets/images/ck.jpg";
  isViewImg:boolean = false;
  @Input() isAdmin:boolean= true;
  isCallAlert = false;
  nameActionToAlert: string = "";
  messageToAction: string = "";
  isAcceptAction: boolean = false;
  depositCurrentRow: DepositRequest = new DepositRequest();
  colorSlideFilter: ThemePalette = 'primary';
  content_for_search: string = "Find deposit by learner name or learner email";
  typeOfAction: action = action.CONFIRMED;
  newStatusDeposit: STATUSES = STATUSES.CONFIRM;
  @Input() getTitleSearch = new EventEmitter<string>();
  depositRequests: DepositRequest[] = [];
  isConfirmAll: boolean = false;
  @Input() admin: User = new User();
  @Output() changBalanceAdmin = new EventEmitter<number>();

  constructor(public userService: UserService, 
    private _snackBar: MatSnackBar, 
    public depositRequestService: DepositRequestService,
    private router: Router,
    ) { 

   }

   openSnackBar(message: string, action: string) { // notice success
    this._snackBar.open(message, action, {
      duration: 2000
    });
    
  }


  ngOnInit(): void {
    this.getAllList();
    this.getAllListLearner();
    console.log(this.depositRequests.length);
    
  }

  eSortDate: SORT= SORT.CURRENT;

   sortDate() {
     this.eSortAmount = SORT.CURRENT;
     this.eSortDate  = this.eSortDate + this.updateSort(this.eSortDate);

     if(this.eSortDate == SORT.CURRENT)
     {
      this.getAllList();} 

      else if(this.eSortDate == SORT.INCREASE){
          this.listSearch = this.listSearch.sort((a, b) => {
            return <any>new Date(b.createdAt) - <any>new Date(a.createdAt);
          });
      }
      else {
        this.listSearch = this.listSearch.sort((a, b) => {
          return <any>new Date(a.createdAt) - <any>new Date(b.createdAt);
        });
      }

      console.log("sort update: " + this.eSortDate);
  
  }

  eSortAmount: SORT= SORT.CURRENT;
  
  sortAmount(){
    this.eSortDate = SORT.CURRENT;
    this.eSortAmount = this.eSortAmount + this.updateSort(this.eSortAmount);

    if(this.eSortAmount == SORT.CURRENT)
    {
      this.getAllList();} 

  else if(this.eSortAmount == SORT.DECREASE){
   
    this.listSearch = this.listSearch.sort(function(deposit1, deposit2) {
      return deposit1.amount - deposit2.amount;
   });
  }
  else {
 
    this.listSearch = this.listSearch.sort(function(deposit1, deposit2) {
      return deposit2.amount - deposit1.amount;
   });
  }

  }

  updateSort(sort: SORT){
    console.log("sort: " + sort);
    if(sort == SORT.CURRENT || sort == SORT.INCREASE)
        return 1;
    else 
        return -2;
  }
  

  isDeny(status: STATUSES){
    if(status == STATUSES.DENIED)
      return true;
    return false;
  }

  setIsConfirmAll(){ 
    
    this.isConfirmAll = !this.isConfirmAll;
    if(this.isConfirmAll) this.getListNotYetConfirm();
    else {
      this.listSearch = this.depositRequests;
    };
  }

  getListNotYetConfirm(){
   this.listSearch = this.depositRequests.filter(deposit => deposit.depositRequestStatus == STATUSES.PENDING);
  }

  listTemp: DepositRequest[] = [];
  getAllList(){
    this.depositRequestService.getAll().subscribe(depositRequest =>
      {
        if(depositRequest.count != 0)
        {
          this.depositRequests = depositRequest.depositRequests,
          this.listSearch = this.depositRequests,
          this.listTemp = this.depositRequests
        } else this.depositRequests = [];
       
      } );
  }

  listLearner :User[] = [];
  getAllListLearner(){
    this.userService.getAllLearner().subscribe(
      users => {
        if(users.count != 0){
          this.listLearner = users.users
        }
      }
    )
  }

  
 //use
  getLearnerByIdLearner(learnerId: string): User{
   for(let learner of this.listLearner)
      if (learner.id == learnerId)
          return learner;
    return new User();
  }


  //not use
  getFullNameByIdLearner(learnerId: string){
    const user = this.listLearner.find(user => user.id == learnerId);
    return user?.fullName;
  }


  //not use
  getEmaiByIdLearner(learnerId: string){
    const user = this.listLearner.find(user => user.id == learnerId);
    return user?.email;
  }



  //use
  listSearch: DepositRequest[] = [];
  searchDeposit($event: any){
   // const content = this.getTitleSearch.emit($event);
    //get search
    if($event == "")
      this.getAllList();
    else this.getDepositsByNameOrEmailLearner($event);
    
    //this.depositRequestService.getDepositsByNameOrEmailLearner($event).subscribe(deposit => this.depositRequests = deposit);
  }

  //use
  getDepositsByNameOrEmailLearner($event: string){
    this.listSearch = this.depositRequests.filter(
      learner => this.getLearnerByIdLearner(learner.learnerId).fullName.toLowerCase().includes($event.toLowerCase()) 
      || this.getLearnerByIdLearner(learner.learnerId).email.toLowerCase().includes($event.toLowerCase())
    )
  }

  
  getAcceptFromAlert($event: any){
    this.isAcceptAction = $event;
    if(this.isAcceptAction) this.updateStatusDeposit();
    
  }


  
  setActionConfirm(){ //when click btn confirm
    this.setMessageToAlert("Do you want CONFIRM this deposit request !", "Confirm");
    this.newStatusDeposit = STATUSES.CONFIRM;

  }

  setActionDeny(){ //when click btn deny
    this.setMessageToAlert("Do you want DENY this deposit request !", "Deny");
    this.newStatusDeposit = STATUSES.DENIED;
  }


  updateStatusDeposit(){
    // confirm or deny 
    // get deposit current for update
    this.depositRequestService.updateStatus(this.depositCurrentRow, this.newStatusDeposit).subscribe();

    if(this.newStatusDeposit == STATUSES.CONFIRM){
      var user = this.getLearnerByIdLearner(this.depositCurrentRow.learnerId);
      user.balance = user.balance + this.depositCurrentRow.amount;
      this.admin.balance = this.admin.balance + this.depositCurrentRow.amount;
      this.changBalanceAdmin.emit(this.admin.balance);
      this.userService.updateUser(user).subscribe();
      this.userService.updateUser(this.admin).subscribe();
     
      //this.getAllList();
     
    }
   
    this.openSnackBar("Reposit was updated !", "OK"); 
    this.getAllList();

  }

  getDepositCurrentRow(item: DepositRequest){
    this.depositCurrentRow = item;
  }

  setMessageToAlert(message: string, nameAction: string){ //nameAction is mean name button submit
    this.messageToAction = message;
    this.nameActionToAlert = nameAction;
    this.isCallAlert = true;
  }

  reloadPage(){
    window.location.reload();
  }

  isPaging(){
    return false;
  }

  isShowImg(){
    return this.isViewImg;
  }

  onHandleError(){
    this.isCallAlert = false;
    this.isViewImg = false;
  }

  showImg(){
    this.isViewImg = true;
  }

  refreshComponent(){
    this.router.navigate([this.router.url])
 }

  handlePriceFormat(price:number):any{

    var price_format="";
    var zero;
    if(price == 0)
      return 0 + "VND";
    while(price%1000==0)
    {
      price= price/1000;
      
       zero =price_format;
      price_format = ".000"+price_format;
    }
    zero = price_format;
    price_format=price.toString()+ price_format+"VND";

    return price_format;
  }
}
