import { Component, ElementRef } from '@angular/core';
import { ISize } from './grid/grid/grid.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent
{
  public style =
    `
.image__pipe_vertical {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpath d='M25 0h50v100H25z'/%3E%3Cpath fill='%23f0d728' d='M27-1.657h46v104.419H27z'/%3E%3C/svg%3E");
}

.image__pipe_horizontal {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpath d='M0 25h100v50H0z'/%3E%3Cpath fill='%23f0d728' d='M-3.214 27h107.5v46h-107.5z'/%3E%3C/svg%3E");
}

.image__pipe_rotate-bottom-right {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpath d='M25 75c.074-26.914 21.153-49.784 50-50h25v50h-5c-13.025-.172-20 6.339-20 20v5H25z' fill='%2300000d'/%3E%3Cpath d='M27 76.333C26.703 50.548 47.037 27.035 74.333 27H100v46h-7.996C79.674 73.551 73 82.333 73 95.266V100H27z' fill='%23f0d728'/%3E%3C/svg%3E");
}
`;

  public rows: ISize[] = [
    { size: 1, edIzm: 'fr' },
    { size: 1, edIzm: 'fr' },
    { size: 1, edIzm: 'fr' },
    { size: 1, edIzm: 'fr' },
    { size: 1, edIzm: 'fr' },
    { size: 1, edIzm: 'fr' },
    { size: 1, edIzm: 'fr' },
    { size: 1, edIzm: 'fr' },
    { size: 1, edIzm: 'fr' },
    { size: 1, edIzm: 'fr' }];

  public columns: ISize[] = [
    { size: 1, edIzm: 'fr' },
    { size: 1, edIzm: 'fr' },
    { size: 1, edIzm: 'fr' },
    { size: 1, edIzm: 'fr' },
    { size: 1, edIzm: 'fr' },
    { size: 1, edIzm: 'fr' },
    { size: 1, edIzm: 'fr' },
    { size: 1, edIzm: 'fr' },
    { size: 1, edIzm: 'fr' },
    { size: 1, edIzm: 'fr' }];


  constructor(element: ElementRef)
  {
    const sElement = document.createElement('style');
    sElement.innerHTML = this.style;
    element.nativeElement.append(sElement);

  }
}
