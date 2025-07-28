import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-detail-menu-annauaire-pro',
  templateUrl: './detail-menu-annauaire-pro.component.html',
  styleUrls: ['./detail-menu-annauaire-pro.component.scss']
})
export class DetailMenuAnnauaireProComponent {
  activeMenu: string = 'about';
  @Output() menuChange = new EventEmitter<string>();

  setActiveMenu(menu: string): void {
    this.activeMenu = menu;
    this.menuChange.emit(menu);
  }
}
