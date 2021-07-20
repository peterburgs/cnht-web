import { Injectable } from '@angular/core';
import {
  ComponentRef,

  TemplateRef,
  EventEmitter,
  Renderer2,
  RendererFactory2,
  Inject,
  Optional
} from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ModalServiceService {

  constructor() { }
  isLeave:boolean=false;
  sbcIsLeave= new Subject<boolean>();
  naviagateAwaySelection$: Subject<boolean> =new Subject<boolean>();
  
  getObserveLeave(){
    return this.naviagateAwaySelection$.asObservable();
  }
  show(){
    this.isLeave=true;
    this.sbcIsLeave.next(this.isLeave);
  }
  setNavigate(choice:boolean){
    this.naviagateAwaySelection$.next(choice);
  }
}
