import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmDirectionModule } from 'agm-direction';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyAaC2njc64M18Md2LzV0AA_Tn-XrFxNwPA' }),
    AgmDirectionModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  providers: [
    GoogleMapsAPIWrapper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
