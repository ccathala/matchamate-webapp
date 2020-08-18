import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCompanyFormComponent } from './data-company-form.component';

describe('DataCompanyFormComponent', () => {
  let component: DataCompanyFormComponent;
  let fixture: ComponentFixture<DataCompanyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataCompanyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCompanyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
