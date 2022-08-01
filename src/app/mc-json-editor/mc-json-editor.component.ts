import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { isEqual } from 'lodash-es';




@Component({
  selector: 'app-mc-json-editor',
  templateUrl: './mc-json-editor.component.html',
  styleUrls: ['./mc-json-editor.component.css'],
})

export class McJsonEditorComponent implements OnInit {

  @Input() json: any = {};
  form: FormGroup | FormArray;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.json = JSON.parse(JSON.stringify(this.json))
    console.log(isEqual(this.json,this.dfsFormBuilder(this.json).value))
    this.form = this.dfsFormBuilder(this.json)
    console.log(this.form.value)
  }

  private dfsFormBuilder(json: any): FormGroup | FormArray {

    if (!this.isLeafNode(json)) {

      //for array of objects
      if (Array.isArray(json)) {
        let controlArray = new FormArray<any>([])
        json.forEach(obj => {
          let _intermediateForm = this.dfsFormBuilder(obj)
          controlArray.push(_intermediateForm as FormGroup)
        })
        return controlArray
      } else {
        let _formGroup: FormGroup = new FormGroup({})
        for (const [k, v] of Object.entries(json)) {
          //  append ret value to form for key
          if(['string', 'number', 'boolean', 'bigint'].includes(typeof v)) {
            // construct form control for k, v
            _formGroup.addControl(k, new FormControl(v))
          } else if(typeof v == 'object') {
            let intermediateForm = this.dfsFormBuilder(v)
            _formGroup.addControl(k, intermediateForm)
          } else {
            throw new Error("unsupported value in JSON, " + JSON.stringify(this.json))
          }
        }
        return _formGroup
      }

    }
    else {
      // build leaf node form control and return
      return this.buildLeafNodeForm(json)
    }
  }


  private buildLeafNodeForm(node: any): FormGroup | FormArray {

    if(Array.isArray(node)) {
      let obj:any=[]
      node.forEach(v=>obj.push(new FormControl(v)))
      return new FormArray(obj);
    } else {
      let obj:any={}
      for (const [k, v] of Object.entries(node)) {
        obj[k]=new FormControl(v);
      }
      return new FormGroup(obj)
    }
  }
  
  private isLeafNode(node: object): boolean {
    // is this node array of values ? or array of objects ?
    for (const [k, v] of Object.entries(node)) {
      if (typeof v == 'string' || typeof v == 'number') {
        continue;
      } else { return false }
    }
    return true
  }

  onSubmit(form:FormGroup){
 
  }
  

}
