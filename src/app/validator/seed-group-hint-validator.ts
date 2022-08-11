import { Console } from "winston/lib/winston/transports";
import { set } from 'lodash-es';

export interface obj {
  [key: string]: any;
}
const TEMPLATE_FIELDS = [
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
const SKIP_FIELD_FOR_VALIDATION=[
  "param", "increment", "type", "multivalued", "separator", "transformations", 
  "join_separator", "exclude_clean_text", "exclude_formatxpath", "alternate_hint", 
  "exclude_inner_html", "heading_format", "form", "token_hints", "url_format", "response_regex", 
  "execute_np_resp_script","execute_tp_resp_script","specific_next_page_headers","script",
  "increment_next_page","start_next_page","tp_response_type", "np_response_type",
  "execute_dp_resp_script","dp_response_type","dp_parent_selector","start","end","url","increment",
  "response_type","photo_links_extractor","headers","sticky_npl"

]
export class SeedGroupHintValidator {


  //TODO
  //jsonPath validation through library
  
  public validate(json: any): {isValid: boolean, error?: string} {
    try {
      //template json file should be non-empty
      if(this.isEmpty(json)){
        throw new Error("Found empty template json file. Please upload proper json file...");
      }
      //"groupHints"  field should always present in template file
      if(!this.required(json,"groupHints")){
        throw new Error(`"groupHints" field is not present. please provide it...`);
      }  
      let hints = json["groupHints"];

      if(!this.isEmpty(hints)){
        if(!hints.hasOwnProperty("parent_selector")){
          throw new Error(`"parent_selector" field is not present. please provide it...`);
        }
        
        //check for improper field
        let invalid_fields:string[] = []
        if(!this.validateTemplateKeyFields(hints,invalid_fields)){
          throw new Error(`Found improper field/s in input json file -'${invalid_fields}'`)
        }
        
        
        // Validation for mi1_fields_pattern
        this.validateMiFieldPattern(hints,"mi1_fields_pattern")

        // Validation for mi2_fields_pattern
        this.validateMiFieldPattern(hints,"mi2_fields_pattern")

        // Validation for empty FIELD_LABELS inside target_fields and mi_field labels
        //validate target_field FIELD_LABELS
        if(!this.validateFieldLabels(hints,"target_fields",invalid_fields)){
          throw new Error(`Please replace space with underscore (_) in "target_fields" in keys ${invalid_fields}`)
        }

        //validate mi_fields FIELD_LABELS
        if(!this.validateFieldLabels(hints,"mi_fields",invalid_fields)){
          throw new Error(`Please replace space with underscore (_) in "target_fields" in keys ${invalid_fields}`)
        }
        
        //check xpath jpath based on response type
        let err=this.checkXpathJpathBasedOnResponseType(hints,"html","json")
        if(err.length>0){
          throw new Error(err)
        }
          

        //check xpath or  jpath form parent selector
        this.validateParentSelector(hints,"parent_selector")

        //check syntax for hints
        let syntaxErrors=this.checkSyntaxForHint(hints)
        console.log(Object.entries(syntaxErrors))
        
        if(this.isEmpty(syntaxErrors)){
          //validation for format xpath at both srp and mi level
          let missingField:string[]=[]
          this.validateFormatXpathAtSrpAndMiLevel(hints,missingField);
          if(missingField.length>0){
            throw new Error(`Formatxpath Hint error occured - missing place holder '_FIELD_LABEL_' in fields -${missingField}`);
          }   
        }
        else{
           throw new Error(` syntax error in - ${JSON.stringify(syntaxErrors)}`)
        }
      }
      return {
        isValid: true
      }      
    
  }catch (err: any) {
      return {
        isValid: false,
        error: err.message
      }
    }
  }
  

  //check if improper field present in TemplateJsonKeyField
  private validateTemplateKeyFields(obj:any,invalid_fields:string[]):boolean{
    Object.keys(obj).forEach(key=>{
        if(!TEMPLATE_FIELDS.includes(key))
          invalid_fields.push(key);
         } )
    if(invalid_fields.length==0){
      return true
    }
    else{
      return false
    }

  }
  
  private validateMiFieldPattern(obj:any,property:string){
    if(obj.hasOwnProperty(property)){
      let value=obj[property]
      if(this.required(value,"listing_container_xpath") && this.required(value,"formatxpath")){ 
        let listingContainerXpathValue=value["listing_container_xpath"];
        let  formatxpathValue=value["formatxpath"];
        if(this.isEmpty(listingContainerXpathValue) && !(this.isEmpty(formatxpathValue)))
          throw new Error(`listing_container_xpath is empty in ${property}`)
        else if( (this.isEmpty(formatxpathValue)) && !(this.isEmpty(listingContainerXpathValue)))
          throw new Error(`formatxpath is empty in ${property}`)
       }
    }   
  }
  //to validate target_field and mi_field  field_label
  private validateFieldLabels(obj:any,property:string,invalid_fields:string[]):boolean{
    if(this.required(obj,property)){
      let value=obj[property]
      Object.keys(value).forEach(key=>{
        key=key.trim()
        if(key.includes(" "))
        invalid_fields.push(key)
      }
      )
      if(invalid_fields.length>0){
        return false
      }
      else{
        return true
      }
    }
    else{
      return true
    }
  }
   //xpath key for html response type is valid simillarly jpath key for json response type is valid
   private checkXpathJpathBasedOnResponseType(obj:any,responseType:any,miResponseType:any):string{
    let err=""
    let expectedKey=responseType=="html"?"xpath":"jpath";
    let alternatekey=responseType=="json"?"xpath":"jpath";
    let srpFieldForValidation = ["heading_selector", "expected_count_selector", "parent_selector", "mi_selector", "target_fields", "dp_json_url"];
    let miFieldForValidation = ["mi_fields", "mi1_fields_pattern", "mi2_fields_pattern"];
    let srpFieldWithMismatchHint:{"mismatch_key":string[],"mismatch_value":string[]}={"mismatch_key":[],
                                 "mismatch_value":[]}
    let miFieldWithMismatchHint:{"mismatch_key":string[],"mismatch_value":string[]}={"mismatch_key":[],
                                 "mismatch_value":[]}
    
    for(const [key,value] of Object.entries(obj)){
      if(!!value && typeof value=='object' && !this.isEmpty(value)){
        if(srpFieldForValidation.includes(key)){
          let mismatchKeys=this.checkMismatchKey(value,responseType)
          if(mismatchKeys.length>0)
          srpFieldWithMismatchHint.mismatch_key.push(`${key}=>`+mismatchKeys);
  
          let mismatchValues=this.checkMismatchValue(value,responseType)
          if(mismatchValues.length>0)
          srpFieldWithMismatchHint.mismatch_value.push(`${key}=>`+mismatchValues);
        }
        else if(miFieldForValidation.includes(key)){
          let mismatchKeys=this.checkMismatchKey(value,miResponseType)
          if(mismatchKeys.length>0)
          miFieldWithMismatchHint.mismatch_key.push(`${key}=>`+mismatchKeys);
  
          let mismatchValues=this.checkMismatchValue(value,miResponseType)
          if(mismatchValues.length>0)
          miFieldWithMismatchHint.mismatch_value.push(`${key}=>`+mismatchValues);
        }
      }
    }
    if(Object.values(srpFieldWithMismatchHint).flat().length>1)
    {
      let cnt=1
       err +=`**** SRP Response type is '${responseType}' **** (Expected ${expectedKey} hints)`
      if(srpFieldWithMismatchHint.mismatch_key.length>0)
      {
       err +="\n"+`${cnt} Found mismatch ${alternatekey} key for hints --> ${srpFieldWithMismatchHint.mismatch_key}}`
       cnt=cnt+1
      }
      else if((srpFieldWithMismatchHint.mismatch_value.length>0)){
        err+="\n"+`${cnt} Found mismatch ${alternatekey} value for hints --> ${srpFieldWithMismatchHint.mismatch_value}}`
      }
      
    }
     if(Object.values(miFieldWithMismatchHint).flat().length>0){
      let cnt=1
      err +="\n"+` ****  MI Response type is '${responseType}' **** (Expected ${expectedKey} hints)`
      if(miFieldWithMismatchHint.mismatch_key.length>0){
        err +="\n"+` ${cnt} Found mismatch ${alternatekey} key for hints --> ${miFieldWithMismatchHint.mismatch_key}}`
        cnt=cnt+1
      }
      else if((miFieldWithMismatchHint.mismatch_value.length>0)){
        err+="\n"+`${cnt} Found mismatch ${alternatekey} value for hints --> ${miFieldWithMismatchHint.mismatch_value}}`
      }
    }
      return err
  }
   //check key based on response type 
   private checkMismatchKey(obj:any,responseType:any):string{
    let str=""
    if(!!responseType){
      for(const [key,value] of Object.entries(obj)){
          if(!SKIP_FIELD_FOR_VALIDATION.includes(key)){
            if(!!value && typeof value =='object' && !this.isEmpty(value)){
              let res=this.checkMismatchKey(value,responseType)
             if(res.length>0){
               str+=`${key}=>`+res;
             };
            }
            else{
              if(responseType=="html"){
                if(key.includes("jpath")){
                  str+=`${key} ,`
                }
              }
              else if(responseType=="json"){
                if(key.includes("xpath")){
                  str+=`${key} ,`
                }
              }
            }
          }
        }
      }
    
    return str
  }
  //check valid value for xpath and jpath 
  private checkMismatchValue(obj:any,responseType:any):string{
    let str=""
    if(!!responseType){
      for(const [key,value] of Object.entries(obj)){
          if(!SKIP_FIELD_FOR_VALIDATION.includes(key)){
            if(!!value && typeof value =='object' && !this.isEmpty(value)){
              let res=this.checkMismatchValue(value,responseType)
             if(res.length>0){
               str+=`${key}=>`+res;
             };
            }
            else{
              if(responseType=="html" && key.includes("xpath")){
                if(!!value && typeof value=='string' && !this.isEmpty(value))
                if(!(value as string).match(/(^\/\/|^\.\/\/|^\.\/)/)){
                  str+=`${key}`
               }
              }
              else if(responseType=="json" && key.includes("jpath")){
                  if(!!value && typeof value=='string' && !this.isEmpty(value))
                  if((value as string).match(/(^\/\/|^\.\/\/|^\.\/)/)){
                    str+=`${key} ,`
                  }
              }
            }
          }
        }
      }
    return str
  }

  //to validate for Parent_selector xpath or jpath
  private validateParentSelector(obj:any,property:string){
    let value=obj[property] 
    if(this.required(value,"xpath")){
      let xpathValue=value["xpath"]
      if(!!xpathValue && this.isEmpty(xpathValue))
        throw new Error(`Empty hint for "parent_selector" xpath`)
    }
    //fields skipped already which do not contain xpath or jpath
    else if(this.required(value,"jpath")){
      let jpathValue=value["jpath"]
      if(!!jpathValue && this.isEmpty(jpathValue))
        throw new Error(`Empty hint for "parent_selector" jpath`)

    }
      
  }

  // check syntax for hint 
  private checkSyntaxForHint(hints:any){
    let syntaxErrors:any={}
    for (const [field_name, hint] of Object.entries(hints)) {
      if(["specific_headers","specific_headers_mi=","execute_np_resp_script",
        "execute_tp_resp_script","specific_next_page_headers"].includes(field_name))
          continue
        else{
          for (const [key, value] of Object.entries(hint as object)) {
            if(!SKIP_FIELD_FOR_VALIDATION.includes(key)){
              if((typeof value === 'object') && !this.isEmpty(value)){
                for (const [k, v] of Object.entries(value as object)) {
                  if(!SKIP_FIELD_FOR_VALIDATION.includes(k)){
                    if(typeof v ==="object" && !this.isEmpty(v) ){
                      for (const [f, h] of Object.entries(value as object)){
                        if(!SKIP_FIELD_FOR_VALIDATION.includes(f)){
                          let res=((f==="jpath")) ? this.checkJpathHint(h):this.checkXpathHint(f,h)
                          if (res===false){
                          // if(syntaxErrors?.field_name== undefined)
                          //   syntaxErrors[field_name]={}
                          // if(syntaxErrors?.field_name?.key== undefined)
                          //   syntaxErrors[field_name][key]={}
                          // if(syntaxErrors?.field_name?.key?.k == undefined)
                          //   syntaxErrors[field_name][key][k]={}
                          // syntaxErrors[field_name][key][k][f]=h
                          set(syntaxErrors,syntaxErrors.field_name.key.k.f,h)
                          
                          }
                        }
                      }
                    }
                    else if((typeof v ==='string') && (!this.isEmpty(v))){
                      let res=((k==="jpath")) ? this.checkJpathHint(v):this.checkXpathHint(k,v)
                        if (res===false){
                          console.log(field_name)
                          console.log(syntaxErrors[field_name])
                          if(syntaxErrors?.field_name== undefined)
                            syntaxErrors[field_name]={};
                          console.log(syntaxErrors[field_name][key])
                          if(syntaxErrors?.field_name?.key == undefined)
                            syntaxErrors[field_name][key]={};
                          // console.log(syntaxErrors[field_name][key])
                          // syntaxErrors[field_name][key][k]=v
                          // console.log(syntaxErrors[field_name][key][k])
                          set(syntaxErrors,syntaxErrors[field_name][key][k],v)

                          
                         
                        }   
                    }
                  }
                }   
              }
              else if((typeof value ==='string') && (!this.isEmpty(value))){
                let res=((key==="jpath")) ? this.checkJpathHint(value):this.checkXpathHint(key,value)
                if (res===false){
                  if(syntaxErrors?.field_name == undefined)
                    syntaxErrors[field_name]={}
                    // syntaxErrors[field_name][key]=value
                    set(syntaxErrors,syntaxErrors[field_name][key],value)

                  

               
            }        
              }
            }
          }
     
        }
    }
return syntaxErrors;
  }

 
  //check value for xpath key  and also  regex key
  private checkXpathHint(key:string,value:any){
    if(key ==="regex"){
      if(!!value){
        if(typeof value =="string"){
          if(this.isEmpty(value.match(/\|{2,}/)))
            return true
          else
            return false
        }
        //if value is array then skip validation 
        else
          return true   
      } 
      else
        return false;
    }
    else{
      if(!!value && this.isValidString(value) && this.isValidXpath(value)){
        return true;
      }
       
      else 
        return false;

    }
    

  }
  
  //check value for jpath key 
  private checkJpathHint(str:any):boolean{
    if(!!str && this.isValidString(str) && this.isValidQuotes(str))
      return true
    else {
      console.log("IN JPATH FLASE")
      return false
    }
      
  }

  //validate formatxpath key at srp and mi level
  private validateFormatXpathAtSrpAndMiLevel(obj:any,missingField:string[]){
    for(const[key,value] of Object.entries(obj)){
      if(["parent_selector", "mi1_fields_pattern", "mi2_fields_pattern"].includes(key)){
        for(const[k,v] of Object.entries(value as object)){
          if(k ==="formatxpath" && v.match(/^\/{2}/) && !v.match(/_FIELD_LABEL_/)){
            missingField.push(key)
          }
        }
      }
    }

  }
 

  //helper methods 
  //check if fieldvalue/json/string is empty
  private isEmpty(val: any){
    if(val==null)
      return true
    if(Array.isArray(val) && val.length == 0) {
      return true;
    } else if(Array.isArray(val) && val.length > 0) {
      return false;
    } else if(typeof val=='object' && (Object.keys(val).length === 0)){
      return true;
    } else if(typeof val=='object' && (Object.keys(val).length>0)){
      return false;
    } else if(typeof val == 'string' && val.trim().length==0){
      return true;
    }
    else
      return false;
     
    
  }

  // check if  property is present in given object
  private required(obj:any,property:any):boolean{
    if((!!property) && (typeof property ==='string')  && obj.hasOwnProperty(property))
      return true
    else 
      return false
  }

  //checking valid strings   
  private isValidString(str:string):boolean{
    let isValid=true
    let stack:string[]=[]
    const arr:string[]=[...str]
    let symbols:{[key:string]:string}={"{":"}", "(":")","[":"]"}
    arr.forEach(ch => {
      if(symbols.hasOwnProperty(ch)){
        stack.push(ch)
      } 
      else if(Object.values(symbols).includes(ch)){
           let key = Object.keys(symbols).find((key) => symbols[key] === ch)
            if(key !==stack.pop()){
              isValid=false;
            }
        }  
    });
    if(!isValid || !this.isEmpty(stack)){
      return false
    } 
    else
      return true
    
  }
  
  //valid xpath Expression modify later
  private isValidXpath(str:any):boolean{
    if(!!str && !(this.isEmpty(str.trim().match(/^\/{3,}/))))
      return false
    else
      //code for check with browser
      return true
  }
  
  //check for valid quotes
  private isValidQuotes(str:string):boolean{
    console.log("in is valid string")
    let stack:string[]=[]
    const arr:string[]=[...str]
    let symbols:any={"'":"'",'"':'"'}
    arr.forEach(ch => {
      if(symbols.hasOwnProperty(ch))
        stack.push(ch)   
    });
    if((stack.length & 1) ===1){
      console.log("in false for ",str)
      return false;
    }
    
    else 
      return true;
  }
}

