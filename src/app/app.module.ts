import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RestService} from './services/rest.service';
import { WeatherTileComponent } from './weather-tile/weather-tile.component';
import { WeatherTileIconComponent } from './weather-tile-icon/weather-tile-icon.component';

import { NgxLoadingModule } from 'ngx-loading';

const appRoutes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'info', component: AboutComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ContactComponent,
    AboutComponent,
    WeatherTileComponent,
    WeatherTileIconComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes
    ),
    HttpClientModule,
    NgxLoadingModule.forRoot({
      primaryColour: '#3F51B5',
      secondaryColour: '#2196F3',
      tertiaryColour: '#03A9F4',
      backdropBorderRadius: '8px'
    }),
  ],
  providers: [RestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
