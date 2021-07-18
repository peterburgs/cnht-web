import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROLES } from 'src/app/models/user-roles';
import { User } from 'src/app/models/user.model';
import { authenticationService } from 'src/app/service/authentication.service';
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
  constructor(
    private authService: authenticationService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {

    if(this.authService.isAdmin())
   
        this.isAdmin = true;
        if(localStorage.getItem('isLoggedin')=='true'){
          let email=localStorage.getItem('uemail')?localStorage.getItem('uemail'):"null";
          console.log(email)
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

  balanceFormat(balance : number){
    return BalanceFormat(balance);
  }
  
  updateBalanceAdmin($event :any){
    this.balance_admin = $event;
    window.scrollTo(0, 0);
   //window.location.reload();
  }

  refreshComponent(){
    this.router.navigate([this.router.url])
 }

}
