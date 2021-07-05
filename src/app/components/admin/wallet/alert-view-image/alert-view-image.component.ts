import { Component, OnInit,Input,Output ,EventEmitter} from '@angular/core';

@Component({
  selector: 'app-alert-view-image',
  templateUrl: './alert-view-image.component.html',
  styleUrls: ['./alert-view-image.component.css']
})
export class AlertViewImageComponent implements OnInit {

  @Input() message: string = "hi";
  @Input() path_img: string = "../../../../../assets/images/ck.jpg";
  @Output() close = new EventEmitter<void>();

  onClose(){
    this.close.emit();
  }
  
  constructor() { }

  ngOnInit(): void {
  }

}
