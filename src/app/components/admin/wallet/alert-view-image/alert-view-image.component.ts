import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DepositRequest } from 'src/app/models/deposit-request.model';
import { User } from 'src/app/models/user.model';
import { BalanceFormat } from 'src/app/util/balance-format';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-alert-view-image',
  templateUrl: './alert-view-image.component.html',
  styleUrls: ['./alert-view-image.component.css'],
})
export class AlertViewImageComponent implements OnInit {
  @Input() message: string = 'hi';
  @Input() path_img: string = '../../../../../assets/images/ck.jpg';
  @Input() learner: User = new User();
  @Input() deposit: DepositRequest = new DepositRequest();
  @Output() close = new EventEmitter<void>();
  baseUrl: string = environment.baseUrl;
  onClose() {
    this.close.emit();
  }

  constructor() {}

  ngOnInit(): void {}

  balanceFormat(balance: number) {
    return BalanceFormat(balance);
  }
}
