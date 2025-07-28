import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-detail-sidebar-annauaire-pro',
  templateUrl: './detail-sidebar-annauaire-pro.component.html',
  styleUrls: ['./detail-sidebar-annauaire-pro.component.scss']
})
export class DetailSidebarAnnauaireProComponent {
  @Input() isExpanded: boolean = false;
  @Input() activeSidebarItem: string | null = null;
  @Output() sidebarItemChange = new EventEmitter<string>();

  onSidebarItemClick(item: string): void {
    this.sidebarItemChange.emit(item);
  }
}
