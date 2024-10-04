import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcComponentComponent } from './dc-component.component';

describe('DcComponentComponent', () => {
  let component: DcComponentComponent;
  let fixture: ComponentFixture<DcComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DcComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DcComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
