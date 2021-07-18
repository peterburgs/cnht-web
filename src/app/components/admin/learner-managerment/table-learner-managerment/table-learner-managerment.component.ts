import { Component, Input, OnInit } from '@angular/core';
import { Enrollment } from 'src/app/models/enrollment.model';
import { ROLES } from 'src/app/models/user-roles';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/service/user.service';
import { BalanceFormat } from 'src/app/util/balance-format';

const enum SORT{
  CURRENT,
  INCREASE,
  DECREASE
 
}

@Component({
  selector: 'app-table-learner-managerment',
  templateUrl: './table-learner-managerment.component.html',
  styleUrls: ['./table-learner-managerment.component.css']
})


export class TableLearnerManagermentComponent implements OnInit {

  @Input() listUsers: User[] = [];
  APPROVE: string = "error";
  isChange = false;
  isLoading: boolean = true;
  page = 1;
  pageSize = 10;
  titleSearch = "";
   constructor(public userService: UserService) { }
 
   ngOnInit(): void {
     this.isLoading = true;
     this.getAllLearner();
     this.getListUser();
     this.getListEnrollment();
   }

   listEnrollment: Enrollment[] = [];
   getListEnrollment(){
     this.userService.getAllEnrollment().subscribe(data =>
       {
         if(data.count > 0)
           this.listEnrollment = data.enrollments;
         else this.listEnrollment = [];
         this.isLoading = false;
       })
   }

   listUserSort: User[] = [];
   getListUser(){
    this.listUserSort = this.listUsers;
    console.log("table: "  + this.listUsers); 
   }

   getAllLearner(){
    this.eSortEmail = SORT .CURRENT;
    this.isSortEmailUp = false;
    this.isSortEmailDown = false;
     this.userService.getAllLearner().subscribe(users =>
      {
        if(users.count >0) {
          this.listUsers  = users.users.filter(user => user.userRole == ROLES.LEARNER);
          this.listUserSort = this.listUsers.filter(user => this)}
      })
   }

   eSortName: SORT= SORT.CURRENT;
   isSortNameUp: boolean = false;
   isSortNameDown: boolean = false;

   sortName(){
    this.eSortWallet = SORT .CURRENT;
    this.isSortWalletUp = false;
    this.isSortWalletDown = false;

    this.eSortEmail = SORT .CURRENT;
    this.isSortEmailUp = false;
    this.isSortEmailDown = false;

     this.eSortName = this.eSortName + this.updateSort(this.eSortName);
     this.isSortNameUp = false;
     this.isSortNameDown = false;
     if(this.eSortName == SORT.CURRENT)
     {
 
       this.getAllLearner();
      } 
 
   else if(this.eSortName == SORT.INCREASE){
    
     this.isSortNameUp = true;
     this.listUsers = this.listUsers.sort((a, b) => a.fullName.localeCompare(b.fullName));
    }
   
   else {
     this.isSortNameDown = true;
     this.listUsers = this.listUsers.sort((a, b) => b.fullName.localeCompare(a.fullName));

   }
 
   }

   eSortWallet: SORT= SORT.CURRENT;
   isSortWalletUp: boolean = false;
   isSortWalletDown: boolean = false;

   sortWallet(){
    this.eSortName = SORT .CURRENT;
    this.isSortNameUp = false;
    this.isSortNameDown = false;

    this.eSortEmail = SORT .CURRENT;
    this.isSortEmailUp = false;
    this.isSortEmailDown = false;
    
     this.eSortWallet = this.eSortWallet + this.updateSort(this.eSortWallet);
     this.isSortWalletUp = false;
     this.isSortWalletDown = false;
     if(this.eSortWallet == SORT.CURRENT)
     {
 
       this.getAllLearner();
      } 
 
   else if(this.eSortWallet == SORT.INCREASE){
    
     this.isSortWalletUp = true;
     this.listUsers = this.listUsers.sort((a, b) => a.balance - b.balance);
    }
   
   else {
     this.isSortWalletDown = true;
     this.listUsers = this.listUsers.sort((a, b) => b.balance - a.balance);

   }
 
   }

   eSortEmail: SORT= SORT.CURRENT;
   isSortEmailUp: boolean = false;
   isSortEmailDown: boolean = false;

   sortEmail(){

    this.eSortWallet = SORT .CURRENT;
    this.isSortWalletUp = false;
    this.isSortWalletDown = false;

    this.eSortName = SORT .CURRENT;
    this.isSortNameUp = false;
    this.isSortNameDown = false;
    
     this.eSortEmail = this.eSortEmail + this.updateSort(this.eSortEmail);
     this.isSortEmailUp = false;
     this.isSortEmailDown = false;
     if(this.eSortEmail == SORT.CURRENT)
     {
 
       this.getAllLearner();
      } 
 
   else if(this.eSortEmail == SORT.INCREASE){
    
     this.isSortEmailUp = true;
     this.listUsers = this.listUsers.sort((a, b) => a.email.localeCompare(b.email));
    }
   
   else {
     this.isSortEmailDown = true;
     this.listUsers = this.listUsers.sort((a, b) => b.email.localeCompare(a.email));

   }
 
   }


   updateSort(sort: SORT){
    console.log("sort: " + sort);
    if(sort == SORT.CURRENT || sort == SORT.INCREASE)
        return 1;
    else 
        return -2;
  }
 
 
   getTotalCourseForLearner(learnerId: string){
     return this.listEnrollment.filter(enrollment => enrollment.learnerId == learnerId).length;
   }
 
 
   isPaging(){
     if (this.listUsers.length > 9)
       return true;
     return false;
   }
 
   isChooseChange(){
     this.isChange = true;
   }
 
   show(){
     return this.isChange;
   }
 
   onHandleError(){
     this.isChange = false;
   }

   getTotalCourses(userId:string):number{
     return this.userService.getTotalCourses(userId);
   }

   balanceFormat(balance: number){
    return BalanceFormat(balance);
  }
  
}
