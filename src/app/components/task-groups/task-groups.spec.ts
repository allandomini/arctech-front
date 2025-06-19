import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskGroups } from './task-groups';

describe('TaskGroups', () => {
  let component: TaskGroups;
  let fixture: ComponentFixture<TaskGroups>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskGroups]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskGroups);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
