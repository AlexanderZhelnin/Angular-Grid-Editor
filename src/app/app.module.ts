import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SafeGridAreaPipe } from './grid/grid/pipes/grid-area.Pipe';
import { SafeGridTemplatePipe } from './grid/grid/pipes/grid-template.Pipe';
import { GridComponent } from './grid/grid/grid.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    SafeGridTemplatePipe,
    SafeGridAreaPipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
