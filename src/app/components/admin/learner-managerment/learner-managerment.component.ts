import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-learner-managerment',
  templateUrl: './learner-managerment.component.html',
  styleUrls: ['./learner-managerment.component.css']
})
export class LearnerManagermentComponent implements OnInit {

  titleSearch:string = "";
  listUsers: User[] = [];
 APPROVE: string = "error";
 isChange = false;
  constructor(private userService: UserService, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getListUser();
  }

  getListUser(){//
   this.listUsers = this.userService.getAllUser();
  }

  searchUser(){
    if(this.titleSearch == "")  this.getAllUser();
    else{
      this.userService.getListUserByTitle(this.titleSearch).subscribe(users => this.listUsers = users);
      this.onLoadRouter();
    }

  }

  getAllUser(){
    this.onLoadRouterDefault();
    this.getListUser();
  }

  

  isPaging(){
    return true;
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

  onLoadRouter(){
    
    this.router.navigate(['admin/managerment/learner'], {queryParams: {searchUser: this.titleSearch }, fragment: 'adminSearch'});
   
  }

  onLoadRouterDefault(){
    this.router.navigate(['admin/managerment/learner']);
   
  }

 
}
