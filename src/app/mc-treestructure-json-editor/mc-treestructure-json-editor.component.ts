import { Component, Input, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, FormGroupDirective, FormArray } from '@angular/forms';
import { isEqual } from 'lodash-es';

export class FileNode {
  children: FileNode[];
  filename: string;
  type: any;
}

@Component({
  selector: 'app-mc-treestructure-json-editor',
  templateUrl: './mc-treestructure-json-editor.component.html',
  styleUrls: ['./mc-treestructure-json-editor.component.css'],

})
export class McTreestructureJsonEditorComponent implements OnInit {
  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource: MatTreeNestedDataSource<FileNode>;
  dataChange = new BehaviorSubject<FileNode[]>([]);
  form: FormGroup | FormArray | FormControl;

  @Input() json: any = {};

  get data(): FileNode[] {
    return this.dataChange.value;
  }

  get _form(): FormGroup {
    return this.form as FormGroup
  }

  constructor() {
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
  }

  ngOnInit(): void {

  }

  ngOnChanges(): void {

    this.json = JSON.parse(JSON.stringify(this.json))
    console.log(isEqual(this.json, this.dfsFormBuilder(this.json).value))
    this.form = this.dfsFormBuilder(this.json)
    console.log(this.form.value)
    console.log(this.form)
    const data = this.buildFileTree(this.json, 0);
    this.dataChange.next(data);
    this.dataChange.subscribe(
      (data) => (this.nestedDataSource.data = data)
    );
  }


  private dfsFormBuilder(json: any): FormGroup | FormArray | FormControl {

    if (!this.isLeafNode(json)) {

      //for array of objects
      if (Array.isArray(json)) {
        let controlArray = new FormArray<any>([])
        json.forEach(obj => {
          let _intermediateForm = this.dfsFormBuilder(obj)
          controlArray.push(_intermediateForm)
        })
        return controlArray
      } else {
        let _formGroup: FormGroup = new FormGroup({})
        for (const [k, v] of Object.entries(json)) {
          //  append ret value to form for key
          if (['string', 'number', 'boolean', 'bigint'].includes(typeof v)) {
            // construct form control for k, v
            _formGroup.addControl(k, new FormControl(v))
          } else if (typeof v == 'object') {
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


  private buildLeafNodeForm(node: any): FormGroup | FormArray | FormControl {

    if (Array.isArray(node)) {
      let obj: any = []
      node.forEach(v => obj.push(new FormControl(v)))
      return new FormArray(obj);
    }
    else if (typeof node == "string" || typeof node == 'number')
      return new FormControl(node);

    else {
      let obj: any = {}
      for (const [k, v] of Object.entries(node)) {
        obj[k] = new FormControl(v);
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


  buildFileTree(obj: { [key: string]: any }, level: number): FileNode[] {

    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new FileNode();
      node.filename = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        }
        else {
          node.type = value;
        }
      }
      return accumulator.concat(node);
    }, []);
  }

  hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.type;

  private _getChildren = (node: FileNode) => node.children;


}







