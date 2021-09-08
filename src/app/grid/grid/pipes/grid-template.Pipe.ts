import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ISize } from '../grid.component';

@Pipe({ name: 'safeGridTemplate' })
export class SafeGridTemplatePipe implements PipeTransform
{
  constructor(private sanitizer: DomSanitizer) { }
  transform(sizes: ISize[]): SafeStyle
  {
    if ((sizes?.length ?? 0) === 0) sizes = [{ size: 1, edIzm: 'fr' }];
    return this.sanitizer.bypassSecurityTrustStyle(sizes.map(s => s.size + s.edIzm).join(' '));
  }
}
