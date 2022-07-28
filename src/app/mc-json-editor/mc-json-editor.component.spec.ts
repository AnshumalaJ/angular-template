import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McJsonEditorComponent } from './mc-json-editor.component';

describe('McJsonEditorComponent', () => {
  let component: McJsonEditorComponent;
  let fixture: ComponentFixture<McJsonEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McJsonEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(McJsonEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
