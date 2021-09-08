import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { IPosition } from '../grid.component';

@Pipe({ name: 'safeGridArea' })
export class SafeGridAreaPipe implements PipeTransform
{
  constructor(private sanitizer: DomSanitizer) { }
  transform(pos: IPosition): SafeStyle
  {

    return this.sanitizer.bypassSecurityTrustStyle(`${(pos.cellY + 1)} / ${(pos.cellX + 1)} / ${pos.cellY + pos.spanY + 1} / ${pos.cellX + pos.spanX + 1}`);
  }
}
