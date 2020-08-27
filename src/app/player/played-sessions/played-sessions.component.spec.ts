import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayedSessionsComponent } from './played-sessions.component';

describe('PlayedSessionsComponent', () => {
  let component: PlayedSessionsComponent;
  let fixture: ComponentFixture<PlayedSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayedSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayedSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
