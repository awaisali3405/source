import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyConnectorComponent } from './privacy-connector.component';

describe('PrivacyConnectorComponent', () => {
  let component: PrivacyConnectorComponent;
  let fixture: ComponentFixture<PrivacyConnectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyConnectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
