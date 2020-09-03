import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPlayedSessionsComponent } from './company-played-sessions.component';

describe('CompanyPlayedSessionsComponent', () => {
  let component: CompanyPlayedSessionsComponent;
  let fixture: ComponentFixture<CompanyPlayedSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyPlayedSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyPlayedSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
