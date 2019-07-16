import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyRolesComponent } from './privacy-roles.component';

describe('PrivacyRolesComponent', () => {
  let component: PrivacyRolesComponent;
  let fixture: ComponentFixture<PrivacyRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
