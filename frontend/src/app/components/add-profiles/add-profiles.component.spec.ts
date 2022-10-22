import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProfilesComponent } from './add-profiles.component';

describe('AddProfilesComponent', () => {
  let component: AddProfilesComponent;
  let fixture: ComponentFixture<AddProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProfilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
