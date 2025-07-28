import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PageLink {
  title: string;
  id: string;
  icon?: string; // Optional icon
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}

  getContent(id: string): Observable<any> {
    return this.http.get<any>(`assets/data/${id}.json`);
  }

  getAvailablePages(): PageLink[] {
    return [
      { title: 'Annuaires des professionnels', id: 'annuaires-des-professionnels', icon: 'pi-id-card' },
      { title: 'Offres et Opportunités', id: 'offres-et-opportunites', icon: 'pi-briefcase' },
      { title: 'Evénements et Actualités', id: 'evenements-et-actualites', icon: 'pi-calendar' },
      { title: 'Informations Pratiques', id: 'informations-pratiques', icon: 'pi-info-circle' },
      { title: 'Espace Communautaire', id: 'espace-communautaire', icon: 'pi-comments' },
      { title: 'Toujours Actifs', id: 'toujours-actifs', icon: 'pi-bolt' },
    ];
  }

  // Helper method to extract all available menus from all espaces
  getAllAvailableMenus(): Observable<string[]> {
    const allPages = this.getAvailablePages();
    const requests = allPages.map(page => this.getContent(page.id));

    return new Observable(observer => {
      Promise.all(requests.map(req => req.toPromise())).then(responses => {
        const allMenus = new Set<string>();
        responses.forEach(data => {
          if (data?.menus) {
            Object.keys(data.menus).forEach(menu => allMenus.add(menu));
          }
        });
        observer.next(Array.from(allMenus));
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  // Helper method to extract all main categories
  getAllMainCategories(): Observable<string[]> {
    const allPages = this.getAvailablePages();
    const requests = allPages.map(page => this.getContent(page.id));

    return new Observable(observer => {
      Promise.all(requests.map(req => req.toPromise())).then(responses => {
        const allCategories = new Set<string>();
        responses.forEach(data => {
          if (data?.menus) {
            Object.values(data.menus).forEach((menuData: any) => {
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
        observer.next(Array.from(allCategories));
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }
}
