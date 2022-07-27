import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxJsonViewerComponent } from './json-expaned.component';

describe('JsonExpanedComponent', () => {
  let component: NgxJsonViewerComponent;
  let fixture: ComponentFixture<NgxJsonViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxJsonViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxJsonViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
