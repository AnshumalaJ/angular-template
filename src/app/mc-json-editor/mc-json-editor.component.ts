import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { FormBuilder, FormArray } from '@angular/forms';
import { isEqual, keys } from 'lodash-es';
import { PipeTransform, Pipe } from '@angular/core';



@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value:any) : any {
    return Object.keys(value)
  }
}
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
  styleUrls: ['./mc-json-editor.component.css'],
  
  // pipes:[ keys ]
 

})



export class McJsonEditorComponent implements OnInit {

  @Input() json: any = {};
  form: FormGroup = new FormGroup({})

  constructor(private fb: FormBuilder) {


  }





  ngOnInit(): void {


  }



  ngOnChanges(): void {
    this.json = JSON.parse(JSON.stringify(this.json))
    console.log(this.json);
    console.log(this.dfsFormBuilder(this.json));

    console.log(isEqual(this.json,this.dfsFormBuilder(this.json).value))
    // this.form = this.dfsFormBuilder(this.json) as FormGroup

    this.form = this.dfsFormBuilder(this.json)
    console.log(this.form.value)


  }



  // private dfsFormBuilder(json: any): any {
  //     console.log(json)
  //   if(!this.isLeafNode(json)) {
  //     // console.log(`rec. call for non leaf node- `)

  //     //for array of objects
  //     if(Array.isArray(json)){
  //       let _intermediateArr:any=[]
  //       json.forEach(element=>{
  //         let val = this.dfsFormBuilder(element)

  //         _intermediateArr.push(val);
  //       })
  //       return _intermediateArr;  
  //     } else {

  //       let _intermediate: any = {}
  //       for (const [k, v] of Object.entries(json)) {
  //         //  append ret value to form for key
  //         // this.form.addControl(k,this.fb.control(k))
  //         let val = this.dfsFormBuilder(v)


  //         _intermediate[k] = val
  //       }

  //       return _intermediate

  //     }

  //   } else {

  //     // this.createFormControl(json)
  //     // build leaf node form control and return

  //     return json
  //   }
  // }


  private dfsFormBuilder(json: any): any {

    if (!this.isLeafNode(json)) {
      // console.log(`rec. call for non leaf node- `)

      //for array of objects
      if (Array.isArray(json)) {
        let controlArray: any = []
        json.forEach(element => {
          let val = this.dfsFormBuilder(element)
           controlArray.push(val)
        })
        return new FormArray(controlArray)
      } else {
        let hash: any = {}
        for (const [k, v] of Object.entries(json)) {
          //  append ret value to form for key
          // this.form.addControl(k,this.fb.control(k))
          let val = this.dfsFormBuilder(v)
          hash[k] = val
        }
        return new FormGroup(hash)
      }

    }
    else if (this.isSpecialCase(json)) {
     let hash:any={}
      for (const [k, v] of Object.entries(json)) {
        let val=this.dfsFormBuilder(v)
        hash[k]=val
      }
      return new FormGroup(hash)

    }
    else {

      // this.createFormControl(json)
      // build leaf node form control and return
      return this.createFormControl(json)
    }
  }



  // private isLeafNode(node: object): boolean {
  //   for (const [k, v] of Object.entries(node)) {
  //     if (typeof v == 'string' || typeof v == 'number') {
  //       continue;
  //     } else { return false }
  //   }
  //   return true
  // }
  private isLeafNode(node: object): boolean {
    for (const [k, v] of Object.entries(node)) {
      if (typeof v == 'string' || typeof v == 'number') {
        continue;
      } else { return false }
    }
    return true
  }


  private isSpecialCase(node: Object): boolean {
    let is_Object_or_array = false
    let is_StringOr_num = false
    for (const [k, v] of Object.entries(node)) {
      if (typeof v == 'string' || typeof v == 'number') 
        is_StringOr_num = true;
        else
        is_Object_or_array = true;
    }
    if (is_StringOr_num && is_Object_or_array) 
      return true
    else 
      return false
  }


  private createFormControl(value: Object) {
    //for array leaf node
    if(Array.isArray(value)){
      let controlArray:any=[]
         value.forEach(element=>
          {
               controlArray.push(new FormControl(element))
          }
          )
        return new FormArray(controlArray);
    }

    else if(typeof value == 'string' || typeof value =="number")
    {
      return new FormControl(value)
    }
    else{
      const childForm = new FormGroup({})
      for (const [k, v] of Object.entries(value)) {
        childForm.addControl(k, new FormControl(v))
      }
      return childForm
    }

  }
  

}
