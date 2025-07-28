import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dropdown-layout',
  templateUrl: './dropdown-layout.component.html',
  styleUrls: ['./dropdown-layout.component.scss']
})
export class DropdownLayoutComponent {
  @Input() showDropdown: boolean = false;
  @Input() espaceData: any = null;
  @Input() selectedMenuKey: string | null = null;
  @Input() selectedMainCategoryId: number | null = null;
  @Input() selectedSubCategory: string | null = null;
  @Input() currentEspaceId: string = '';

  @Output() menuSelected = new EventEmitter<string>();
  @Output() mainCategorySelected = new EventEmitter<number>();
  @Output() subCategorySelected = new EventEmitter<string>();
  @Output() closeSubDropdown = new EventEmitter<void>();

  constructor(private router: Router) {}

  get currentMainCategory() {
    if (
      this.selectedMenuKey &&
      this.selectedMainCategoryId !== null &&
      this.espaceData?.menus?.[this.selectedMenuKey]
    ) {
      return this.espaceData.menus[this.selectedMenuKey].find((cat: any) => cat.id === this.selectedMainCategoryId);
    }
    return null;
  }

  // Modified: Only visual selection, no content change
  selectMenu(key: string): void {
    // Only emit for visual state change, don't change content
    this.menuSelected.emit(key);
  }

  // Modified: Only visual selection, no content change
  selectMainCategory(id: number): void {
    // Only emit for visual state change, don't change content
    this.mainCategorySelected.emit(id);
  }

  // This is the only method that should change content
  selectSubCategory(subCategory: string): void {
    this.subCategorySelected.emit(subCategory);
  }

  closeDropdown(): void {
    this.closeSubDropdown.emit();
  }

  // Method to handle card click navigation in dropdown
  onCardClick(cardId: number): void {
    this.router.navigate(['/espace', this.currentEspaceId, 'detail', cardId]);
  }

  getPromoCards(): any[] {
    if (!this.currentMainCategory) return [];

    if (this.selectedSubCategory &&
      this.currentMainCategory.subCategoryCards &&
      this.currentMainCategory.subCategoryCards[this.selectedSubCategory]) {
      return this.currentMainCategory.subCategoryCards[this.selectedSubCategory];
    }

    return this.currentMainCategory.cards || [];
  }

  getSubCategories(): string[] {
    if (!this.currentMainCategory?.sub_categories) return [];

    const subCategories = this.currentMainCategory.sub_categories;
    return subCategories;
  }

  // TrackBy function for better performance
  trackByIndex(index: number, item: any): number {
    return index;
  }
}