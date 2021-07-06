import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-balance-wallet',
  templateUrl: './balance-wallet-admin.component.html',
  styleUrls: ['./balance-wallet-admin.component.css']
})
export class BalanceWalletAdminComponent implements OnInit {

  @Input() balance: number = 0;
  constructor() { }

  ngOnInit(): void {
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
