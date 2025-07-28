import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailOffrePromoComponent } from './detail-offre-promo.component';

describe('DetailOffrePromoComponent', () => {
  let component: DetailOffrePromoComponent;
  let fixture: ComponentFixture<DetailOffrePromoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailOffrePromoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailOffrePromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
