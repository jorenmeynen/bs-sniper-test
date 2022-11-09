import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsvComponent } from './hsv.component';

describe('HsvComponent', () => {
  let component: HsvComponent;
  let fixture: ComponentFixture<HsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HsvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
