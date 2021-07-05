import { Component, OnInit } from '@angular/core';
import { OptionAdmin } from 'src/app/models/optionAdmin';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  
  chooseLearnerManagerment: number = OptionAdmin.LearnerManagerment;
  chooseLecturerManagerment: number = OptionAdmin.LecturerManagerment;
  chooseLearnerPayment: number = OptionAdmin.LearnerPayment;
  chooseAdminWallet: number = OptionAdmin.AdminWallet;
  choose: number = 0;
  
  constructor() { }

  ngOnInit(): void {
  }

  isUseOptionAdmin(temp: number){
    if(this.choose === temp)
      return true;
    
    return false;
  }

  setChooseOption(temp: number){
    this.choose = temp;
  }
}
