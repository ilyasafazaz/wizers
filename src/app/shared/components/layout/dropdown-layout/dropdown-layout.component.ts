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

  selectMenu(key: string): void {
    this.menuSelected.emit(key);
  }

  selectMainCategory(id: number): void {
    this.mainCategorySelected.emit(id);
  }

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
