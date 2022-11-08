import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbscRankingColorsComponent } from './bbsc-ranking-colors.component';

describe('BbscRankingColorsComponent', () => {
  let component: BbscRankingColorsComponent;
  let fixture: ComponentFixture<BbscRankingColorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbscRankingColorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BbscRankingColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
