import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  IonicRouteStrategy,
  IonApp,
  IonRouterOutlet,
  provideIonicAngular
} from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],

  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,

    IonApp,
    IonRouterOutlet
  ],

  providers: [
    provideIonicAngular(),
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }
  ],

  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}