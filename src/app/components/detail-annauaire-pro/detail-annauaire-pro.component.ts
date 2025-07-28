import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService, PageLink } from '../../services/data.service';

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
}

@Component({
  selector: 'app-detail-annauaire-pro',
  templateUrl: './detail-annauaire-pro.component.html',
  styleUrls: ['./detail-annauaire-pro.component.scss']
})
export class DetailAnnauaireProComponent implements OnInit {
  currentId = 'annuaires-des-professionnels';
  mainPages: PageLink[] = [];
  morePages: PageLink[] = [];
  showMore = false;
  showDropdown = false;
  espaceData: any = null;
  currentCard: Card | null = null;
  activeMenu: string = 'about';

  // Sidebar properties
  isSidebarExpanded: boolean = false;
  activeSidebarItem: string | null = null;

  // Dropdown state properties
  selectedMenuKey: string | null = null;
  selectedMainCategoryId: number | null = null;
  selectedSubCategory: string | null = null;

  // Add these new properties for breadcrumb
  selectedMenuItem: string | null = null;
  selectedSidebarItem: string | null = null;

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

    // Load the annuaires data first
    this.loadEspaceData();
  }

  loadEspaceData(): void {
    this.http.get<any>('assets/data/annuaires-des-professionnels.json').subscribe({
      next: (data) => {
        this.espaceData = data;
        console.log('Loaded annuaires data:', data);

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
        console.error('Error loading annuaires data:', error);
      }
    });
  }

  loadFirstAvailableCard(): void {
    if (!this.espaceData) return;

    // Try to load first card from general cards
    if (this.espaceData.generalCards && this.espaceData.generalCards.length > 0) {
      this.currentCard = this.espaceData.generalCards[0];
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
            console.log('Loaded first menu card:', this.currentCard);
            return;
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
      // If clicking the same item, deselect it
      this.activeSidebarItem = null;
      this.selectedSidebarItem = null;
    } else {
      // Select new item and clear menu selection
      this.activeSidebarItem = item;
      this.selectedSidebarItem = item;
      this.activeMenu = '';
      this.selectedMenuItem = null;
    }
  }

  // Social sharing methods
  shareOnSocial(platform: string): void {
    if (!this.currentCard) return;

    const url = this.getShareUrl();
    const text = `Découvrez ${this.currentCard.name} - ${this.currentCard.theme}`;

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
      'Santé & Bien-Être': `${this.currentCard.name} est un organisme dédié à la santé et au bien-être, offrant des services de qualité dans le domaine de ${this.currentCard.theme}. Notre équipe expérimentée met tout en œuvre pour vous accompagner dans vos besoins de santé avec professionnalisme et bienveillance.`,
      'Logement & Vie Communautaire': `${this.currentCard.name} propose des solutions innovantes dans le domaine du logement et de la vie communautaire. Nous œuvrons pour créer des espaces de vie solidaires et durables, adaptés aux besoins de chacun.`,
      'TPE & PME': `${this.currentCard.name} est une entreprise dynamique spécialisée dans ${this.currentCard.theme}. Nous nous engageons à fournir des services de qualité tout en maintenant une approche personnalisée et proche de nos clients.`,
      'Offres & Opportunités': `${this.currentCard.name} vous propose diverses offres et opportunités dans le domaine de ${this.currentCard.theme}. Notre objectif est de vous accompagner dans vos projets et de vous offrir les meilleures solutions adaptées à vos besoins.`
    };

    return descriptions[this.currentCard.theme as keyof typeof descriptions] ||
      `${this.currentCard.name} est un organisme professionnel dans le domaine de ${this.currentCard.theme}. Nous nous efforçons de fournir des services de qualité et un accompagnement personnalisé à tous nos clients.`;
  }

  handleNavClick(id: string): void {
    if (this.currentId === id) {
      this.showDropdown = !this.showDropdown;
    } else {
      this.showDropdown = false;
      this.router.navigate(['/espace', id]);
    }
  }

  toggleMore(showMore: boolean): void {
    this.showMore = showMore;
  }

  // Dropdown event handlers
  onMenuSelected(menuKey: string): void {
    this.selectedMenuKey = menuKey;
    this.selectedMainCategoryId = null;
    this.selectedSubCategory = null;
  }

  onMainCategorySelected(categoryId: number): void {
    this.selectedMainCategoryId = categoryId;
    this.selectedSubCategory = null;
  }

  onSubCategorySelected(subCategory: string): void {
    this.selectedSubCategory = subCategory;
  }

  closeDropdown(): void {
    this.showDropdown = false;
    this.selectedMenuKey = null;
    this.selectedMainCategoryId = null;
    this.selectedSubCategory = null;
  }
}
