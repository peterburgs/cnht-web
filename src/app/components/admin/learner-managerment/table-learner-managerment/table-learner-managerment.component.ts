import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-table-learner-managerment',
  templateUrl: './table-learner-managerment.component.html',
  styleUrls: ['./table-learner-managerment.component.css']
})
export class TableLearnerManagermentComponent implements OnInit {

  @Input() listUsers: User[] = [];
  APPROVE: string = "error";
  isChange = false;
   constructor(public userService: UserService) { }
 
   ngOnInit(): void {
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
  
}
