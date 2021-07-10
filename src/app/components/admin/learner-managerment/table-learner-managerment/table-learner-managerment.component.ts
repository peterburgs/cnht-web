import { Component, Input, OnInit } from '@angular/core';
import { Enrollment } from 'src/app/models/enrollment.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/service/user.service';
import { BalanceFormat } from 'src/app/util/balance-format';

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
   constructor(public userService: UserService) { }
 
   ngOnInit(): void {
     this.isLoading = true;
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
