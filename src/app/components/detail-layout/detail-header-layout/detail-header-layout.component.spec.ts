import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailHeaderLayoutComponent } from './detail-header-layout.component';

describe('DetailHeaderLayoutComponent', () => {
  let component: DetailHeaderLayoutComponent;
  let fixture: ComponentFixture<DetailHeaderLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailHeaderLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailHeaderLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
