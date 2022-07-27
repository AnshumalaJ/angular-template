
export interface Ihash {
    [msg: string]: string;
}
//check if invalid template field exist 
class TemplateJsonKeyValidator {
    errHash: Ihash = {}
    public validteTemplateJsonKey(keys: string[]): any {
        let template_fields = [
            "paginator_config",
            "heading_selector",
            "mi_selector",
            "expected_count_selector",
            "target_fields",
            "mi_fields",
            "parent_selector",
            "dp_parent_selector",
            "vdp_container_text",
            "mi1_fields_pattern",
            "mi2_fields_pattern",
            "specific_headers",
            "specific_headers_mi",
            "srp_config",
            "dp_config",
            "execute_np_resp_script",
            "execute_tp_resp_script",
            "specific_next_page_headers",
            "execute_dp_resp_script",
            "dp_json_url"
        ]
        let valid_fields: string[]=[];


        for (const key of keys) {
            if (!template_fields.includes(key)) {
                this.errHash["msg"] = `Found improper field/s in input json file  `;
                return this.errHash;
            }
            else
                valid_fields.push(key);
        }
        console.log(valid_fields,"valid fields present in json data")
        return valid_fields;
    }
    // public validJson(json: any) {
    //     JSON.parse(JSON.stringify(json)

    // }
    public isEmpty(json: any) {

        if (!Object.keys(json).length){
            this.errHash["msg"] = "Found empty template json file. Please upload proper json file...";
        return this.errHash;
        }
        return false;
    }
    public miFieldValidation(field: string, hints: any):any {
        if (Object.keys(hints).includes(field)) {
            let mi_field_keys: string[] = Object.keys(hints[field]);
            if (mi_field_keys.includes("listing_container_xpath") && mi_field_keys.includes("formatxpath")) {
                if (!Object.keys(hints[field]["listing_container_xpath"]).length|| !Object.keys(hints[field]["formatxpath"]).length) {
                    {
                        if(!Object.keys(hints[field]["listing_container_xpath"]).length){
                            this.errHash["msg"]="listing_container_xpath is empty in mi1_fields_pattern"
                        }
                        else if(!Object.keys(hints[field]["formatxpath"]).length){
                            this.errHash["msg"]="formatxpath is empty in mi1_fields_pattern"
                        }
                        else{
                            this.errHash["msg"]="listing_container_xpath and formatxpath is empty in mi1_fields_pattern"
                        } 
                    }
                }
            }
            else{
                this.errHash["msg"]="listing_container_xpath or formatxpath not present"
            }
            return this.errHash;
        }
        else{
            return true
        }
 
   
    }
   


}

export abstract class HintValidator {
    protected errHash: Ihash = {}

    private jsonKeyValidator = new TemplateJsonKeyValidator()

    constructor(name: any) {
      
    }
    protected get jsonKey(): TemplateJsonKeyValidator {
        return this.jsonKeyValidator;
    }

    // private hints = this.json["groupHints"];
    abstract validate(json:any):boolean;
    protected checkGroupHint(json:any) {
        let hints = json["groupHints"];
        if (!Object.keys(hints).length || Object.keys(hints) == undefined) {
            this.errHash["msg"] = "'groupHints' field is not present. please provide groupHints..."
            return this.errHash;
        }
        console.log(this.jsonKey.miFieldValidation("mi1_fields_pattern",hints),"for mi_fieldvalidtion")

        return true;

    }
    protected checkParentSelector(json:any): any {
        if (this.checkGroupHint(json) === true) {
            let valid_field = this.jsonKeyValidator.validteTemplateJsonKey(Object.keys(json["groupHints"]))
            if (valid_field.includes("parent_selector"))
                return true;
            else {
                this.errHash["msg"] = "Field 'parent_selector' is absent. Please provide it"
            }
        }
        return this.errHash;
    }
    protected checkFieldLabel(json:any,field:string):any{
        let invalid_targetField:string[]=[]
        let hints = json["groupHints"];
        if (this.checkGroupHint(json) === true){
            let valid_field = this.jsonKeyValidator.validteTemplateJsonKey(Object.keys(json["groupHints"]))  
            if(valid_field.includes(field))
            {
                  if(!Object.keys(hints[field]).length){
                    Object.keys(hints[field]).forEach(k=>{
                        if(k.trim().includes(" "))
                        {
                            invalid_targetField.push(k);
                        }
                    })
                if(!invalid_targetField.length)
                {
                   let  msg=`Please replace space with underscore (_) in ${field} ${invalid_targetField}`;
                   this.errHash["msg"]=msg;
                   return this.errHash;
                }    
            }
          
          
        }
        return true;

    }

}
}
