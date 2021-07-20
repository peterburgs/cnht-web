import { Component, Input, OnInit } from '@angular/core';
import { ModifyType } from 'src/app/models/ModifyType';
import { VideoType } from 'src/app/models/VideoType.model';

@Component({
  selector: 'app-alert-confimation',
  templateUrl: './alert-confimation.component.html',
  styleUrls: ['./alert-confimation.component.css']
})
export class AlertConfimationComponent implements OnInit {
  @Input() typeSelection: VideoType= VideoType.course;
  @Input() wayModify: ModifyType= ModifyType.save;
  
  constructor() { }

  ngOnInit(): void {
  }

}
