import { HintValidator } from "../classes/hint-validator";

export class SeedGroupValidator extends HintValidator{
    constructor(name:any){
        super(name)
    }
    validate(json: any): boolean {
       console.log(this.checkGroupHint(json),"check for if field present of groupHint")
       console.log(this.checkParentSelector(json),"check if parent selector field is present")
       console.log(this.jsonKey.isEmpty(json),"check if field is empty")
       console.log(this.checkFieldLabel(json,"target_fields"),"check if target field is present")
       console.log(this.checkFieldLabel(json,"mi_fields"),"check if mi_field is present")
        return true
    }

}
