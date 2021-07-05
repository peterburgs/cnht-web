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
  @Output() gotowallet= new EventEmitter<boolean>();
  onClose(){
    this.close.emit();
  
  }
  
  constructor() { }

  ngOnInit(): void {
  }

  actionClick(){
    console.log(this.action);

    if(this.action=="wallet"){
      this.gotowallet.emit(true);
      this.onClose();
    }

    if(this.action=="buy"){
      this.gotowallet.emit(false);
      this.onClose();
    }
    
   
  }

}
