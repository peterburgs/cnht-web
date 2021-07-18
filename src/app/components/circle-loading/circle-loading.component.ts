import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-circle-loading',
  templateUrl: './circle-loading.component.html',
  styleUrls: ['./circle-loading.component.css']
})
export class CircleLoadingComponent implements OnInit {
  @Input() isLoading :boolean=false;
  constructor() { }

  ngOnInit(): void {
  }

}
