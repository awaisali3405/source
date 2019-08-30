import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphVariantTracesComponent } from './graph-variant-traces.component';

describe('GraphVariantTracesComponent', () => {
  let component: GraphVariantTracesComponent;
  let fixture: ComponentFixture<GraphVariantTracesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphVariantTracesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphVariantTracesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
