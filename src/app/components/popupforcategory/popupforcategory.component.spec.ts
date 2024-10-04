import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupforcategoryComponent } from './popupforcategory.component';

describe('PopupforcategoryComponent', () => {
  let component: PopupforcategoryComponent;
  let fixture: ComponentFixture<PopupforcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupforcategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupforcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
