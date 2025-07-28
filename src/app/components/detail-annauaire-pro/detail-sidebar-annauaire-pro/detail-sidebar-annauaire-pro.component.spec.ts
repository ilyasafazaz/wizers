import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSidebarAnnauaireProComponent } from './detail-sidebar-annauaire-pro.component';

describe('DetailSidebarAnnauaireProComponent', () => {
  let component: DetailSidebarAnnauaireProComponent;
  let fixture: ComponentFixture<DetailSidebarAnnauaireProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailSidebarAnnauaireProComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailSidebarAnnauaireProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
