import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskGroupDetail } from './task-group-detail';

describe('TaskGroupDetail', () => {
  let component: TaskGroupDetail;
  let fixture: ComponentFixture<TaskGroupDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskGroupDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskGroupDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
