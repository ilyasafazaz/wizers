import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { EspaceData, FilterOptions } from '../home-layout/home-layout.component';

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.scss']
})
export class FilterSidebarComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() allEspaces: EspaceData[] = [];
  @Input() filters: FilterOptions = {
    selectedEspace: '',
    selectedMenu: '',
    selectedMainCategory: '',
    selectedSubCategory: ''
  };

  @Output() filtersChanged = new EventEmitter<FilterOptions>();
  @Output() closeSidebar = new EventEmitter<void>();

  localFilters: FilterOptions = {
    selectedEspace: '',
    selectedMenu: '',
    selectedMainCategory: '',
    selectedSubCategory: ''
  };

  espaceOptions: DropdownOption[] = [];
  menuOptions: DropdownOption[] = [];
  mainCategoryOptions: DropdownOption[] = [];
  subCategoryOptions: DropdownOption[] = [];

  ngOnInit(): void {
    this.initializeOptions();
    this.localFilters = { ...this.filters };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['allEspaces'] && this.allEspaces.length > 0) {
      this.initializeOptions();
    }
    if (changes['filters']) {
      this.localFilters = { ...this.filters };
      this.updateDependentOptions();
    }
  }

  private initializeOptions(): void {
    // Initialize espace options
    this.espaceOptions = this.allEspaces.map(espace => ({
      label: espace.title,
      value: espace.id
    }));

    // Initialize all possible menus from all espaces
    this.initializeAllMenuOptions();

    // Initialize all possible main categories from all espaces
    this.initializeAllMainCategoryOptions();

    this.updateDependentOptions();
  }

  private initializeAllMenuOptions(): void {
    const allMenus = new Set<string>();

    this.allEspaces.forEach(espace => {
      if (espace.data?.menus) {
        if (espace.data.menuOrder) {
          espace.data.menuOrder.forEach((menu: string) => allMenus.add(menu));
        } else {
          Object.keys(espace.data.menus).forEach(menu => allMenus.add(menu));
        }
      }
    });

    // If no espace is selected, show all available menus
    if (!this.localFilters.selectedEspace) {
      this.menuOptions = Array.from(allMenus).map(menu => ({
        label: menu,
        value: menu
      }));
    }
  }

  private initializeAllMainCategoryOptions(): void {
    const allCategories = new Set<string>();

    this.allEspaces.forEach(espace => {
      if (espace.data?.menus) {
        Object.values(espace.data.menus).forEach((menuData: any) => {
          if (Array.isArray(menuData)) {
            menuData.forEach((category: any) => {
              if (category.main_category) {
                allCategories.add(category.main_category);
              }
            });
          }
        });
      }
    });

    // If no espace and menu are selected, show all categories
    if (!this.localFilters.selectedEspace && !this.localFilters.selectedMenu) {
      this.mainCategoryOptions = Array.from(allCategories).map(category => ({
        label: category,
        value: category
      }));
    }
  }

  private updateDependentOptions(): void {
    this.updateMenuOptions();
    this.updateMainCategoryOptions();
    this.updateSubCategoryOptions();
  }

  private updateMenuOptions(): void {
    if (this.localFilters.selectedEspace) {
      // Show menus only for selected espace
      const selectedEspace = this.allEspaces.find(e => e.id === this.localFilters.selectedEspace);
      if (selectedEspace?.data?.menus) {
        if (selectedEspace.data.menuOrder) {
          this.menuOptions = selectedEspace.data.menuOrder.map((menu: string) => ({
            label: menu,
            value: menu
          }));
        } else {
          const menus = Object.keys(selectedEspace.data.menus);
          this.menuOptions = menus.map(menu => ({
            label: menu,
            value: menu
          }));
        }
      } else {
        this.menuOptions = [];
      }
    } else {
      // Show all menus from all espaces
      this.initializeAllMenuOptions();
    }
  }

  private updateMainCategoryOptions(): void {
    if (this.localFilters.selectedEspace && this.localFilters.selectedMenu) {
      // Show categories for selected espace and menu
      const selectedEspace = this.allEspaces.find(e => e.id === this.localFilters.selectedEspace);
      if (selectedEspace?.data?.menus?.[this.localFilters.selectedMenu]) {
        const categories = new Set<string>();
        const menuData = selectedEspace.data.menus[this.localFilters.selectedMenu];

        if (Array.isArray(menuData)) {
          menuData.forEach((category: any) => {
            if (category.main_category) {
              categories.add(category.main_category);
            }
          });
        }

        this.mainCategoryOptions = Array.from(categories).map(category => ({
          label: category,
          value: category
        }));
      } else {
        this.mainCategoryOptions = [];
      }
    } else if (this.localFilters.selectedMenu && !this.localFilters.selectedEspace) {
      // Show categories for selected menu across all espaces
      const categories = new Set<string>();

      this.allEspaces.forEach(espace => {
        if (espace.data?.menus?.[this.localFilters.selectedMenu]) {
          const menuData = espace.data.menus[this.localFilters.selectedMenu];
          if (Array.isArray(menuData)) {
            menuData.forEach((category: any) => {
              if (category.main_category) {
                categories.add(category.main_category);
              }
            });
          }
        }
      });

      this.mainCategoryOptions = Array.from(categories).map(category => ({
        label: category,
        value: category
      }));
    } else if (this.localFilters.selectedEspace && !this.localFilters.selectedMenu) {
      // Show all categories for selected espace
      const selectedEspace = this.allEspaces.find(e => e.id === this.localFilters.selectedEspace);
      if (selectedEspace?.data?.menus) {
        const categories = new Set<string>();
        Object.values(selectedEspace.data.menus).forEach((menuData: any) => {
          if (Array.isArray(menuData)) {
            menuData.forEach((category: any) => {
              if (category.main_category) {
                categories.add(category.main_category);
              }
            });
          }
        });

        this.mainCategoryOptions = Array.from(categories).map(category => ({
          label: category,
          value: category
        }));
      } else {
        this.mainCategoryOptions = [];
      }
    } else {
      // Show all categories from all espaces
      this.initializeAllMainCategoryOptions();
    }
  }

  private updateSubCategoryOptions(): void {
    this.subCategoryOptions = [];

    if (this.localFilters.selectedMainCategory) {
      const subCategories = new Set<string>();

      // Define which espaces to search
      const espacesToSearch = this.localFilters.selectedEspace
        ? [this.allEspaces.find(e => e.id === this.localFilters.selectedEspace)!].filter(Boolean)
        : this.allEspaces;

      espacesToSearch.forEach(espace => {
        if (espace.data?.menus) {
          // Define which menus to search
          const menusToSearch = this.localFilters.selectedMenu
            ? [this.localFilters.selectedMenu]
            : Object.keys(espace.data.menus);

          menusToSearch.forEach(menuKey => {
            const menuData = espace.data.menus[menuKey];
            if (Array.isArray(menuData)) {
              menuData.forEach((category: any) => {
                if (category.main_category === this.localFilters.selectedMainCategory &&
                  category.sub_categories && Array.isArray(category.sub_categories)) {
                  category.sub_categories.forEach((subCat: string) => {
                    subCategories.add(subCat);
                  });
                }
              });
            }
          });
        }
      });

      this.subCategoryOptions = Array.from(subCategories).map(subCategory => ({
        label: subCategory,
        value: subCategory
      }));
    }
  }

  onFilterChange(): void {
    // Don't reset dependent filters - allow independent selection
    this.updateDependentOptions();
    this.filtersChanged.emit({ ...this.localFilters });
  }

  clearAllFilters(): void {
    this.localFilters = {
      selectedEspace: '',
      selectedMenu: '',
      selectedMainCategory: '',
      selectedSubCategory: ''
    };
    this.updateDependentOptions();
    this.filtersChanged.emit({ ...this.localFilters });
  }

  hasActiveFilters(): boolean {
    return !!(
      this.localFilters.selectedEspace ||
      this.localFilters.selectedMenu ||
      this.localFilters.selectedMainCategory ||
      this.localFilters.selectedSubCategory
    );
  }

  onCloseSidebar(): void {
    this.closeSidebar.emit();
  }
}
