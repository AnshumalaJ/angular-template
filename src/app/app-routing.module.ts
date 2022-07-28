import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtractionConfigViewerComponent } from './extraction-config-viewer/extraction-config-viewer.component';
import { NgxJsonViewerComponent } from './json-expaned/json-expaned.component';
import { McJsonEditorComponent } from './mc-json-editor/mc-json-editor.component';

const routes: Routes = [
  { path:'',component: ExtractionConfigViewerComponent },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
