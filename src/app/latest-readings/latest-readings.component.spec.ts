import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestReadingsComponent } from './latest-readings.component';

describe('LatestReadingsComponent', () => {
  let component: LatestReadingsComponent;
  let fixture: ComponentFixture<LatestReadingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestReadingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestReadingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
