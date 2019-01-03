import { Component } from '@angular/core';
import {Translations} from './translations.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wheather-machine-frontend';
  translations = Translations;
}
