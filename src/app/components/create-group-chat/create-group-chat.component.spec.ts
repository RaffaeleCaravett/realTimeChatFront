import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGroupChatComponent } from './create-group-chat.component';

describe('CreateGroupChatComponent', () => {
  let component: CreateGroupChatComponent;
  let fixture: ComponentFixture<CreateGroupChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateGroupChatComponent]
    });
    fixture = TestBed.createComponent(CreateGroupChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
