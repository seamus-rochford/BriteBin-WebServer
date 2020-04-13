import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitReadingsComponent } from './unit-readings.component';

describe('UnitReadingsComponent', () => {
  let component: UnitReadingsComponent;
  let fixture: ComponentFixture<UnitReadingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitReadingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitReadingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
