import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailHeaderAnnauaireProComponent } from './detail-header-annauaire-pro.component';

describe('DetailHeaderAnnauaireProComponent', () => {
  let component: DetailHeaderAnnauaireProComponent;
  let fixture: ComponentFixture<DetailHeaderAnnauaireProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailHeaderAnnauaireProComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailHeaderAnnauaireProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
