import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSessionFormComponent } from './create-session-form.component';

describe('CreateSessionFormComponent', () => {
  let component: CreateSessionFormComponent;
  let fixture: ComponentFixture<CreateSessionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSessionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSessionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
