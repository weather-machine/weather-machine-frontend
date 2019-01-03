import { Component, OnInit } from '@angular/core';
import {Translations} from '../translations.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  translations = Translations;

  /* Hardcoded lat && lng for Wrocław */
  lat = 51.1;
  lng = 17.03333;

  constructor() { }

  ngOnInit() {
  }

}
