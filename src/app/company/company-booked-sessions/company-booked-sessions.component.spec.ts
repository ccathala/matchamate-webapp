import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBookedSessionsComponent } from './company-booked-sessions.component';

describe('CompanyBookedSessionsComponent', () => {
  let component: CompanyBookedSessionsComponent;
  let fixture: ComponentFixture<CompanyBookedSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyBookedSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyBookedSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
