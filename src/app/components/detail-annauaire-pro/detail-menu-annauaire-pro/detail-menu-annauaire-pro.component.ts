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
      // Don't reset the menu or emit changes when just toggling dropdown
      // The content should remain the same if there's a selected submenu
    } else {
      // If clicking different menu, switch to it and show dropdown
      this.activeMenu = menu;
      this.showDropdown = true;
      // Don't clear selectedSubmenu or emit changes when just switching menus
      // Only emit changes when actually selecting a submenu
    }
  }

  selectSubmenu(submenu: string): void {
    this.selectedSubmenu = submenu;
    this.showDropdown = false;
    
    // Only emit the change when a submenu is actually selected
    this.emitChange();
  }

  private emitChange(): void {
    // Only emit if we have a valid submenu selection
    if (this.selectedSubmenu) {
      this.menuChange.emit({
        menu: this.activeMenu,
        submenu: this.selectedSubmenu
      });
    }
  }
}