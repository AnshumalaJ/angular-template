// refer from https://github.com/hivivo/ngx-json-viewer
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { HintValidator } from '../classes/hint-validator';
import { SeedGroupValidator } from '../validator/seed-group-validator';





export interface Segment {
  key: string;
  value: any;
  type: undefined | string;
  description: string;
  expanded: boolean;

}
export interface Changes {
  key: string;
  first_value: any
  raw_value: any;
  changed_value: any;
  parent_key: string;
}

@Component({
  selector: 'ngx-json-viewer',
  templateUrl: './json-expaned.component.html',
  styleUrls: ['./json-expaned.component.scss']
})
export class NgxJsonViewerComponent implements OnInit {

  @Input() json: any;
  @Input() expanded = true;
  @Input() depth = -1;
  @Input() editable: boolean = true;
  @Input() parent_segment: Segment[] = []
  @Input() change_records: Changes[] = []

  @Input() _currentDepth = -1;
  _editable = false;
  // @Input() set editable(v : boolean) {
  //   this._editable = v;
  //   console.log("editable ", this._editable)
  // }



  ngOnInit(): void {
  }
  segments: Segment[] = [];
  private first_change = false;
  private isPresent = false;
  private parent_k = ""

  constructor(private clipboard: Clipboard) {


  }

  ngOnChanges(changes: SimpleChanges) {
    this.segments = [];
    // remove cycles
    this.json = this.decycle(this.json);
   
   
  
    this.change_records.forEach((record) => {
      this.json = this.getObjects(this.json, record.key, record.first_value, record.changed_value)
    })


    this._currentDepth++;
    // console.log("onchanges call for ",this.json)
    if (typeof this.json === 'object') {
      Object.keys(this.json).forEach(key => {
        this.segments.push(this.parseKeyValue(key, this.json[key]));

      });
    } else {
      this.segments.push(this.parseKeyValue(`(${typeof this.json})`, this.json));
    }
  }

  onEditValue(value: string, segment: any, segments: any) {

    this.parent_segment.forEach((obj) => {
      if (Object.keys(obj.value).includes(segment.key)) {
        if (Object.values(obj.value).includes(segment.value)) {
          this.parent_k = obj.key;
          // (obj.value[segment.key]) = value;
        }
      }
    })

    let change_record = {
      key: segment.key,
      first_value: segment.value,
      raw_value: segment.value,
      changed_value: value,
      parent_key: this.parent_k
    }

    //changing value 
    if (this.first_change == false) {
      //change value first time after toggle
      this.change_records.forEach(element => {
        if (element.key == segment.key && element.changed_value == segment.value) {
          {
            element.raw_value = segment.value;
            element.changed_value = value;
            this.first_change = true;
            this.isPresent = true;
            console.log("after refresh first change");
          }
        }

      });
      //change value for first time
      if (this.isPresent == false) {
        this.change_records.push(change_record);
        this.isPresent = true;
        this.first_change = true;
        console.log("first entry");
      }

    }
   //change done continuesly for the same key without toggling
    else {
      this.change_records.forEach(element => {
        if (element.key == segment.key && this.parent_k == element.parent_key) {
          element.raw_value = element.changed_value;
          element.changed_value = value;
          console.log("changes continue....")
        }
      });
    }
    console.log(this.change_records, "records of changes till now");

  }
  isExpandable(segment: Segment) {

    return segment.type === 'object' || segment.type === 'array';



  }

  toggle(segment: Segment, i: any) {
    if (this.isExpandable(segment)) {
      segment.expanded = !segment.expanded;
      console.log(i)
    }
    
    // this.validateFields(this.json)
    
  }


  confirmChange() {



    console.log("confirmChangecalled")
  }

  private parseKeyValue(key: any, value: any): Segment {
    const segment: Segment = {
      key: key,
      value: value,
      type: undefined,
      description: '' + value,
      expanded: this.isExpanded(),

    };

    switch (typeof segment.value) {
      case 'number': {
        segment.type = 'number';
        break;
      }
      case 'boolean': {
        segment.type = 'boolean';
        break;
      }
      case 'function': {
        segment.type = 'function';
        break;
      }
      case 'string': {
        segment.type = 'string';
        segment.description = '"' + segment.value + '"';
        break;
      }
      case 'undefined': {
        segment.type = 'undefined';
        segment.description = 'undefined';
        break;
      }
      case 'object': {
        // yea, null is object
        if (segment.value === null) {
          segment.type = 'null';
          segment.description = 'null';
        } else if (Array.isArray(segment.value)) {
          segment.type = 'array';
          segment.description = 'Array[' + segment.value.length + '] ' + JSON.stringify(segment.value);
        } else if (segment.value instanceof Date) {
          segment.type = 'date';
        } else {
          segment.type = 'object';
          segment.description = 'Object ' + JSON.stringify(segment.value);
        }
        break;
      }
    }


    return segment;
  }

  private isExpanded(): boolean {
    return (
      this.expanded &&
      !(this.depth > -1 && this._currentDepth >= this.depth)
    );
  }

  onDescribe(value: any): void {

    value = "$x(" + value + ")"
    console.log(value)
    this.clipboard.copy(value);
  }
  onCopyToClipboard(value: any): void {

    console.log(value)
    this.clipboard.copy(value);
  }
  getInputFieldSize(value: string): Number {
    return value.length * 200

  }
  // lookup(obj: any, k: string) {
  //   for (var key in obj) {
  //     var value = obj[key];
  //     if (k == key) {
  //       return [k, value];
  //     }
  //     if (typeof (value) === "object" && !Array.isArray(value)) {
  //       let y: any = this.lookup(value, k);
  //       if (y && y[0] == k) return y;
  //     }
  //     if (Array.isArray(value)) {
  //       // for..in doesn't work the way you want on arrays in some browsers
  //       //
  //       for (let i = 0; i < value.length; ++i) {
  //         let x: any = this.lookup(value[i], k);
  //         if (x && x[0] == k) return x;
  //       }
  //     }
  //   }
  // }
  getObjects(obj: any, key: string, val: any, newVal: any) {
    let newValue = newVal;
    let objects: any = [];
    for (var i in obj) {
      if (!obj.hasOwnProperty(i)) continue;
      if (typeof obj[i] == 'object') {
        objects = objects.concat(this.getObjects(obj[i], key, val, newValue));
      } else if (i == key && obj[key] == val) {
        obj[key] = newVal;
      }
    }
    return obj;
  }

  private validateFields(json:any){
    let seedGroupValid=new SeedGroupValidator("seed-group-validator");
    seedGroupValid.validate(json);

  }




  // https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
  private decycle(object: any) {
    const objects = new WeakMap();
    return (function derez(value, path) {
      let old_path;
      let nu: any;

      if (
        typeof value === 'object'
        && value !== null
        && !(value instanceof Boolean)
        && !(value instanceof Date)
        && !(value instanceof Number)
        && !(value instanceof RegExp)
        && !(value instanceof String)
      ) {
        old_path = objects.get(value);
        if (old_path !== undefined) {
          return { $ref: old_path };
        }
        objects.set(value, path);

        if (Array.isArray(value)) {
          nu = [];
          value.forEach(function (element, i) {
            nu[i] = derez(element, path + '[' + i + ']');
          });
        } else {
          nu = {};
          Object.keys(value).forEach(function (name) {
            nu[name] = derez(
              value[name],
              path + '[' + JSON.stringify(name) + ']'
            );
          });
        }
        return nu;
      }
      return value;
    }(object, '$'));
  }

}

