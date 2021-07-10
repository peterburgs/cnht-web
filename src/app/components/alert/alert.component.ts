import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Input() message: string = "hi";
  @Input() actionToAlert: string = "A";
  @Input() action:string="";
  @Output() close = new EventEmitter<void>();
  @Output() action_return= new EventEmitter<string>();
  baseUrl: string = "https://us-central1-supple-craft-318515.cloudfunctions.net/app/";
  onClose(){
    this.close.emit();
  
  }
  
  constructor() { }

  ngOnInit(): void {
  }

  actionClick(){
    console.log(this.action);

    if(this.action=="wallet"){
      this.action_return.emit('wallet');
      this.onClose();
    }

    if(this.action=="buy"){
      this.action_return.emit('buy');
    }
    
    if(this.action=="transfer_money")
    {
      this.action_return.emit('confirm_transfer')
      this.onClose()
    }
    if(this.action=="money_invalid" || this.action=="image_invalid"){
      this.action_return.emit('yes');
      this.onClose();
    }
  }
}
