import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMenuLayoutComponent } from './detail-menu-layout.component';

describe('DetailMenuLayoutComponent', () => {
  let component: DetailMenuLayoutComponent;
  let fixture: ComponentFixture<DetailMenuLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailMenuLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailMenuLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
