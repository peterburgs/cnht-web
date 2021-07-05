import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';

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
          this.userService.getUserByEmail(email).subscribe(user=>{
            this.balance= user.balance;
          })
          console.log(this.balance)
        }
    }

  }

  handlePriceFormat(price:number):any{

    var price_format="";
    var zero;
    while(price%1000==0)
    {
      price= price/1000;
      
       zero =price_format;
      price_format = ".000"+price_format;
    }
    zero = price_format;
    price_format=price.toString()+ price_format+"đ";

    return price_format;
  }

}
