import {Component, OnInit, ViewChild} from '@angular/core';
import {Translations} from '../translations.enum';
import {NgForm} from '@angular/forms';
import {GeocoderService} from '../geocoder.service';
import {RestService} from '../rest.service';
import {WeatherIconType} from '../weather-icon-type.enum';
import {WeatherTileType} from '../weather-tile-type.enum';
// import {} from '@types/googlemaps';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  translations = Translations;
  weatherIconType = WeatherIconType;
  weatherTileType = WeatherTileType;
  placeName: string;
  placeLat: number;
  placeLng: number;
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  marker: google.maps.Marker;

  constructor(private geocoder: GeocoderService, private restService: RestService) {
    /* Hardcoded Wroclaw position */
    this.setPlaceCoordinates(51.1, 17.03333);
  }

  ngOnInit() {
    const mapProperties = {
      center: new google.maps.LatLng(this.placeLat, this.placeLng),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProperties);
    this.initializeMapsClickWatcher();

    // it should be moved
    // this.getForecastForPlace();
  }

  onSubmit(f: NgForm) {
    if (this.isPlaceNameValid()) {
      this.geocoder.geocodeAddress(this.placeName).subscribe(
        data => this.changeLocalization(data, true),
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

  changeLocalization(geocodedAddress: any, refreshMarker: boolean = false, centerMap: boolean = true, placeName: string = null) {
    if (placeName) {
      this.placeName = placeName;
    }
    this.setPlaceCoordinates(geocodedAddress.lat, geocodedAddress.lng);
    if (centerMap) {
      this.centerMap();
    }
    if (refreshMarker || !this.marker) {
      this.initializeMarker(geocodedAddress.lat, geocodedAddress.lng);
    }
  }

  centerMap(placeLat: number = this.placeLat, placeLng: number = this.placeLng) {
    this.map.setCenter(new google.maps.LatLng(placeLat, placeLng));
  }

  initializeMarker(placeLat: number = this.placeLat, placeLng: number = this.placeLng) {
    this.removeMarker();
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(placeLat, placeLng),
      map: this.map,
      title: this.translations.MAP_MARKER_TITLE,
      draggable: true,
      animation: google.maps.Animation.DROP
    });
    this.initializeMarkerWatcher();
  }

  removeMarker(marker: google.maps.Marker = this.marker) {
    if (marker) {
      marker.setMap(null);
    }
  }

  initializeMarkerWatcher(marker: google.maps.Marker = this.marker) {
    const self = this;
    google.maps.event.addListener(marker, 'dragend', function() {
      const position = marker.getPosition();
      self.geocoder.geocodeLatLng(position).subscribe(
        data => self.changeLocalization({
            lat: position.lat(),
            lng: position.lng()
          },
          false,
          false,
          // @ts-ignore
          data.formattedPlaceName),
        error => console.log(error)
      );
    });
  }

  initializeMapsClickWatcher(map: google.maps.Map = this.map) {
    const self = this;
    google.maps.event.addListener(map, 'click', function(event) {
      self.changeLocalization({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      }, false, false);
    });
  }

  getForecastForPlace() {
    this.restService.getForecastForPlace().subscribe(
      data => console.log(data),
      error => console.log(error)
    );
  }
}
