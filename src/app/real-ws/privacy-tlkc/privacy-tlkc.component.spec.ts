import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyTlkcComponent } from './privacy-tlkc.component';

describe('PrivacyTlkcComponent', () => {
  let component: PrivacyTlkcComponent;
  let fixture: ComponentFixture<PrivacyTlkcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyTlkcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyTlkcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
