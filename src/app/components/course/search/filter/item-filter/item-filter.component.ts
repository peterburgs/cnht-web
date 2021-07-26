import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { GRADES } from 'src/app/models/grades';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { COURSE_TYPE } from 'src/app/models/course-type';

interface Grade {
  name: string;
  value: string;
  checked?: boolean;
  children?: Grade[];
}

interface FlatNodeFilterGrade {
  expandable: boolean;
  name: string;
  level: number;
  value: string;
  checked: boolean;
}

@Component({
  selector: 'app-item-filter',
  templateUrl: './item-filter.component.html',
  styleUrls: ['./item-filter.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ItemFilterComponent implements OnInit {
  @Output() sendGradeChoose = new EventEmitter<string>();
  @Output() sendCategoryChoose = new EventEmitter<string>();
  @Input() category: string = '';
  nameFilterCategory: string = COURSE_TYPE.THEORY;
  listFilterOfCategory: string[] = [];
  categoryChoose: string = COURSE_TYPE.THEORY;
  grade: string = GRADES.TWELFTH;
  TREE_DATA: Grade[] = [];

  private _transformer = (node: Grade, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      value: node.value,
      checked: false,
    };
  };

  constructor() {
    this.setValueForTreeData();
  }

  setValueForTreeData() {
    if (this.category == COURSE_TYPE.THEORY) this.nameFilterCategory = 'Theory';
    else if (this.category == COURSE_TYPE.EXAMINATION_SOLVING)
      this.nameFilterCategory = 'Examination Solving';
    else this.nameFilterCategory = 'Test';

    this.TREE_DATA = [
      {
        name: this.nameFilterCategory,
        value: this.category,
        children: [
          { name: 'Grade 12', value: GRADES.TWELFTH },
          { name: 'Grade 11', value: GRADES.ELEVENTH },
          { name: 'Grade 10', value: GRADES.TENTH },
          { name: 'Grade 9', value: GRADES.NINTH },
        ],
      },
    ];
  }

  treeControl = new FlatTreeControl<FlatNodeFilterGrade>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatNodeFilterGrade) => node.expandable;

  ngOnInit(): void {
    this.setValueForTreeData();
    this.dataSource.data = this.TREE_DATA;
  }

  change(gradeIndex: string) {
    this.grade = gradeIndex;
    this.sendGradeChoose.emit(this.grade);
    this.sendCategoryChoose.emit(this.category);
  }
}
