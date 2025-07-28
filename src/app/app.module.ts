//PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { SharedModule } from 'primeng/api'; // Needed for templates
///

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { SearchBarComponent } from './shared/components/search-bar/search-bar.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import {HttpClientModule} from "@angular/common/http";
import { CardLayoutComponent } from './shared/components/layout/card-layout/card-layout.component';
import { HeaderBarLayoutComponent } from './shared/components/layout/header-bar-layout/header-bar-layout.component';
import { DropdownLayoutComponent } from './shared/components/layout/dropdown-layout/dropdown-layout.component';
import { DetailAnnauaireProComponent } from './components/detail-annauaire-pro/detail-annauaire-pro.component';
import { DetailOffrePromoComponent } from './components/detail-offre-promo/detail-offre-promo.component';
import {TabMenuModule} from "primeng/tabmenu";
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';
import { DetailHeaderAnnauaireProComponent } from './components/detail-annauaire-pro/detail-header-annauaire-pro/detail-header-annauaire-pro.component';
import { DetailMenuAnnauaireProComponent } from './components/detail-annauaire-pro/detail-menu-annauaire-pro/detail-menu-annauaire-pro.component';
import { DetailSidebarAnnauaireProComponent } from './components/detail-annauaire-pro/detail-sidebar-annauaire-pro/detail-sidebar-annauaire-pro.component';
import { HomeLayoutComponent } from './shared/components/layout/home-layout/home-layout.component';
import { FilterSidebarComponent } from './shared/components/layout/filter-sidebar/filter-sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SearchBarComponent,
    CardLayoutComponent,
    HeaderBarLayoutComponent,
    DropdownLayoutComponent,
    DetailAnnauaireProComponent,
    DetailOffrePromoComponent,
    BreadcrumbComponent,
    DetailHeaderAnnauaireProComponent,
    DetailMenuAnnauaireProComponent,
    DetailSidebarAnnauaireProComponent,
    HomeLayoutComponent,
    FilterSidebarComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    //PrimeNG
    ButtonModule,
    InputTextModule,
    CardModule,
    DropdownModule,
    SharedModule,
    TabMenuModule,
    //Material

  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
