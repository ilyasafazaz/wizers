import { Component } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  selectedCategory: string = '';
  categories: string[] =
    [
    'Annuaires des professionnels',
    'Offres et Opportunités',
    'Evénements et Actualités',
    'Informations Pratiques',
    'Espace Communautaire',
    'Toujours Actifs',
    ];
}
