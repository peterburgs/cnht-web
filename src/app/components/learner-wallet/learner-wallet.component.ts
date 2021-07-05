import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-learner-wallet',
  templateUrl: './learner-wallet.component.html',
  styleUrls: ['./learner-wallet.component.css']
})
export class LearnerWalletComponent implements OnInit {

  balance_learner:number = 10000;
  constructor() { }

  ngOnInit(): void {
  }

}
