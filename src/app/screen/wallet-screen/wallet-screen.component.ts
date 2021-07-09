import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { PriceFormat } from 'src/app/util/priceformat';

@Component({
  selector: 'app-wallet-screen',
  templateUrl: './wallet-screen.component.html',
  styleUrls: ['./wallet-screen.component.css']
})
export class WalletScreenComponent implements OnInit {

  isHiden: boolean= true;
  balance: number=0;
  constructor(private userService:UserService) { }

  ngOnInit(): void {
    if(localStorage.getItem('isLoggedin')=='true'){
      let email=localStorage.getItem('uemail')?localStorage.getItem('uemail'):"null";
      console.log(email)
        if(email!=null)
        {
          this.userService.getUserByEmail(email).subscribe(dataUser=>{
            this.balance= dataUser.users[0].balance;
          })
          console.log(this.balance)
        }
    }

  }

  handlePriceFormat(price:number):any{

    return PriceFormat(price,0,3,'.',',');
  }

}
