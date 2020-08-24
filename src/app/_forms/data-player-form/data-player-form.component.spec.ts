import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPlayerFormComponent } from './data-player-form.component';

describe('DataPlayerFormComponent', () => {
  let component: DataPlayerFormComponent;
  let fixture: ComponentFixture<DataPlayerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPlayerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPlayerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
