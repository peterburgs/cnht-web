import { Component, Input, OnInit } from '@angular/core';
import { ROLES } from 'src/app/models/user-roles';
import { authenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  balance_admin: number = 10000;
  isAdmin: boolean = false;
  constructor(
    private authService: authenticationService,
    private userService: UserService
  ) { }

  ngOnInit(): void {

    if(this.authService.isAdmin())
   
        this.isAdmin = true;
        // if(localStorage.getItem('isLoggedin')=='true'){
        //   let email=localStorage.getItem('uemail')?localStorage.getItem('uemail'):"null";
        //   console.log(email)
        //     if(email!=null)
        //     {
        //       this.userService.getUserByEmail(email).subscribe(dataUser=>{
        //         this.balance_admin= dataUser.users[0].balance;
        //       })
        //       //console.log(this.balance_admin)
        //     }
        // }

  }

}
