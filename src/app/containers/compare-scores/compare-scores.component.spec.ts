import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareScoresComponent } from './compare-scores.component';

describe('CompareScoresComponent', () => {
  let component: CompareScoresComponent;
  let fixture: ComponentFixture<CompareScoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareScoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
