import { Component, OnInit,Input } from '@angular/core';
import { FormGroup ,FormControl} from '@angular/forms';
import { FormBuilder,FormArray } from '@angular/forms';
import { isEqual } from 'lodash-es';




export interface Segment {
  key: string;
  value: any;
  type: undefined | string;
  description: string;
  expanded: boolean;

}
@Component({
  selector: 'app-mc-json-editor',
  templateUrl: './mc-json-editor.component.html',
  styleUrls: ['./mc-json-editor.component.css']
})


export class McJsonEditorComponent implements OnInit {

  @Input() json: any = {};
  form: FormGroup;

  constructor(private fb:FormBuilder) {
  
   }
   parentForm=this.fb.group({
    typesArray: new FormArray([]),
       })
 
  get typesArray(): FormArray {
      return this.parentForm.get('typesArray') as FormArray;
  }
  ngOnInit(): void { }

  ngOnChanges():void {
    this.json=JSON.parse(JSON.stringify(this.json))
    console.log(this.json)
    this.form = this.dfsFormBuilder(this.json) as FormGroup
    
  }
 

  private dfsFormBuilder(json: any): any {
    if(!this.isLeafNode(json)) {
      // console.log(`rec. call for non leaf node- `)
      let _intermediate: any = {}
      for (const [k, v] of Object.entries(json)) {
        //  append ret value to form for key
        let val = this.dfsFormBuilder(v)
        _intermediate[k] = val
      }
      return _intermediate
    } else {
      // build leaf node form control and return
      return json
    }
  }

  private isLeafNode(node: object): boolean {
    for (const [k, v] of Object.entries(node)) {
      if(typeof v == 'string' || typeof v == 'number') {
        continue;
      } else { return false}
    }
    return true
  }
  
  private createLeafFormGroup():FormGroup{
   let leafFormgroup= this.fb.group({
     childArray:this.fb.array([
     ])
   });
   return leafFormgroup
  } 

}
