import { Component, EventEmitter, Output } from '@angular/core';

export interface MenuSelection {
  menu: string;
  submenu: string;
}

@Component({
  selector: 'app-detail-menu-annauaire-pro',
  templateUrl: './detail-menu-annauaire-pro.component.html',
  styleUrls: ['./detail-menu-annauaire-pro.component.scss']
})
export class DetailMenuAnnauaireProComponent {
  activeMenu: string = '';
  selectedSubmenu: string = '';
  showDropdown: boolean = false;
  
  @Output() menuChange = new EventEmitter<MenuSelection>();

  toggleMenu(menu: string): void {
    if (this.activeMenu === menu) {
      // If clicking the same menu, toggle dropdown
      this.showDropdown = !this.showDropdown;
      if (!this.showDropdown) {
        this.activeMenu = '';
        this.selectedSubmenu = '';
        this.emitChange();
      }
    } else {
      // If clicking different menu, switch to it and show dropdown
      this.activeMenu = menu;
      this.showDropdown = true;
      this.selectedSubmenu = '';
      this.emitChange();
    }
  }

  selectSubmenu(submenu: string): void {
    this.selectedSubmenu = submenu;
    this.showDropdown = false;
    this.emitChange();
  }

  private emitChange(): void {
    this.menuChange.emit({
      menu: this.activeMenu,
      submenu: this.selectedSubmenu
    });
  }
}