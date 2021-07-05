import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-alert-warning',
  templateUrl: './alert-warning.component.html',
  styleUrls: ['./alert-warning.component.css']
})
export class AlertWarningComponent implements OnInit {

  @Output() isAction = new EventEmitter<boolean>();
  @Input() message: string = "hi";
  @Input() actionToAlert: string = "A";
  @Output() close = new EventEmitter<void>();
  isChooseAction:boolean = false;

  onClose(){
    this.isAction.emit(this.isChooseAction); 
    this.close.emit();
  }
  
  chooseAction(){
    this.isChooseAction = true;  // admin want to action this user
    this.onClose();
  }

  constructor() { }

  ngOnInit(): void {
  }

}
