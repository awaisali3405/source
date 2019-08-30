import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DottedchartComponent } from './dottedchart.component';

describe('DottedchartComponent', () => {
  let component: DottedchartComponent;
  let fixture: ComponentFixture<DottedchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DottedchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DottedchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
