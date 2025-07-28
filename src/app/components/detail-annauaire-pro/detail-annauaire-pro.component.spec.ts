import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAnnauaireProComponent } from './detail-annauaire-pro.component';

describe('DetailAnnauaireProComponent', () => {
  let component: DetailAnnauaireProComponent;
  let fixture: ComponentFixture<DetailAnnauaireProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailAnnauaireProComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailAnnauaireProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
