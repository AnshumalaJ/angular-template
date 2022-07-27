import { Component, OnInit } from '@angular/core';



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
        "param": "page=",
        "increment": 1
      },
      "heading_selector": {
        "xpath": "//h3[@class='product-card-details__title']/text()",
        "type": 2
      },
      "mi_selector": {
        "xpath": "//a[@class='js-click-handler listing-fpa-link tracking-standard-link']",
        "type": 4,
        "regex": "(.*)\\?"
      },
      "parent_selector": {
        "xpath": "//li[@class='search-page__result']/article[@class='product-card ']",
        "type": 2
      },
      "target_fields": {
        "id": {
          "xpath": "//a[contains(@class,'listing-fpa-link')]/@href",
          "type": 2,
          "regex": "car-details\\/(.*)\\?"
        },
        "year": {
          "xpath": "//li[contains(text(),'reg')]",
          "type": 2
        },
        "miles": {
          "xpath": "//li[contains(text(),'miles')]",
          "type": 2
        },
        "photo_link": {
          "xpath": "//img[contains(@class,'product-card-image')]",
          "type": 2
        },
        "price": {
          "xpath": "//div[contains(@class,'price')] ",
          "price_from_container": {
            "xpath": "//div[contains(@class,'price')]/span "
          },
          "type": 2
        },
        "car_seller_name": {
          "xpath": "//h3[contains(@class,'seller-info__name')]",
          "type": 2
        }
      },
      "mi_fields": {
        "make": {
          "jpath": "vehicle.make",
          "type": 2
        },
        "model": {
          "jpath": "vehicle.model",
          "type": 2
        },
        "photo_links": {
          "jpath": "$.advert.images..src",
          "type": 2,
          "multivalued": 1,
          "separator": "|",
          "transformations": [
            [
              "/{resize}",
              ""
            ],
            [
              ",",
              "|"
            ]
          ]
        },
        "seller_comments": {
          "jpath": "advert.description",
          "type": 2
        },
        "photo_link": {
          "jpath": "advert.mainImageUrl",
          "type": 2,
          "transformations": [
            [
              "/{resize}",
              ""
            ]
          ]
        },
        "trim": {
          "jpath": "vehicle.trim",
          "type": 2
        },
        "year": {
          "jpath": "vehicle.year",
          "type": 2
        },
        "body_type": {
          "jpath": "vehicle.keyFacts.body-type",
          "type": 2
        },
        "doors": {
          "jpath": "vehicle.keyFacts.doors",
          "type": 2
        },
        "fuel_type": {
          "jpath": "pageData.tracking.fuel_type",
          "type": 2
        },
        "stock_no": {
          "jpath": "advert.stockRevisionNumber",
          "type": 2
        },
        "miles": {
          "jpath": "vehicle.keyFacts.mileage",
          "type": 2
        },
        "price": {
          "jpath": "advert.price",
          "type": 2
        },
        "car_seller_name": {
          "jpath": "seller.name",
          "type": 2
        },
        "car_county": {
          "jpath": "seller.location.county",
          "type": 2
        },
        "car_state": {
          "jpath": "seller.location.region",
          "type": 2
        },
        "car_zip": {
          "jpath": "seller.location.postcode",
          "type": 2
        },
        "car_street": {
          "jpath": "seller.location.addressOne",
          "type": 2
        },
        "car_address": {
          "jpath": "seller.primaryContactNumber",
          "type": 2
        },
        "transmission": {
          "jpath": "vehicle.keyFacts.transmission",
          "type": 2
        },
        "co2_emissions": {
          "jpath": "vehicle.co2Emissions",
          "type": 2
        },
        "registration_no": {
          "jpath": "vehicle.vrm",
          "type": 2
        },
        "vehicle_registration_date": {
          "jpath": "vehicle.keyFacts.manufactured-year",
          "type": 2
        },
        "engine_size": {
          "jpath": "vehicle.keyFacts.engine-size",
          "type": 2
        },
        "heading": {
          "jpath": "advert.title",
          "type": 2
        },
        "seller_email": {
          "jpath": "seller.emailAddress",
          "type": 2
        },
        "seller_phone": {
          "jpath": "seller.primaryContactNumber"
        },
        "car_latitude": {
          "jpath": "seller.latitude",
          "type": 2
        },
        "car_longitude": {
          "jpath": "seller.longitude",
          "type": 2
        },
        "num_owners": {
          "jpath": "vehicle.keyFacts.owners",
          "type": 2
        },
        "seating_capacity": {
          "jpath": "vehicle.keyFacts.seats",
          "type": 2
        },
        "website_id": {
          "jpath": "seller.dealerWebsite",
          "type": 2
        },
        "car_city": {
          "jpath": "seller.location.town",
          "type": 2
        }
      }
    }
  }
  
  


  constructor() { 
  // console.log(NgxJsonViewerComponent.arguments)
  
  }
 
  ngOnInit(): void {
  
  }
  

}




