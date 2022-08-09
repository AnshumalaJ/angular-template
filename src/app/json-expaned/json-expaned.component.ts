// refer from https://github.com/hivivo/ngx-json-viewer
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';






export interface Segment {
  key: string;
  value: any;
  type: undefined | string;
  description: string;
  expanded: boolean;

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
  @Input() _currentDepth = -1;





  ngOnInit(): void {
  }
  segments: Segment[] = [];

  constructor(private clipboard: Clipboard) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.segments = [];
    this.json = JSON.parse(JSON.stringify(this.json))

    this._currentDepth++;

    if (typeof this.json === 'object') {
      Object.keys(this.json).forEach(key => {
        this.segments.push(this.parseKeyValue(key, this.json[key]));

      });
    } else {
      this.segments.push(this.parseKeyValue(`(${typeof this.json})`, this.json));
    }
  }


  isExpandable(segment: Segment) {
    return (segment.type === 'object' ) || (segment.type === 'array' );
  }
  toggle(segment: Segment, i: any) {
    if (this.isExpandable(segment)) {
      segment.expanded = !segment.expanded;
      console.log(i)
    }
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

  public isExpanded(): boolean {
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

}

