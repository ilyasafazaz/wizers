import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../../../services/data.service';

export interface Card {
  id: number;
  picture: string;
  slides?: string[]; // Added optional slides property
  theme: string;
  name: string;
  telephone: string;
  email: string;
  rating: number; // 1-5 stars
  isFavorite: boolean;
  espace?: string; // Add espace identifier
}

@Component({
  selector: 'app-card-layout',
  templateUrl: './card-layout.component.html',
  styleUrls: ['./card-layout.component.scss']
})
export class CardLayoutComponent {
  @Input() hideContacts: boolean = false;
  @Input() hideEspaceAndTheme: boolean = false; // New input to hide espace and theme
  @Input() cards: Card[] = [];
  @Input() currentEspaceId: string = '';
  @Output() cardClick = new EventEmitter<number>();

  espaceIcons: { [key: string]: string } = {
    'annuaires-des-professionnels': 'pi-id-card',
    'offres-et-opportunites': 'pi-briefcase',
    'evenements-et-actualites': 'pi-calendar',
    'informations-pratiques': 'pi-info-circle',
    'espace-communautaire': 'pi-comments',
    'toujours-actifs': 'pi-bolt'
  };

  constructor(private dataService: DataService) {}

  toggleFavorite(card: Card, event: Event): void {
    event.stopPropagation(); // Prevent card click navigation
    card.isFavorite = !card.isFavorite;
  }

  onCardClick(card: Card): void {
    this.cardClick.emit(card.id);
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  isStarFilled(star: number, rating: number): boolean {
    return star <= rating;
  }

  getEspaceIcon(espaceId: string): string {
    return this.espaceIcons[espaceId] || 'pi-question-circle';
  }
}
