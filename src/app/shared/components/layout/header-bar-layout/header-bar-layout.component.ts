import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PageLink } from '../../../../services/data.service';

@Component({
  selector: 'app-header-bar-layout',
  templateUrl: './header-bar-layout.component.html',
  styleUrls: ['./header-bar-layout.component.scss']
})
export class HeaderBarLayoutComponent {
  @Input() mainPages: PageLink[] = [];
  @Input() morePages: PageLink[] = [];
  @Input() currentId: string = '';
  @Input() showDropdown: boolean = false;
  @Input() showMore: boolean = false;

  @Output() navClick = new EventEmitter<string>();
  @Output() toggleMore = new EventEmitter<boolean>();

  handleNavClick(id: string): void {
    // Only handle dropdown toggle, no routing or content changes
    // If clicking the same item that's already active, toggle dropdown
    if (this.currentId === id) {
      this.navClick.emit('toggle'); // Just toggle the dropdown
    } else {
      // If clicking a different item, show its dropdown
      this.navClick.emit(id);
    }
  }

  toggleShowMore(): void {
    this.showMore = !this.showMore;
    this.toggleMore.emit(this.showMore);
  }
}
