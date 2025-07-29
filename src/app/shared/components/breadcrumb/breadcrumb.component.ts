// Updated breadcrumb.component.ts
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

interface BreadcrumbItem {
  label: string;
  url: string;
  isActive: boolean;
  icon?: string;
}

interface Card {
  id: number;
  name: string;
  theme: string;
  picture: string;
  telephone: string;
  email: string;
  rating: number;
  isFavorite: boolean;
  description?: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnChanges {
  @Input() currentCard: Card | null = null;
  @Input() selectedMenuItem: string | null = null; // For nav-elements menu items
  @Input() selectedSidebarItem: string | null = null; // For sidebar items
  breadcrumbs: BreadcrumbItem[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .subscribe(() => {
        this.buildBreadcrumbs();
      });

    this.buildBreadcrumbs();
  }

  ngOnChanges(): void {
    this.buildBreadcrumbs();
  }

  buildBreadcrumbs(): void {
    this.breadcrumbs = [];
    const currentUrl = this.router.url;

    // Always add Home (Accueil)
    this.breadcrumbs.push({
      label: 'Accueil',
      url: '/home',
      isActive: false,
      icon: 'pi-home'
    });

    // Handle different routes
    if (currentUrl === '/espace') {
      // Home-layout route (/espace)
      this.breadcrumbs.push({
        label: 'Espace',
        url: '/espace',
        isActive: true,
        icon: 'pi-th-large'
      });
    } else if (currentUrl.includes('/espace/')) {
      const urlSegments = currentUrl.split('/');
      const espaceIndex = urlSegments.findIndex(segment => segment === 'espace');

      if (espaceIndex !== -1 && urlSegments[espaceIndex + 1]) {
        const espaceId = urlSegments[espaceIndex + 1];

        // For content-layout (/espace/:id) - add Espace link between Accueil and specific espace
        if (!urlSegments.includes('detail')) {
          // Add "Espace" breadcrumb that's routable to "/espace"
          this.breadcrumbs.push({
            label: 'Espace',
            url: '/espace',
            isActive: false,
            icon: 'pi-th-large'
          });

          // Add the specific espace name
          const espaceLabel = this.getEspaceLabel(espaceId);
          this.breadcrumbs.push({
            label: espaceLabel,
            url: `/espace/${espaceId}`,
            isActive: true,
            icon: this.getEspaceIcon(espaceId)
          });
        } else {
          // For detail-annauaire-pro component (/espace/:id/detail/:cardId)
          // Only show Accueil and card name, no espace name in between
          if (this.currentCard) {
            this.breadcrumbs.push({
              label: this.currentCard.name,
              url: currentUrl,
              isActive: !this.selectedMenuItem && !this.selectedSidebarItem,
              icon: 'pi-building'
            });

            // Add selected menu item or sidebar item to breadcrumb
            // FIXED: Show main menu name instead of submenu for menu items
            if (this.selectedMenuItem) {
              const mainMenuInfo = this.getMainMenuInfo(this.selectedMenuItem);
              this.breadcrumbs.push({
                label: mainMenuInfo.label,
                url: currentUrl,
                isActive: true,
                icon: mainMenuInfo.icon
              });
            } else if (this.selectedSidebarItem) {
              this.breadcrumbs.push({
                label: this.getSidebarItemLabel(this.selectedSidebarItem),
                url: currentUrl,
                isActive: true,
                icon: this.getSidebarItemIcon(this.selectedSidebarItem)
              });
            }
          }
        }
      }
    }

    // Mark the last breadcrumb as active if no specific item is selected
    if (this.breadcrumbs.length > 0 && !this.selectedMenuItem && !this.selectedSidebarItem) {
      this.breadcrumbs[this.breadcrumbs.length - 1].isActive = true;
    }
  }

  getEspaceLabel(espaceId: string): string {
    const espaceLabels: { [key: string]: string } = {
      'annuaires-des-professionnels': 'Annuaires des professionnels',
      'offres-et-opportunites': 'Offres et opportunités',
      'sante-bien-etre': 'Santé & Bien-être',
      'logement-vie-communautaire': 'Logement & Vie Communautaire',
      'tpe-pme': 'TPE & PME'
    };

    return espaceLabels[espaceId] || espaceId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getEspaceIcon(espaceId: string): string {
    const espaceIcons: { [key: string]: string } = {
      'annuaires-des-professionnels': 'pi-users',
      'offres-et-opportunites': 'pi-briefcase',
      'evenements-et-actualites': 'pi-calendar',
      'informations-pratiques': 'pi-info-circle',
      'espace-communautaire': 'pi-comments',
      'toujours-actifs':'pi-bolt',
      'sante-bien-etre': 'pi-heart',
      'logement-vie-communautaire': 'pi-home',
      'tpe-pme': 'pi-building'
    };

    return espaceIcons[espaceId] || 'pi-circle';
  }

  // UPDATED: New method to get main menu info based on submenu selection
  getMainMenuInfo(menuItem: string): {label: string, icon: string} {
    // Map submenu items to their main menu
    const menuMap: { [key: string]: {label: string, icon: string} } = {
      // Produits submenu items
      'afficher-produits': { label: 'Produits', icon: 'pi-shopping-cart' },
      'ajouter-produits': { label: 'Produits', icon: 'pi-shopping-cart' },
      
      // Opportunités submenu items
      'afficher-opportunites': { label: 'Opportunités', icon: 'pi-briefcase' },
      'ajouter-opportunites': { label: 'Opportunités', icon: 'pi-briefcase' },
      
      // Articles submenu items
      'afficher-articles': { label: 'Articles', icon: 'pi-file-edit' },
      'ajouter-articles': { label: 'Articles', icon: 'pi-file-edit' },
      
      // Fallback for direct menu items (old system)
      'about': { label: 'À propos', icon: 'pi-info-circle' },
      'contact': { label: 'Contact', icon: 'pi-phone' },
      'faq': { label: 'FAQ', icon: 'pi-question-circle' },
      'forum': { label: 'Forum', icon: 'pi-comments' },
      'reviews': { label: 'Avis', icon: 'pi-star' }
    };

    return menuMap[menuItem] || { label: menuItem, icon: 'pi-circle' };
  }

  // Keep old methods for backward compatibility
  getMenuItemLabel(menuItem: string): string {
    const mainMenuInfo = this.getMainMenuInfo(menuItem);
    return mainMenuInfo.label;
  }

  getMenuItemIcon(menuItem: string): string {
    const mainMenuInfo = this.getMainMenuInfo(menuItem);
    return mainMenuInfo.icon;
  }

  getSidebarItemLabel(sidebarItem: string): string {
    const sidebarLabels: { [key: string]: string } = {
      'about': 'À propos',
      'contact': 'Contact', 
      'faq': 'FAQ',
      'forum': 'Forum',
      'reviews': 'Avis',
      'map': 'Localisation',
      'share': 'Partager',
      'print': 'Imprimer',
      'bookmark': 'Favoris'
    };

    return sidebarLabels[sidebarItem] || sidebarItem;
  }

  getSidebarItemIcon(sidebarItem: string): string {
    const sidebarIcons: { [key: string]: string } = {
      'about': 'pi-info-circle',
      'contact': 'pi-phone',
      'faq': 'pi-question-circle', 
      'forum': 'pi-comments',
      'reviews': 'pi-star',
      'map': 'pi-map-marker',
      'share': 'pi-share-alt',
      'print': 'pi-print',
      'bookmark': 'pi-bookmark'
    };

    return sidebarIcons[sidebarItem] || 'pi-circle';
  }

  navigateTo(url: string): void {
    if (url) {
      // FIXED: When clicking on card name, navigate to about section
      if (this.currentCard && url === this.router.url) {
        // If clicking on current card name, show about content
        this.breadcrumbs.forEach(breadcrumb => breadcrumb.isActive = false);
        this.breadcrumbs[this.breadcrumbs.length - 1].isActive = true;
        
        // Emit event to parent component to show about content
        // This will be handled by the parent component
        window.dispatchEvent(new CustomEvent('navigateToAbout'));
      } else {
        this.router.navigate([url]);
      }
    }
  }
}