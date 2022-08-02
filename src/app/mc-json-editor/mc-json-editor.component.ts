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
  all_meta: any;

  constructor() {}

  get _form():FormGroup{
    return this.form as FormGroup
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.json = JSON.parse(JSON.stringify(this.json))
    console.log(isEqual(this.json,this.dfsFormBuilder(this.json).value))
    this.form = this.dfsFormBuilder(this.json)
    console.log(this.form.value)
    console.log(this.form)
    this.all_meta=this.formControlRecursiveMeta(this._form)

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
  formControlRecursiveMeta(form:any): {}{
    let myMeta:any = {};
    let i = 0;
    let j = 0;
    Object.keys(form.controls).forEach(key =>{
      if(!!form.controls[key].controls){
        myMeta['group'+ i.toString()] = {
          group: this.formControlRecursiveMeta(form.controls[key]),
          order: i + j,
          name: key,
          label: this.fixLabel(key)
        };
        i = i + 1;
      }else{
        myMeta['input' + j.toString()] = {
          type: this.inputType(form.controls[key]),
          name: key,
          disabled: false,
          label: this.fixLabel(key),
          order: i + j,
          value: form.controls[key].value
        };
        j = j + 1;
      }
    });
    console.log(myMeta)
    return myMeta
  }

  keys(input:any){
    if(input){
      return Object.keys(input);
    }else{
      return []
    }
  }
  fixLabel(key: string): string{
    let returnLabel = key.toUpperCase()

    return returnLabel
  }
  inputType(info:any): string{
    return 'text'
  }

  onSubmit(form:FormGroup){
 
  }
  

}
