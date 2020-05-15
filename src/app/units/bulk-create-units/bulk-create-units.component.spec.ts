import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkCreateUnitsComponent } from './bulk-create-units.component';

describe('BulkCreateUnitsComponent', () => {
  let component: BulkCreateUnitsComponent;
  let fixture: ComponentFixture<BulkCreateUnitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkCreateUnitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkCreateUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
