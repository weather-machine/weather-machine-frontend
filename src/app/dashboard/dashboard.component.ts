import {Component, OnInit, ViewChild} from '@angular/core';
import {Translations} from '../translations.enum';
import {NgForm} from '@angular/forms';
import {GeocoderService} from '../geocoder.service';
import { } from '@types/googlemaps';

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
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  constructor(private geocoder: GeocoderService) {
    /* Hardcoded Wroclaw position */
    this.setPlaceCoordinates(51.1, 17.03333);
  }

  ngOnInit() {
    const mapProperties = {
      center: new google.maps.LatLng(this.placeLat, this.placeLng),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProperties);
  }

  onSubmit(f: NgForm) {
    if (this.isPlaceNameValid()) {
      this.geocoder.geocodeAddress(this.placeName).subscribe(
        data => this.changeLocalization(data),
        error => console.log(error)
      );
    }
  }

  isPlaceNameValid() {
    return this.placeName.length > 1 && this.placeName.length < 255;
  }

  setPlaceCoordinates(placeLat: number, placeLng: number) {
    this.placeLat = placeLat;
    this.placeLng = placeLng;
  }

  changeLocalization(geocodedAddress: any) {
    this.setPlaceCoordinates(geocodedAddress.lat, geocodedAddress.lng);
    this.centerMap();
  }

  centerMap(placeLat: number = this.placeLat, placeLng: number = this.placeLng) {
    this.map.setCenter(new google.maps.LatLng(placeLat, placeLng));
  }
}
