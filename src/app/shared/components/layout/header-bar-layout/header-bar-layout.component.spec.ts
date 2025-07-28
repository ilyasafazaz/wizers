import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBarLayoutComponent } from './header-bar-layout.component';

describe('HeaderBarLayoutComponent', () => {
  let component: HeaderBarLayoutComponent;
  let fixture: ComponentFixture<HeaderBarLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderBarLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderBarLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
