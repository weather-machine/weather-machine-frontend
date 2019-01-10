import {Component, OnInit, ViewChild} from '@angular/core';
import {Translations} from '../enums/translations.enum';
import {NgForm} from '@angular/forms';
import {GeocoderService} from '../services/geocoder.service';
import {RestService} from '../services/rest.service';
import {WeatherTileType} from '../enums/weather-tile-type.enum';
import {WeatherDecisionService} from '../services/weather-decision.service';
// import {} from '@types/googlemaps';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  translations = Translations;
  weatherTileType = WeatherTileType;
  placeName: string;
  countryName: string;
  placeLat: number;
  placeLng: number;
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  marker: google.maps.Marker;

  weatherCurrent = null;
  weatherCurrentIcon = null;
  weatherNight = null;
  weatherNightIcon = null;
  weatherTomorrow = null;
  weatherTomorrowIcon = null;
  weatherHourly = null;
  weatherDaily = null;

  loading = false;

  constructor(private geocoder: GeocoderService, private restService: RestService, private decisionService: WeatherDecisionService) {
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

  changeLocalization(geocodedAddress: any, refreshMarker: boolean = false,
                     centerMap: boolean = true, placeName: string = null) {
    this.resetWeathers();
    if (placeName) {
      this.placeName = placeName;
    }
    this.countryName = geocodedAddress.country;
    this.setPlaceCoordinates(geocodedAddress.lat, geocodedAddress.lng);
    if (centerMap) {
      this.centerMap();
    }
    if (refreshMarker || !this.marker) {
      this.initializeMarker(geocodedAddress.lat, geocodedAddress.lng);
    }
    this.getForecastForPlace();
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
            lng: position.lng(),
            // @ts-ignore
            country: data.sourceCountry,
          },
          false,
          false,
          // @ts-ignore
          data.sourcePlaceName),
        error => console.log(error)
      );
    });
  }

  initializeMapsClickWatcher(map: google.maps.Map = this.map) {
    const self = this;
    google.maps.event.addListener(map, 'click', function(event) {
      const position = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
      self.geocoder.geocodeLatLng(position).subscribe(
        data => self.changeLocalization({
            lat: position.lat(),
            lng: position.lng(),
            // @ts-ignore
            country: data.sourceCountry
          },
          false,
          false,
          // @ts-ignore
          data.sourcePlaceName),
        error => console.log(error)
      );
    });
  }

  // normalize() is not supported by IE
  getFormattedString(text: string, maxLength: number): string {
    let result = '';

    try {
      result = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0141-\u0142]/g, 'l').slice(0, maxLength);
    } catch (error) {}

    return result;
  }

  getForecastForPlace(numberOfCurrentTry: number = 0, maxRetryNumber: number = 5) {
    const place = {
      Latitude: this.placeLat,
      Longitude: this.placeLng,
      Name: this.getFormattedString(this.placeName, 255),
      Country: this.getFormattedString(this.countryName, 10)
    };

    this.loading = true;
    this.restService.getForecastForPlace(place).subscribe(
      data => {
        // @ts-ignore
        if (data.hasOwnProperty('status') && data.status === 'place added'
          && numberOfCurrentTry < maxRetryNumber) {
          // waiting for forecasts
          setTimeout( () => {
            this.getForecastForPlace(++numberOfCurrentTry);
          }, this.restService.pullingIntervalDelay);
        // @ts-ignore
        } else if (data.hasOwnProperty('status') && data.status === 'place added'
          && numberOfCurrentTry === maxRetryNumber) {
          // to many tries
          console.log('to many tries');
        } else {
          // forecasts are correct
          console.log('forecast are correct');
          this.bindWeather(data);
        }
      },
      error => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  bindWeather(data: any) {
    for (let i = 0; i < data.length; i++) {
      data[i].LocalDate = this.convertUTCDateToLocalDate(new Date(data[i].Date));
      if (data[i].Main === 'unknown') {
        data[i].Main = this.decisionService.getMainDesc(this.decisionService.classifyWeatherIconType(
          data[i].LocalDate, data[i].Cloud_cover, data[i].Humidity_percent, data[i].Temperature, data[i].Wind_speed
        ));
      }
      data[i].Direction_degree = this.decisionService.getWindDirectionDegree(data[i].Direction);
    }
    this.weatherCurrent = data[0];
    this.weatherCurrentIcon = this.decisionService.classifyWeatherIconType(
      data[0].LocalDate, data[0].Cloud_cover, data[0].Humidity_percent, data[0].Temperature, data[0].Wind_speed
    );
    this.weatherNight = data[25];
    this.weatherNightIcon = this.decisionService.classifyWeatherIconType(
      data[25].LocalDate, data[25].Cloud_cover, data[25].Humidity_percent, data[25].Temperature, data[25].Wind_speed, true
    );
    data[26].LocalDate.setHours(12);
    data[26].weatherIcon = this.decisionService.classifyWeatherIconType(
      data[26].LocalDate, data[26].Cloud_cover, data[26].Humidity_percent, data[26].Temperature, data[26].Wind_speed
    );
    this.weatherTomorrow = data[26];
    this.weatherTomorrowIcon = data[26].weatherIcon;
    this.weatherHourly = [];
    for (let i = 1; i < 25; i++) {
      data[i].weatherIcon = this.decisionService.classifyWeatherIconType(
        data[i].LocalDate, data[i].Cloud_cover, data[i].Humidity_percent, data[i].Temperature, data[i].Wind_speed
      );
      this.weatherHourly.push(data[i]);
    }
    this.weatherDaily = [];
    for (let i = 27; i < data.length; i++) {
      data[i].LocalDate.setHours(12);
      data[i].weatherIcon = this.decisionService.classifyWeatherIconType(
        data[i].LocalDate, data[i].Cloud_cover, data[i].Humidity_percent, data[i].Temperature, data[i].Wind_speed
      );
      this.weatherDaily.push(data[i]);
    }

    this.loading = false;
  }

  resetWeathers() {
    this.weatherCurrent = null;
    this.weatherCurrentIcon = null;
    this.weatherNight = null;
    this.weatherNightIcon = null;
    this.weatherTomorrow = null;
    this.weatherTomorrowIcon = null;
    this.weatherHourly = null;
    this.weatherDaily = null;

    this.loading = false;
  }

  convertUTCDateToLocalDate(date): Date {
    const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    const offset = date.getTimezoneOffset() / 60;
    const hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
  }
}
