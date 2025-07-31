import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";

import {DetailAnnauaireProComponent} from "./components/detail-annauaire-pro/detail-annauaire-pro.component";
import {DetailOffrePromoComponent} from "./components/detail-offre-promo/detail-offre-promo.component";
import {HomeLayoutComponent} from "./shared/components/layout/home-layout/home-layout.component";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'espace/:id', component: HomeLayoutComponent}, //'espace/Annuaires-des-professionnels' or 'espace/Offres-et-opportunités'...
  // { path: 'espace/:espaceName/detail/:id', component: DetailAnnauaireProComponent},
  { path: 'espace', component: HomeLayoutComponent},
  { path: 'espace/annuaires-des-professionnels/detail/:id', component: DetailAnnauaireProComponent},
  { path: 'espace/offres-et-opportunites/detail/:id', component: DetailOffrePromoComponent},
  // add more specific routes as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
