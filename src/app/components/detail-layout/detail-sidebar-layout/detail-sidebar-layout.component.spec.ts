import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSidebarLayoutComponent } from './detail-sidebar-layout.component';

describe('DetailSidebarLayoutComponent', () => {
  let component: DetailSidebarLayoutComponent;
  let fixture: ComponentFixture<DetailSidebarLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailSidebarLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailSidebarLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
