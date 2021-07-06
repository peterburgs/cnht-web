import { Component, Input, OnInit } from '@angular/core';
import { ROLES } from 'src/app/models/user-roles';
import { authenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  balance_admin: number = 10000;
  isAdmin: boolean = false;
  constructor(
    private authService: authenticationService
  ) { }

  ngOnInit(): void {

    if(this.authService.isAdmin())
   
        this.isAdmin = true;

  }

}
