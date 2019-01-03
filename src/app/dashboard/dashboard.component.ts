import { Component, OnInit } from '@angular/core';
import {Translations} from '../translations.enum';
import {NgForm} from '@angular/forms';
import {GeocoderService} from '../geocoder.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  translations = Translations;

  placeName: string;
  placeLat: number;
  placeLng: number;

  constructor(private geocoder: GeocoderService) {
    /* Hardcoded Wroclaw position */
    this.setPlaceCoordinates(51.1, 17.03333);
  }

  ngOnInit() {
  }

  onSubmit(f: NgForm) {
    if (this.isPlaceNameValid()) {
      console.log(this.placeName);
      const geocodedAddress = this.geocoder.geocodeAddress(this.placeName);
      this.setPlaceCoordinates(geocodedAddress.lat, geocodedAddress.lng);
    }
  }

  isPlaceNameValid() {
    return this.placeName.length > 1 && this.placeName.length < 255;
  }

  setPlaceCoordinates(placeLat: number, placeLng: number) {
    this.placeLat = placeLat;
    this.placeLng = placeLng;
  }

}
