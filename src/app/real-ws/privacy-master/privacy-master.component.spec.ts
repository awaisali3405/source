import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyMasterComponent } from './privacy-master.component';

describe('PrivacyMasterComponent', () => {
  let component: PrivacyMasterComponent;
  let fixture: ComponentFixture<PrivacyMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
