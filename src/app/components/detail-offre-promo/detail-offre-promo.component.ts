import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService, PageLink } from '../../services/data.service';
import { MenuSelection } from '../detail-layout/detail-menu-layout/detail-menu-layout.component';

export interface Card {
  id: number;
  picture: string;
  slides?: string[]; // Added optional slides property
  theme: string;
  name: string;
  telephone: string;
  email: string;
  rating: number; // 1-5 stars
  isFavorite: boolean;
  description: string;
  price?: string; // Added price property for Offres et Opportunités
}

@Component({
  selector: 'app-detail-offre-promo',
  templateUrl: './detail-offre-promo.component.html',
  styleUrls: ['./detail-offre-promo.component.scss']
})
export class DetailOffrePromoComponent implements OnInit {
  currentId = 'offres-et-opportunites';
  mainPages: PageLink[] = [];
  morePages: PageLink[] = [];
  showMore = false;
  showDropdown = false;
  espaceData: any = null;
  currentCard: Card | null = null;
  activeMenu: string = 'about';
  
  // New menu system properties
  currentMenuSelection: MenuSelection = { menu: '', submenu: '' };
  
  // Data arrays for cards - adapted for Offres et Opportunités
  eBoutiqueData: Card[] = [];
  produitsData: Card[] = [];
  servicesData: Card[] = [];
  eServicesData: Card[] = [];
  opportunitesData: Card[] = [];

  // NEW: Context-specific data arrays for current card
  currentCardProducts: Card[] = [];
  currentCardOpportunities: Card[] = [];
  currentCardPartnerships: Card[] = [];
  currentCardArticles: Card[] = [];

  // Current selected header item (for dropdown display only)
  selectedHeaderItem: string = '';

  // Sidebar properties
  isSidebarExpanded: boolean = false;
  // FIXED: Default to 'about' instead of null
  activeSidebarItem: string | null = 'about';

  // Dropdown state properties - matching home-layout
  selectedMenuKey: string | null = null;
  selectedMainCategoryId: number | null = null;
  selectedSubCategory: string | null = null;

  // Add these new properties for breadcrumb
  selectedMenuItem: string | null = null;
  // FIXED: Default to 'about' for sidebar item
  selectedSidebarItem: string | null = 'about';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Load all pages and split them into main and more pages
    const allPages = this.dataService.getAvailablePages();
    this.mainPages = allPages.slice(0, 6);
    this.morePages = allPages.slice(6);

    // Load the offres-et-opportunites data first
    this.loadEspaceData();

    // FIXED: Listen for breadcrumb navigation to about
    window.addEventListener('navigateToAbout', () => {
      this.navigateToAbout();
    });
  }

  ngOnDestroy(): void {
    // Clean up event listener
    window.removeEventListener('navigateToAbout', () => {
      this.navigateToAbout();
    });
  }

  // FIXED: Method to handle navigation to about section
  navigateToAbout(): void {
    this.activeSidebarItem = 'about';
    this.selectedSidebarItem = 'about';
    this.currentMenuSelection = { menu: '', submenu: '' };
    this.selectedMenuItem = null;
  }

  loadEspaceData(): void {
    this.http.get<any>('assets/data/offres-et-opportunites.json').subscribe({
      next: (data) => {
        this.espaceData = data;
        console.log('Loaded offres-et-opportunites data:', data);
        
        // Load the card data arrays specific to Offres et Opportunités
        this.loadCardDataArrays(data);

        // Try to get card ID from different sources
        this.route.params.subscribe(params => {
          console.log('Route params:', params);
          if (params['cardId']) {
            this.loadCardData(+params['cardId']);
          } else if (params['id']) {
            this.loadCardData(+params['id']);
          }
        });

        // Also check query parameters
        this.route.queryParams.subscribe(queryParams => {
          console.log('Query params:', queryParams);
          if (queryParams['cardId'] && !this.currentCard) {
            this.loadCardData(+queryParams['cardId']);
          }
        });

        // If no card ID is provided, load the first available card as example
        if (!this.currentCard) {
          this.loadFirstAvailableCard();
        }
      },
      error: (error) => {
        console.error('Error loading offres-et-opportunites data:', error);
      }
    });
  }

  loadCardDataArrays(data: any): void {
    // Extract cards from different menu categories for Offres et Opportunités
    this.eBoutiqueData = this.extractCardsFromMenu(data, 'E-boutique Partenaire');
    this.produitsData = this.extractCardsFromMenu(data, 'Catalogues des Produits');
    this.servicesData = this.extractCardsFromMenu(data, 'Catalogues des Services');
    this.eServicesData = this.extractCardsFromMenu(data, 'Catalogues des E-services');
    this.opportunitesData = this.extractCardsFromMenu(data, 'Opportunités');

    // Add general cards to opportunités if they exist
    if (data.generalCards) {
      this.opportunitesData = [...this.opportunitesData, ...data.generalCards];
    }

    console.log('Card data arrays loaded:', {
      eBoutique: this.eBoutiqueData.length,
      produits: this.produitsData.length,
      services: this.servicesData.length,
      eServices: this.eServicesData.length,
      opportunites: this.opportunitesData.length
    });
  }

  extractCardsFromMenu(data: any, menuKey: string): Card[] {
    const allCards: Card[] = [];

    if (data.menus && data.menus[menuKey]) {
      const menuCategories = data.menus[menuKey];
      
      menuCategories.forEach((category: any) => {
        // Add main category cards
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

    return allCards;
  }

  // NEW: Method to load context-specific data for current card
  loadCurrentCardContextData(): void {
    if (!this.currentCard || !this.espaceData) return;

    console.log('Loading context data for card:', this.currentCard.id);

    // Find the current card's context in the data structure
    const cardContext = this.findCardContext(this.currentCard.id);
    
    if (cardContext) {
      // Load products from the same context
      this.currentCardProducts = cardContext.products || [];
      // Load opportunities from the same context
      this.currentCardOpportunities = cardContext.opportunities || [];
      // Load partnerships from the same context
      this.currentCardPartnerships = cardContext.Partenariats || [];
      // Load articles (if they exist in the structure)
      this.currentCardArticles = cardContext.articles || [];

      console.log('Context data loaded:', {
        products: this.currentCardProducts.length,
        opportunities: this.currentCardOpportunities.length,
        partnerships: this.currentCardPartnerships.length,
        articles: this.currentCardArticles.length
      });
    } else {
      // Clear context data if no context found
      this.currentCardProducts = [];
      this.currentCardOpportunities = [];
      this.currentCardPartnerships = [];
      this.currentCardArticles = [];
      console.log('No context found for card:', this.currentCard.id);
    }
  }

  // NEW: Method to find the context where the current card exists
  findCardContext(cardId: number): any {
    if (!this.espaceData?.menus) return null;

    // Search through all menus and categories
    for (const menuKey of Object.keys(this.espaceData.menus)) {
      const menuCategories = this.espaceData.menus[menuKey];

      for (const category of menuCategories) {
        // Check subcategory cards
        if (category.subCategoryCards) {
          for (const subCategoryKey of Object.keys(category.subCategoryCards)) {
            const subCategoryData = category.subCategoryCards[subCategoryKey];
            
            // Check if current card exists in this subcategory
            if (Array.isArray(subCategoryData)) {
              const foundCard = subCategoryData.find((card: any) => card.id === cardId);
              if (foundCard) {
                console.log('Found card context in subcategory:', subCategoryKey);
                // Return the parent object that contains products, opportunities, etc.
                return category.subCategoryCards;
              }
            }
          }
        }

        // Check main category cards
        if (category.cards) {
          const foundCard = category.cards.find((card: any) => card.id === cardId);
          if (foundCard) {
            console.log('Found card context in main category:', category.main_category);
            // For main category cards, check if there are related data structures
            return category;
          }
        }
      }
    }

    return null;
  }

  loadFirstAvailableCard(): void {
    if (!this.espaceData) return;

    // Try to load first card from general cards
    if (this.espaceData.generalCards && this.espaceData.generalCards.length > 0) {
      this.currentCard = this.espaceData.generalCards[0];
      this.loadCurrentCardContextData(); // Load context data
      console.log('Loaded first general card:', this.currentCard);
      return;
    }

    // Try to load first card from menus
    if (this.espaceData.menus) {
      for (const menuKey of Object.keys(this.espaceData.menus)) {
        const menuCategories = this.espaceData.menus[menuKey];

        for (const category of menuCategories) {
          if (category.cards && category.cards.length > 0) {
            this.currentCard = category.cards[0];
            this.loadCurrentCardContextData(); // Load context data
            console.log('Loaded first menu card:', this.currentCard);
            return;
          }
          
          // Also check subcategory cards
          if (category.subCategoryCards) {
            for (const subCategoryKey of Object.keys(category.subCategoryCards)) {
              const subCategoryCards = category.subCategoryCards[subCategoryKey];
              if (subCategoryCards && subCategoryCards.length > 0) {
                this.currentCard = subCategoryCards[0];
                this.loadCurrentCardContextData(); // Load context data
                console.log('Loaded first subcategory card:', this.currentCard);
                return;
              }
            }
          }
        }
      }
    }
  }

  loadCardData(cardId: number): void {
    if (!this.espaceData) return;

    // Search for the card in all categories
    let foundCard: Card | null = null;

    // Search in general cards
    if (this.espaceData.generalCards) {
      foundCard = this.espaceData.generalCards.find((card: Card) => card.id === cardId);
    }

    // Search in menu categories if not found in general cards
    if (!foundCard && this.espaceData.menus) {
      for (const menuKey of Object.keys(this.espaceData.menus)) {
        const menuCategories = this.espaceData.menus[menuKey];

        for (const category of menuCategories) {
          // Search in main category cards
          if (category.cards) {
            foundCard = category.cards.find((card: Card) => card.id === cardId);
            if (foundCard) break;
          }

          // Search in subcategory cards
          if (category.subCategoryCards) {
            for (const subCategoryKey of Object.keys(category.subCategoryCards)) {
              const subCategoryCards = category.subCategoryCards[subCategoryKey];
              foundCard = subCategoryCards.find((card: Card) => card.id === cardId);
              if (foundCard) break;
            }
            if (foundCard) break;
          }
        }
        if (foundCard) break;
      }
    }

    if (foundCard) {
      this.currentCard = foundCard;
      this.loadCurrentCardContextData(); // Load context data after setting current card
      console.log('Found card:', foundCard);
    } else {
      console.warn('Card not found with ID:', cardId);
    }
  }

  setActiveMenu(menu: string): void {
    this.activeMenu = menu;
    this.selectedMenuItem = menu; // Set for breadcrumb
    this.activeSidebarItem = null;
    this.selectedSidebarItem = null; // Clear sidebar selection
  }

  // Sidebar methods
  toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  onSidebarItemChange(item: string): void {
    if (this.activeSidebarItem === item) {
      // If clicking the same item, deselect it and go back to about
      this.activeSidebarItem = 'about';
      this.selectedSidebarItem = 'about';
    } else {
      // Select new item and clear menu selection
      this.activeSidebarItem = item;
      this.selectedSidebarItem = item;
      this.currentMenuSelection = { menu: '', submenu: '' };
      this.selectedMenuItem = null;
    }
  }

  // Header navigation - matching home-layout behavior
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
    // If it's the current espace, use existing data
    if (espaceId === this.currentId && this.espaceData) {
      // Use current espaceData for dropdown
      return;
    }

    // Load the data for dropdown display only
    this.http.get<any>(`assets/data/${espaceId}.json`).subscribe({
      next: (data) => {
        // Only update dropdown data if it's for a different espace
        if (espaceId !== this.currentId) {
          this.espaceData = data;
        }
      },
      error: (error) => {
        console.error(`Error loading data for ${espaceId}:`, error);
      }
    });
  }

  resetDropdownState(): void {
    this.selectedMenuKey = null;
    this.selectedMainCategoryId = null;
    this.selectedSubCategory = null;
  }

  // Dropdown selection methods - matching home-layout behavior
  selectMenu(key: string): void {
    this.selectedMenuKey = key;
    this.selectedMainCategoryId = null;
    this.selectedSubCategory = null;
  }

  selectMainCategory(id: number): void {
    this.selectedMainCategoryId = id;
    this.selectedSubCategory = null;
  }

  selectSubCategory(subCategory: string): void {
    this.selectedSubCategory = subCategory;
    // Navigate to espace (home-layout) with the selected subcategory
    this.router.navigate(['/espace'], {
      queryParams: {
        espace: this.selectedHeaderItem,
        menu: this.selectedMenuKey,
        category: this.selectedMainCategoryId,
        subcategory: subCategory
      }
    });
  }

  closeDropdown(): void {
    this.showDropdown = false;
    this.resetDropdownState();
    this.selectedHeaderItem = '';
  }

  get currentMainCategory() {
    if (this.selectedMenuKey && this.selectedMainCategoryId !== null) {
      // Use the appropriate espaceData based on selected header item
      const dataToUse = this.selectedHeaderItem === this.currentId ? 
        this.espaceData : 
        this.espaceData; // In this case, espaceData is updated when different header item is selected
      
      if (dataToUse?.menus?.[this.selectedMenuKey]) {
        return dataToUse.menus[this.selectedMenuKey].find((cat: any) => cat.id === this.selectedMainCategoryId);
      }
    }
    return null;
  }

  // Social sharing methods
  shareOnSocial(platform: string): void {
    if (!this.currentCard) return;

    const url = this.getShareUrl();
    const text = `Découvrez ${this.currentCard.name} - ${this.currentCard.theme}${this.currentCard.price ? ' - ' + this.currentCard.price : ''}`;

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }

  getShareUrl(): string {
    return window.location.href;
  }

  copyToClipboard(input: HTMLInputElement): void {
    input.select();
    input.setSelectionRange(0, 99999);

    try {
      document.execCommand('copy');
      // You could add a toast notification here
      console.log('URL copied to clipboard');
    } catch (err) {
      console.error('Failed to copy URL');
    }
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  isStarFilled(star: number, rating: number): boolean {
    return star <= rating;
  }

  getDefaultDescription(): string {
    if (!this.currentCard) return '';

    const descriptions = {
      'E-boutique Partenaire': `${this.currentCard.name} est une boutique en ligne partenaire proposant des produits adaptés aux seniors${this.currentCard.price ? ' à partir de ' + this.currentCard.price : ''}. Nous sélectionnons avec soin des produits de qualité pour améliorer votre quotidien et votre bien-être.`,
      'Produits Adaptés': `${this.currentCard.name} propose une gamme de produits spécialement conçus pour les seniors${this.currentCard.price ? ' à partir de ' + this.currentCard.price : ''}. Nos produits allient praticité, sécurité et confort pour vous accompagner dans votre quotidien.`,
      'Services pour Seniors': `${this.currentCard.name} offre des services personnalisés pour les seniors${this.currentCard.price ? ' à partir de ' + this.currentCard.price : ''}. Notre équipe professionnelle met son expertise à votre service pour répondre à vos besoins spécifiques.`,
      'Aide à domicile': `${this.currentCard.name} propose des services d'aide à domicile de qualité${this.currentCard.price ? ' à partir de ' + this.currentCard.price : ''}. Nos professionnels qualifiés vous accompagnent dans votre quotidien avec bienveillance et professionnalisme.`,
      'Offres & Opportunités': `${this.currentCard.name} vous présente une offre exceptionnelle${this.currentCard.price ? ' au prix de ' + this.currentCard.price : ''}. Profitez de cette opportunité pour découvrir nos services et produits adaptés à vos besoins.`
    };

    return descriptions[this.currentCard.theme as keyof typeof descriptions] ||
      `${this.currentCard.name} propose des produits et services de qualité adaptés aux seniors${this.currentCard.price ? ' à partir de ' + this.currentCard.price : ''}. Nous nous engageons à vous offrir les meilleures solutions pour améliorer votre quotidien.`;
  }

  toggleMore(showMore: boolean): void {
    this.showMore = showMore;
  }
  
  // New method to handle menu changes - adapted for Offres et Opportunités
  onMenuChange(selection: MenuSelection): void {
    // Only update if there's actually a submenu selected
    if (selection.submenu) {
      this.currentMenuSelection = selection;
      this.selectedMenuItem = selection.submenu; // Set for breadcrumb
      
      // Clear sidebar selection when menu is selected
      this.activeSidebarItem = null;
      this.selectedSidebarItem = null;
      
      console.log('Menu selection changed:', selection);
    }
    // If no submenu is provided, don't change the current state
  }

  // Add method to handle card clicks from the card layouts
  onCardClick(cardId: number): void {
    // Navigate to detail view or handle card selection
    this.router.navigate(['/espace', this.currentId, 'detail', cardId]);
  }
}