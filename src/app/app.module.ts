import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import {
  HammerModule,
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG,
  BrowserModule,
} from '@angular/platform-browser';
import { ApprouteModule } from './approute.module';
import { ComponentModule } from './modules/component.module';
import { LayoutModule } from './layout/layoutRouter.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as Hammer from 'hammerjs';
import { authservice } from './auth-guard/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  override overrides = <any>{
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    ApprouteModule,
    LayoutModule,
    HammerModule,
    HttpClientModule, BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http)
        },
        deps: [HttpClient]
      }
    }),

  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
    authservice,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
