import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService, PageLink } from '../../../../services/data.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Card } from '../card-layout/card-layout.component';
import { forkJoin } from 'rxjs';
import { HeaderBarLayoutComponent } from '../header-bar-layout/header-bar-layout.component';

export interface EspaceData {
  id: string;
  title: string;
  data: any;
  cards: Card[];
}

export interface FilterOptions {
  selectedEspace: string;
  selectedMenu: string;
  selectedMainCategory: string;
  selectedSubCategory: string;
}

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss']
})
export class HomeLayoutComponent implements OnInit {
  @ViewChild(HeaderBarLayoutComponent) headerBarComponent!: HeaderBarLayoutComponent;

  currentId = 'home'; // This will always stay 'homeland' now
  currentPageTitle = '';
  mainPages: PageLink[] = [];
  morePages: PageLink[] = [];
  showMore = false;
  showDropdown = false;
  showFilterSidebar = false;
  isLoading = true;
  error: string | null = null;

  // Current selected header item (for dropdown display only)
  selectedHeaderItem: string = '';

  // Espace data
  allEspaces: EspaceData[] = [];
  allCards: Card[] = []; // Store all cards across all espaces

  // Filter state
  filters: FilterOptions = {
    selectedEspace: '',
    selectedMenu: '',
    selectedMainCategory: '',
    selectedSubCategory: ''
  };

  // Dropdown Data
  espaceData: any = null;
  selectedMenuKey: string | null = null;
  selectedMainCategoryId: number | null = null;
  selectedSubCategory: string | null = null;

  // Cards data - will always show home content unless dropdown selections are made
  displayedCards: Card[] = [];

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Load all pages and split them into main and more pages
    const allPages = this.dataService.getAvailablePages();
    this.mainPages = allPages.slice(0, 6);
    this.morePages = allPages.slice(6);

    // Load all espaces data first to enable filtering on all pages
    this.loadAllEspacesData();

    // Handle query parameters for navigation from detail pages
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['espace'] && queryParams['subcategory']) {
        this.handleQueryParamNavigation(queryParams);
      }
    });

    // Only handle route changes for detail pages or explicit navigation
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id && id !== 'home') {
        // Only if explicitly navigating to a different route (like detail pages)
        this.handleExplicitNavigation(id);
      } else {
        // Always stay on home
        this.currentId = 'home';
        this.currentPageTitle = 'Accueil';
      }
    });
  }

  private handleQueryParamNavigation(queryParams: any): void {
    // Set the selected header item and load its data
    this.selectedHeaderItem = queryParams['espace'];
    this.selectedMenuKey = queryParams['menu'];
    this.selectedMainCategoryId = queryParams['category'] ? +queryParams['category'] : null;
    this.selectedSubCategory = queryParams['subcategory'];
    
    // Load the espace data for dropdown
    this.loadEspaceDataForDropdown(this.selectedHeaderItem);
    
    // Show dropdown
    this.showDropdown = true;
    
    // Update displayed cards and title
    setTimeout(() => {
      this.updateDisplayedCards();
      this.updateCurrentPageTitle();
    }, 100); // Small delay to ensure espaceData is loaded
  }

  private handleExplicitNavigation(id: string): void {
    // This method handles explicit navigation (like going to detail pages)
    // but doesn't change the main content display
    const page = this.dataService.getAvailablePages().find(p => p.id === id);
    if (page) {
      this.currentPageTitle = page.title;
    }
  }

  loadAllEspacesData(): void {
    this.isLoading = true;
    this.error = null;

    const availablePages = this.dataService.getAvailablePages();
    const dataRequests = availablePages.map(page =>
      this.http.get<any>(`assets/data/${page.id}.json`)
    );

    forkJoin(dataRequests).subscribe({
      next: (responses) => {
        this.allEspaces = availablePages.map((page, index) => ({
          id: page.id,
          title: page.title,
          data: responses[index],
          cards: this.extractCardsFromEspaceData(responses[index])
        }));

        // Store all cards with espace information
        this.allCards = [];
        this.allEspaces.forEach(espace => {
          espace.cards.forEach(card => {
            this.allCards.push({
              ...card,
              espaceId: espace.id,
              espaceTitle: espace.title
            } as any);
          });
        });

        // Initialize with home content (all espaces)
        this.displayedCards = [];
        this.currentPageTitle = 'Accueil';
        this.isLoading = false;

        // If we have query params to handle, process them after data is loaded
        this.route.queryParams.subscribe(queryParams => {
          if (queryParams['espace'] && queryParams['subcategory']) {
            this.handleQueryParamNavigation(queryParams);
          }
        });
      },
      error: (error) => {
        console.error('Error loading espaces data:', error);
        this.error = 'Erreur lors du chargement des données.';
        this.isLoading = false;
      }
    });
  }

  extractCardsFromEspaceData(espaceData: any): Card[] {
    const allCards: Card[] = [];

    // Add general cards
    if (espaceData.generalCards) {
      allCards.push(...espaceData.generalCards);
    }

    // Add cards from menus
    if (espaceData.menus) {
      Object.values(espaceData.menus).forEach((menuItems: any) => {
        if (Array.isArray(menuItems)) {
          menuItems.forEach((category: any) => {
            if (category.cards) {
              allCards.push(...category.cards);
            }
            // Add subcategory cards
            if (category.subCategoryCards) {
              Object.values(category.subCategoryCards).forEach((subCards: any) => {
                if (Array.isArray(subCards)) {
                  allCards.push(...subCards);
                }
              });
            }
          });
        }
      });
    }

    return allCards;
  }

  handleNavClick(action: string): void {
    if (action === 'toggle') {
      // Toggle dropdown for the same item
      this.showDropdown = !this.showDropdown;
      if (!this.showDropdown) {
        this.resetDropdownState();
        // Reset the selectedHeaderItem when closing dropdown
        this.selectedHeaderItem = '';
      }
      return;
    }
  
    // Different item clicked - switch dropdown to that item's data
    this.selectedHeaderItem = action;
    this.loadEspaceDataForDropdown(action);
    this.showDropdown = true;
  
    // Reset dropdown selections when switching header items
    this.resetDropdownState();
  }

  private loadEspaceDataForDropdown(espaceId: string): void {
    // Load the data for dropdown display only
    this.http.get<any>(`assets/data/${espaceId}.json`).subscribe({
      next: (data) => {
        this.espaceData = data;
        
        // If we have query params waiting to be processed, update displayed cards
        if (this.selectedSubCategory) {
          this.updateDisplayedCards();
          this.updateCurrentPageTitle();
        }
      },
      error: (error) => {
        console.error(`Error loading data for ${espaceId}:`, error);
        this.espaceData = null;
      }
    });
  }

  updateCurrentPageTitle(): void {
    // Always keep it as home title unless we're showing filtered results
    if (this.hasActiveFilters()) {
      this.currentPageTitle = 'Résultats filtrés';
    } else if (this.hasDropdownSelections()) {
      // Show title based on dropdown selections
      if (this.selectedSubCategory) {
        this.currentPageTitle = this.selectedSubCategory;
      } else if (this.currentMainCategory) {
        this.currentPageTitle = this.currentMainCategory.main_category;
      } else if (this.selectedMenuKey) {
        this.currentPageTitle = this.selectedMenuKey;
      } else {
        const espace = this.allEspaces.find(e => e.id === this.selectedHeaderItem);
        this.currentPageTitle = espace ? espace.title : 'Accueil';
      }
    } else {
      this.currentPageTitle = 'Accueil';
    }
  }

  public hasDropdownSelections(): boolean {
    // Only subcategory selection should be considered as having "selections" for content change
    return !!(this.selectedSubCategory);
  }

  resetDropdownState(): void {
    this.selectedMenuKey = null;
    this.selectedMainCategoryId = null;
    this.selectedSubCategory = null;
    this.updateDisplayedCards();
    this.updateCurrentPageTitle();
  }

  // Dropdown selection methods - these will now change the displayed content
  selectMenu(key: string): void {
    this.selectedMenuKey = key;
    this.selectedMainCategoryId = null;
    this.selectedSubCategory = null;
    // Remove updateDisplayedCards() and updateCurrentPageTitle() calls
    // These selections should only be visual
  }

  selectMainCategory(id: number): void {
    this.selectedMainCategoryId = id;
    this.selectedSubCategory = null;
    // Remove updateDisplayedCards() and updateCurrentPageTitle() calls
    // These selections should only be visual
  }

  selectSubCategory(subCategory: string): void {
    this.selectedSubCategory = subCategory;
    this.updateDisplayedCards();
    this.updateCurrentPageTitle();
  }

  closeDropdown(): void {
    this.showDropdown = false;
    this.resetDropdownState();
  }

  updateDisplayedCards(): void {
    // If no subcategory selected, show home content (all espaces preview)
    if (!this.selectedSubCategory) {
      this.displayedCards = [];
      return;
    }
  
    if (!this.espaceData) {
      this.displayedCards = [];
      return;
    }
  
    // Only show cards when subcategory is selected
    if (this.selectedMenuKey && this.selectedMainCategoryId && this.selectedSubCategory) {
      const menu = this.espaceData.menus?.[this.selectedMenuKey];
      const category = menu?.find((cat: any) => cat.id === this.selectedMainCategoryId);
      if (category?.subCategoryCards?.[this.selectedSubCategory]) {
        this.displayedCards = category.subCategoryCards[this.selectedSubCategory];
      } else {
        this.displayedCards = [];
      }
      return;
    }
  
    this.displayedCards = [];
  }

  get currentMainCategory() {
    if (this.selectedMenuKey && this.selectedMainCategoryId !== null && this.espaceData?.menus?.[this.selectedMenuKey]) {
      return this.espaceData.menus[this.selectedMenuKey].find((cat: any) => cat.id === this.selectedMainCategoryId);
    }
    return null;
  }

  // Filter methods - enhanced to work on individual espace pages
  getFilteredCards(): Card[] {
    let filteredCards = [...this.allCards];

    // Apply espace filter
    if (this.filters.selectedEspace) {
      filteredCards = filteredCards.filter((card: any) =>
        card.espaceId === this.filters.selectedEspace
      );
    }

    // Apply menu filter
    if (this.filters.selectedMenu) {
      filteredCards = this.filterCardsByMenu(filteredCards, this.filters.selectedMenu);
    }

    // Apply main category filter
    if (this.filters.selectedMainCategory) {
      filteredCards = filteredCards.filter(card =>
        this.cardBelongsToMainCategory(card, this.filters.selectedMainCategory)
      );
    }

    // Apply sub category filter
    if (this.filters.selectedSubCategory) {
      filteredCards = filteredCards.filter(card =>
        this.cardBelongsToSubCategory(card, this.filters.selectedSubCategory)
      );
    }

    return filteredCards;
  }

  getFilteredCardsForEspace(espaceId: string): Card[] {
    // If filters are active, return filtered cards for this espace only
    if (this.hasActiveFilters()) {
      return this.getFilteredCards().filter((card: any) => card.espaceId === espaceId);
    }

    // If no filters, return first 4 cards of this espace
    const espace = this.allEspaces.find(e => e.id === espaceId);
    return espace ? espace.cards.slice(0, 4) : [];
  }

  getFilteredCardsForCurrentEspace(): Card[] {
    // Since we're always on home, return all filtered cards
    return this.getFilteredCards();
  }

  private filterCardsByMenu(cards: Card[], menuKey: string): Card[] {
    const menuCards: Card[] = [];

    this.allEspaces.forEach(espace => {
      if (espace.data?.menus?.[menuKey]) {
        const menuCategories = espace.data.menus[menuKey];
        menuCategories.forEach((category: any) => {
          if (category.cards) {
            menuCards.push(...category.cards.map((card: Card) => ({
              ...card,
              espaceId: espace.id,
              espaceTitle: espace.title
            } as any)));
          }
          if (category.subCategoryCards) {
            Object.values(category.subCategoryCards).forEach((subCards: any) => {
              if (Array.isArray(subCards)) {
                menuCards.push(...subCards.map((card: Card) => ({
                  ...card,
                  espaceId: espace.id,
                  espaceTitle: espace.title
                } as any)));
              }
            });
          }
        });
      }
    });

    return cards.filter(card =>
      menuCards.some(menuCard => menuCard.id === card.id)
    );
  }

  private cardBelongsToMainCategory(card: Card, mainCategory: string): boolean {
    for (const espace of this.allEspaces) {
      if (espace.data?.menus) {
        for (const menuKey of Object.keys(espace.data.menus)) {
          const categories = espace.data.menus[menuKey];
          for (const category of categories) {
            if (category.main_category === mainCategory) {
              if (category.cards && category.cards.some((c: Card) => c.id === card.id)) {
                return true;
              }
              if (category.subCategoryCards) {
                for (const subCards of Object.values(category.subCategoryCards)) {
                  if (Array.isArray(subCards) && subCards.some((c: Card) => c.id === card.id)) {
                    return true;
                  }
                }
              }
            }
          }
        }
      }
    }
    return false;
  }

  private cardBelongsToSubCategory(card: Card, subCategory: string): boolean {
    for (const espace of this.allEspaces) {
      if (espace.data?.menus) {
        for (const menuKey of Object.keys(espace.data.menus)) {
          const categories = espace.data.menus[menuKey];
          for (const category of categories) {
            if (category.subCategoryCards && category.subCategoryCards[subCategory]) {
              if (category.subCategoryCards[subCategory].some((c: Card) => c.id === card.id)) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  hasActiveFilters(): boolean {
    return !!(
      this.filters.selectedEspace ||
      this.filters.selectedMenu ||
      this.filters.selectedMainCategory ||
      this.filters.selectedSubCategory
    );
  }

  shouldShowFilterButton(): boolean {
    // Always show filter button since we're always on home
    return true;
  }

  toggleMore(showMore: boolean): void {
    this.showMore = showMore;
  }

  toggleFilterSidebar(): void {
    this.showFilterSidebar = !this.showFilterSidebar;
  }

  closeFilterSidebar(): void {
    this.showFilterSidebar = false;
  }

  onFiltersChanged(newFilters: FilterOptions): void {
    this.filters = { ...newFilters };
    this.updateCurrentPageTitle();
  }

  navigateToEspace(espaceId: string): void {
    // Instead of navigating, select the espace in header and show its dropdown
    this.selectedHeaderItem = espaceId;
    this.loadEspaceDataForDropdown(espaceId);
    this.showDropdown = true;
    this.resetDropdownState();
  }

  onCardClick(cardId: number, espaceId?: string): void {
    // Determine the target espace ID
    let targetEspaceId = espaceId;

    if (!targetEspaceId) {
      // If no espace ID provided, try to determine from the card
      const card = this.allCards.find(c => c.id === cardId);
      targetEspaceId = (card as any)?.espaceId || 'home';
    }

    this.router.navigate(['/espace', targetEspaceId, 'detail', cardId]);
  }
}