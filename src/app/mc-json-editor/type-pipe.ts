import { Pipe, PipeTransform } from '@angular/core';
import { isArray, isBoolean, isNumber, isObject, isString } from 'lodash-es';

@Pipe({
  name: 'type',
})
export class TypePipe implements PipeTransform {
  transform(value: any): string {
    // if (isArray(value)) return 'array';
    // if (isObject(value)) return 'object';
  
    // if (isNumber(value)) return 'number';
    // if (isBoolean(value)) return 'boolean';

    for (const [k, v] of Object.entries(value)) {
 
       if (isString(v) || isNumber(v))
        continue;
       else
       return 'non_leaf'
      

      }
  
    return 'leaf';
  }
}
