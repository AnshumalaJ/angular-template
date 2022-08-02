import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McTreestructureJsonEditorComponent } from './mc-treestructure-json-editor.component';

describe('McTreestructureJsonEditorComponent', () => {
  let component: McTreestructureJsonEditorComponent;
  let fixture: ComponentFixture<McTreestructureJsonEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McTreestructureJsonEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(McTreestructureJsonEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
