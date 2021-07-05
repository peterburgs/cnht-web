import { Component, OnInit, Output, EventEmitter, Input} from '@angular/core';


@Component({
  selector: 'app-search-title',
  templateUrl: './search-title.component.html',
  styleUrls: ['./search-title.component.css']
})
export class SearchTitleComponent implements OnInit {

  @Output() sendTitleSearch = new EventEmitter<string>();
  titleSearch: string = "";
  @Input() message: string = "";
  constructor() { }

  ngOnInit(): void {
  }

  sendTitle(){
    this.sendTitleSearch.emit(this.titleSearch);
  }

}
