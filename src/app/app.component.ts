import { Component } from '@angular/core';
import { ISize } from './grid/grid/grid.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent
{
  public rows: ISize[] = [
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
    { size: 1, edIzm: 'fr' }];
}
