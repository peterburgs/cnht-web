import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output} from '@angular/core';
import { GRADES } from 'src/app/models/grades';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { COURSE_TYPE } from 'src/app/models/course-type';

interface Grade {
  name: string;
  value: string;
  children?: Grade[];
}

   
/** Flat node with expandable and level information */
interface FlatNodeFilterGrade {
  expandable: boolean;
  name: string;
  level: number;
  value: string;
}

@Component({
  selector: 'app-item-filter',
  templateUrl: './item-filter.component.html',
  styleUrls: ['./item-filter.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ItemFilterComponent implements OnInit {

  @Output() sendGradeChoose = new EventEmitter<string>();
  @Output() sendCategoryChoose = new EventEmitter<string>();
  @Input() category :string= COURSE_TYPE.THEORY; //enum category
  @Input() nameFilterCategory:string =  COURSE_TYPE.THEORY; // name category
  listFilterOfCategory = [GRADES.TWELFTH,GRADES.ELEVENTH, GRADES.TENTH];
  categoryChoose: string = COURSE_TYPE.THEORY;
  grade: string = GRADES.TWELFTH;
  TREE_DATA: Grade[] = [];

  private _transformer = (node: Grade, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      value: node.value
    };
  }

  constructor() { 
  
  };

  setValueForTreeData(){
    this.TREE_DATA = [
      {
        name: this.nameFilterCategory,
        value: this.category,
        children: [
          {name: 'Grade 12', value: GRADES.TWELFTH},
          {name: 'Grade 11', value:GRADES.ELEVENTH},
          {name: 'Grade 10', value: GRADES.TENTH},
        ]
      }
    ]
  }
  

  treeControl = new FlatTreeControl<FlatNodeFilterGrade>(
  node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    hasChild = (_: number, node: FlatNodeFilterGrade) => node.expandable;

  ngOnInit(): void {
     
    this.setValueForTreeData();
    this.dataSource.data = this.TREE_DATA;
    console.log(this.nameFilterCategory);


  }

  change(gradeIndex: string){
    this.grade = gradeIndex;
    console.log(this.grade);
    this.sendGradeChoose.emit(this.grade);
    this.sendCategoryChoose.emit(this.category);
  }


}
