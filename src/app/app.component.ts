import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

import { 
  logOutOutline, 
  add, 
  arrowBack, 
  personCircle, 
  videocam,
  close
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    addIcons({ logOutOutline, add, arrowBack, personCircle, videocam, close });
    }
}
