import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphCasesComponent } from './graph-cases.component';

describe('GraphCasesComponent', () => {
  let component: GraphCasesComponent;
  let fixture: ComponentFixture<GraphCasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphCasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
