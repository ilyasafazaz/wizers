import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownLayoutComponent } from './dropdown-layout.component';

describe('DropdownLayoutComponent', () => {
  let component: DropdownLayoutComponent;
  let fixture: ComponentFixture<DropdownLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DropdownLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
