import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Card {
  id: number;
  picture: string;
  slides?: string[];
  theme: string;
  name: string;
  telephone: string;
  email: string;
  rating: number;
  isFavorite: boolean;
  description: string;
}

@Component({
  selector: 'app-detail-sidebar-annauaire-pro',
  templateUrl: './detail-sidebar-annauaire-pro.component.html',
  styleUrls: ['./detail-sidebar-annauaire-pro.component.scss']
})
export class DetailSidebarAnnauaireProComponent {
  @Input() isExpanded: boolean = false;
  @Input() activeSidebarItem: string | null = null;
  @Input() currentCard: Card | null = null;
  @Output() sidebarItemChange = new EventEmitter<string>();

  selectItem(item: string): void {
    this.sidebarItemChange.emit(item);
  }
}