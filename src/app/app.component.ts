import { Component } from '@angular/core';
import {Translations} from './enums/translations.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'weather-machine-frontend';
  translations = Translations;
}
