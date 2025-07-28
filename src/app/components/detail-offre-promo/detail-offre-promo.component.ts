import { Component } from '@angular/core';
import {DataService, PageLink} from "../../services/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-detail-offre-promo',
  templateUrl: './detail-offre-promo.component.html',
  styleUrl: './detail-offre-promo.component.scss'
})
export class DetailOffrePromoComponent {
  currentId = 'offres-et-opportunites';
  mainPages: PageLink[] = [];
  morePages: PageLink[] = [];
  showMore = false;
  showDropdown = false;
  espaceData: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Load all pages and split them into main and more pages
    const allPages = this.dataService.getAvailablePages();
    this.mainPages = allPages.slice(0, 5);
    this.morePages = allPages.slice(5);

    // Load the offres data
    this.loadEspaceData();
  }

  loadEspaceData(): void {
    this.http.get<any>('assets/data/offres-et-opportunites.json').subscribe({
      next: (data) => {
        this.espaceData = data;
        console.log('Loaded offres data:', data);
      },
      error: (error) => {
        console.error('Error loading offres data:', error);
      }
    });
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
}
