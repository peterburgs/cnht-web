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

}
