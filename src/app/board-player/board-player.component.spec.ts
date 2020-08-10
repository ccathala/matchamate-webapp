import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardPlayerComponent } from './board-player.component';

describe('BoardPlayerComponent', () => {
  let component: BoardPlayerComponent;
  let fixture: ComponentFixture<BoardPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
