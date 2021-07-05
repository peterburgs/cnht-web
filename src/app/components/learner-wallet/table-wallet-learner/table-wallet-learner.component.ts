import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-wallet-learner',
  templateUrl: './table-wallet-learner.component.html',
  styleUrls: ['./table-wallet-learner.component.css']
})
export class TableWalletLearnerComponent implements OnInit {

  message_view_img: string = "Show image deposit !";
  path_img_view:string = "../../../../../assets/images/ck.jpg";
  isViewImg:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  isShowImg(){
    return this.isViewImg;
  }

  onHandleError(){
    this.isViewImg = false;
  }

  showImg(){
    this.isViewImg = true;
  }

}
