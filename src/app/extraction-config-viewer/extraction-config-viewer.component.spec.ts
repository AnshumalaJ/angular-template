import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractionConfigViewerComponent } from './extraction-config-viewer.component';

describe('ExtractionConfigViewerComponent', () => {
  let component: ExtractionConfigViewerComponent;
  let fixture: ComponentFixture<ExtractionConfigViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtractionConfigViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtractionConfigViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
