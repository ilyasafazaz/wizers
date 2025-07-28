import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  showMore = false;

  constructor(private router: Router) {}

  mainBlocks = [
    'Annuaires des professionnels',
    'Offres et Opportunités',
    'Evénements et Actualités',
    'Informations Pratiques',
    'Espace Communautaire',
    'Toujours Actifs',
  ];

  moreBlocks = [
    'Block 1',
    'Block 2',
  ];

  getIcon(index: number): string {
    const icons = [
      'pi-id-card',
      'pi-briefcase',
      'pi-calendar',
      'pi-info-circle',
      'pi-comments',
      'pi-bolt',
    ];
    return icons[index] || 'pi-box';
  }

  navigateToEspace(): void {
    this.router.navigate(['/espace']);
  }
}