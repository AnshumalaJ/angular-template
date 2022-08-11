import { Component, OnInit } from '@angular/core';
import { SeedGroupHintValidator } from '../validator/seed-group-hint-validator';



@Component({
  selector: 'app-extraction-config-viewer',
  templateUrl: './extraction-config-viewer.component.html',
  styleUrls: ['./extraction-config-viewer.component.css']
})
export class ExtractionConfigViewerComponent implements OnInit {

  // @Input rowClasses =[ 'segment-type-boolean' ,'segment-type-string','segment-type-number']

  
  
 

  data ={
    "groupHints": {
      "paginator_config": {
        "param": "pageNumber=",
        "increment": 1
      },
      "parent_selector": {
        "xpath": "//div[contains{{{}}}}}}}}}}}}(@class,'item-container')]",
        "type": 2,
        "formatxpath": "//b[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'), '_FIELD_LABEL_')]//following-sibling::text()"
      },
      "heading_selector": {
        "xpath": "//div{{{[contains(@class,'inv-item-name')]",
        "type": 2
      },
      "mi_selector": {
        "xpath": "//div[contains(@class,'inv-item-image')]/a",
        "type": 4
      },
      "expected_count_selector": {
        "xpath": "//div[contains(@id,'inv-list-table_info')]",
        "type": 2
      },
      "target_fields": {
        "price": {
          "xpath": "//div[@class='inv-item-price']",
          "type": 2
        }
      },
      "mi_fields": {
        "condition": {
          "jpath": "$..condition'.desc",
          "type": 2
        },
        "make": {
          "jpath": "$..general.manufacturer.desc",
          "type": 2
        },
        "body_type": {
          "jpath": "$..general.category'.desc",
          "type": 2
        },
        "body_subtype": {
          "jpath": "$..general.subcategory.desc",
          "type": 2
        },
        "trim": {
          "jpath": "$..general.trim.desc",
          "type": 2
        },
        "engine_size": {
          "jpath": "$..engine.engineSize.desc",
          "type": 2
        },
        "cylinders": {
          "jpath": "$..engine.cylinders.desc",
          "type": 2
        },
        "fuel_type": {
          "jpath": "$..engine.fuelType.desc",
          "type": 2
        },
        "doors": {
          "jpath": "$..operational.doors.desc",
          "type": 2
        },
        "exterior_color": {
          "jpath": "$..body.exteriorColor.desc",
          "type": 2
        },
        "interior_color": {
          "jpath": "$..body.interiorColor.desc",
          "type": 2
        },
        "photo_links": {
          "jpath": "$..images",
          "type": 5
        },
        "photo_link": {
          "jpath": "$..image",
          "type": 5
        },
        "vin": {
          "jpath": "$..general.identification.desc",
          "type": 2
        },
        "miles": {
          "jpath": "$..general.odometer.desc",
          "type": 2
        },
        "msrp": {
          "jpath": "$..general.msrp.desc",
          "type": 2
        },
        "stock_no": {
          "jpath": "$..general.'stockNumber'.desc",
          "type": 2
        },
        "year": {
          "jpath": "$..general.year'.desc",
          "type": 2
        },
        "seller_comments": {
          "jpath": "$..general.description.desc",
          "type": 2
        },
        "model": {
          "jpath": "$..general.model.desc",
          "type": 2
        },
        "price": {
          "jpath": "$..general.msrp.'desc",
          "type": 2
        }
      }
    }
  }


  
  


  constructor() { 
  // console.log(NgxJsonViewerComponent.arguments)
  
  }
 
  ngOnInit(): void {
     let validator= new SeedGroupHintValidator();
    console.log(validator.validate(this.data))
  
  }
  

}




