import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Cùng nhau học toán';
  constructor(private router: Router){}
  currentUrl=""
  isShowNavbar= true;
  ngOnInit(): void {
    this.router.events.subscribe(router=>{
      this.currentUrl= this.router.url; 
      if(this.currentUrl.includes("/login")){
        this.isShowNavbar= false;
      }
      else this.isShowNavbar= true;
    })
    
  }
 
}
