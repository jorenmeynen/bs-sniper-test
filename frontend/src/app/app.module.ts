import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ApiService } from './services/api.service';

import { AppComponent } from './app.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AddProfilesComponent } from './components/add-profiles/add-profiles.component';
import { CompareScoresComponent } from './containers/compare-scores/compare-scores.component';
import { PlayerCardsComponent } from './components/player-cards/player-cards.component';
import { DataTablesModule } from 'angular-datatables';
import { DecimalPipe } from '@angular/common';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    DashboardComponent,
    NavbarComponent,
    AddProfilesComponent,
    CompareScoresComponent,
    PlayerCardsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgSelectModule,
    FontAwesomeModule,
    DataTablesModule,
    NgxSliderModule
  ],
  providers: [
    ApiService,
    DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
