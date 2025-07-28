import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMenuAnnauaireProComponent } from './detail-menu-annauaire-pro.component';

describe('DetailMenuAnnauaireProComponent', () => {
  let component: DetailMenuAnnauaireProComponent;
  let fixture: ComponentFixture<DetailMenuAnnauaireProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailMenuAnnauaireProComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailMenuAnnauaireProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
