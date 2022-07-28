import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExtractionConfigViewerComponent } from './extraction-config-viewer/extraction-config-viewer.component'
import { NgxJsonViewerComponent } from './json-expaned/json-expaned.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { MatIconModule } from "@angular/material/icon"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { McJsonEditorComponent } from './mc-json-editor/mc-json-editor.component';





@NgModule({
  declarations: [
    AppComponent,
    ExtractionConfigViewerComponent,
    NgxJsonViewerComponent,
    McJsonEditorComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
