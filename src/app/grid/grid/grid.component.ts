import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

/** размер элемента сетки */
export interface ISize
{
  size: number;
  edIzm: 'px' | 'fr';
}

/** Координаты ячейки */
export interface ICell
{
  /** Позиция ячейки по горизонтали */
  cellX: number;
  /** Позиция ячейки по вертикали */
  cellY: number;
}

/** Позиция элемента в сетке */
export interface IPosition extends ICell
{
  /** размер элемента по горизонтали в ячейках */
  spanX: number;
  /** размер элемента по вертикали в ячейках */
  spanY: number;
}

/** Изменение положения */
export enum ResizeEnum
{
  none = 0,
  left = 1,
  top = 2,
  right = 3,
  bottom = 4,

  left_top = 5,
  left_bottom = 6,
  right_top = 7,
  right_bottom = 8,
  move = 9,
}

/** Размер области для изменения размера элемента */
const MOUSE_OFFSET = 7;

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnDestroy
{
  @ViewChild('root', { static: true }) root!: ElementRef<any>;
  @ViewChild('element', { static: true }) element!: ElementRef<any>;

  @Input() public rows: ISize[] = [{ size: 1, edIzm: 'fr' }];
  @Input() public columns: ISize[] = [{ size: 1, edIzm: 'fr' }];

  /** Положение элемента в сетке */
  public pos: IPosition = { cellX: 0, cellY: 0, spanX: 1, spanY: 1 }

  /** Координаты контрола сетка */
  private get Rect(): DOMRect
  {
    return this.root.nativeElement.getBoundingClientRect() as DOMRect;
  }
  /** Координаты элемента */
  private get ElementRect(): DOMRect
  {
    return this.element.nativeElement.getBoundingClientRect() as DOMRect;
  }

  /** Курсор показывает что мы делаем с элементом */
  public cursor: string = 'default';

  /** Сохранённое положение элемента в сетке */
  private savedPos: IPosition = { cellX: 0, cellY: 0, spanX: 1, spanY: 1 };
  /** Координаты мыши в ячейке сетки при нажатии */
  private savedMousePos: ICell = { cellX: 0, cellY: 0 };
  /** Тип действия с элементом */
  private resizeType = ResizeEnum.none;

  /** Конструктор */
  constructor() { }

  /** Уничтожение */
  ngOnDestroy(): void { this.unsubscribeMouse(); }

  // Вычисляем положение ячейки
  private getCell(x: number, y: number): ICell
  {
    const r = this.Rect;

    const xx = x - r.x;
    const yy = y - r.y;

    const xCounts = this.calcCounts(this.columns);
    const yCounts = this.calcCounts(this.rows);

    let w = r.width - xCounts.count;
    let h = r.height - yCounts.count;

    if (w < 0) w = 0;
    if (h < 0) h = 0;

    let dx = w / xCounts.countStar;
    let dy = h / yCounts.countStar;

    return {
      cellX: this.calcPos(this.columns, xx, dx),
      cellY: this.calcPos(this.rows, yy, dy)
    }
  }

  /** Считаем количество fr и px */
  private calcCounts(mas: ISize[]): { count: number, countStar: number }
  {
    let countStar = 0;
    let count = 0;

    mas.forEach(c =>
    {
      switch (c.edIzm)
      {
        case 'fr':
          countStar += c.size;
          break;
        case 'px':
          count += c.size;
          break;
      }
    });
    return { count, countStar };
  }

  /** Получаем позицию ячейки или по горизонтали или по вертикали */
  private calcPos(mas: ISize[], last: number, d: number): number
  {
    let start = 0;
    let end = 0;
    let cell = mas.length - 1;

    for (let i = 0; i < mas.length; i++)
    {
      const c = mas[i];
      const startSave = start;
      switch (c.edIzm)
      {
        case 'fr':
          start += d * c.size;
          break;
        case 'px':
          start += c.size;
          break;
      }
      if (start > last)
      {
        cell = i;
        end = start;

        for (let j = i + 1; j < i + 1 && j < mas.length; j++)
          switch (c.edIzm)
          {
            case 'fr':
              end += d * c.size;
              break;
            case 'px':
              end += c.size;
              break;
          }

        start = startSave;
        break;
      }
    }
    return cell;
  }

  /** Получить тип действия по координатам мыши */
  private getResizeType(e: MouseEvent): ResizeEnum
  {
    const cRect = this.ElementRect;
    const dLeft = e.clientX - cRect.left;
    const dRight = cRect.right - e.clientX;
    const dTop = e.clientY - cRect.top;
    const dBottom = cRect.bottom - e.clientY;

    if (
      dLeft >= 0 &&
      dLeft < MOUSE_OFFSET &&
      dTop >= 0 &&
      dTop < MOUSE_OFFSET)
      return ResizeEnum.left_top;
    else if (
      dLeft >= 0 &&
      dLeft < MOUSE_OFFSET &&
      dBottom >= 0 &&
      dBottom < MOUSE_OFFSET)
      return ResizeEnum.left_bottom;
    else if (
      dRight >= 0 &&
      dRight < MOUSE_OFFSET &&
      dTop >= 0 &&
      dTop < MOUSE_OFFSET)
      return ResizeEnum.right_top;
    else if (dRight >= 0 &&
      dRight < MOUSE_OFFSET &&
      dBottom >= 0 &&
      dBottom < MOUSE_OFFSET)
      return ResizeEnum.right_bottom;
    else if (
      dLeft >= 0 &&
      dLeft < MOUSE_OFFSET &&
      e.clientY >= cRect.top &&
      e.clientY <= cRect.bottom)
      return ResizeEnum.left;
    else if (
      dRight >= 0 &&
      dRight < MOUSE_OFFSET &&
      e.clientY >= cRect.top &&
      e.clientY <= cRect.bottom)
      return ResizeEnum.right;
    else if (
      dTop >= 0 &&
      dTop < MOUSE_OFFSET &&
      e.clientX >= cRect.left &&
      e.clientX <= cRect.right)
      return ResizeEnum.top;
    else if (
      dBottom >= 0 &&
      dBottom < MOUSE_OFFSET &&
      e.clientX >= cRect.left &&
      e.clientX <= cRect.right)
      return ResizeEnum.bottom;
    else if (
      e.clientX >= cRect.left &&
      e.clientX <= cRect.right &&
      e.clientY >= cRect.top &&
      e.clientY <= cRect.bottom)
      return ResizeEnum.move;
    else
      return ResizeEnum.none;
  }

  /** Обработчик события движения мышки на сетке */
  onMouseMove(e: MouseEvent): void
  {
    switch (this.getResizeType(e))
    {
      case ResizeEnum.left_top: this.cursor = 'se-resize'; break;
      case ResizeEnum.left_bottom: this.cursor = 'ne-resize'; break;
      case ResizeEnum.right_top: this.cursor = 'ne-resize'; break;
      case ResizeEnum.right_bottom: this.cursor = 'se-resize'; break;
      case ResizeEnum.top:
      case ResizeEnum.bottom: this.cursor = 'ns-resize'; break;
      case ResizeEnum.left:
      case ResizeEnum.right: this.cursor = 'w-resize'; break;
      case ResizeEnum.move: this.cursor = 'move'; break;
      case ResizeEnum.none: this.cursor = 'default'; break;
    }
  }

  /** Обработчик события движения мышки на элементе */
  onMouseDown(e: MouseEvent): void
  {
    // Сохраняем координату ячейки сетки для текущего положения мышки
    this.savedMousePos = this.getCell(e.clientX, e.clientY);
    // Сохраняем текущее положение элемента
    this.savedPos = { ...this.pos };

    const rType = this.getResizeType(e);
    if (
      rType > ResizeEnum.none &&
      rType < ResizeEnum.move)
    {
      // Действие изменение размера
      this.resizeType = rType;

      // Подписываемся на события мышки для изменения размеров
      window.addEventListener('mousemove', this.handleResizeContentMousemove, true);
      window.addEventListener('mouseup', this.handleContentMouseup, true);

    }
    else
    {
      // Подписываемся на события мышки для перемещения
      window.addEventListener('mousemove', this.handleContentMousemove, true);
      window.addEventListener('mouseup', this.handleContentMouseup, true);
    }
  }

  /** Отписываемся от событий */
  private unsubscribeMouse(): void
  {
    this.cursor = 'default';
    window.removeEventListener('mousemove', this.handleContentMousemove, true);
    window.removeEventListener('mousemove', this.handleResizeContentMousemove, true);
    window.removeEventListener('mouseup', this.handleContentMouseup, true);
  }

  /** Обработчик события движения мышки по элементу (перемещение элемента) */
  private handleContentMousemove = (e: MouseEvent): void =>
  {
    // Координата ячейки сетки для текущего положения мышки
    const cell = this.getCell(e.clientX, e.clientY);

    // Смещение по X
    const dx = cell.cellX - this.savedMousePos.cellX;
    // Смещение по Y
    const dy = cell.cellY - this.savedMousePos.cellY;

    this.pos = {
      ...this.pos,
      cellX: this.savedPos.cellX + dx,
      cellY: this.savedPos.cellY + dy
    };
  };

  /** Обработчик события отпускания кнопки мышки на элементе */
  private handleContentMouseup = (e: MouseEvent): void => this.unsubscribeMouse();

  /** Обработчик события движения мышки для изменения размеров элемента */
  private handleResizeContentMousemove = (e: MouseEvent): void =>
  {
    const r = this.getCell(e.clientX, e.clientY);
    let left = this.savedPos.cellX;
    let right = this.savedPos.cellX + this.savedPos.spanX - 1;
    let top = this.pos.cellY;
    let bottom = this.savedPos.cellY + this.savedPos.spanY - 1;

    switch (this.resizeType)
    {
      case ResizeEnum.left:
      case ResizeEnum.right:
        left = this.savedPos.cellX;
        right = r.cellX;

        if (left > right)
          // Меняем координаты местами
          [left, right] = [right, left];

        break;
      case ResizeEnum.top:
      case ResizeEnum.bottom:
        top = this.savedPos.cellY;
        bottom = r.cellY;

        if (top > bottom)
          // Меняем координаты местами
          [top, bottom] = [bottom, top];

        break;
      case ResizeEnum.left_top:
      case ResizeEnum.left_bottom:
      case ResizeEnum.right_top:
      case ResizeEnum.right_bottom:
        left = this.savedPos.cellX;
        top = this.savedPos.cellY;
        right = r.cellX;
        bottom = r.cellY;

        if (left > right)
          // Меняем координаты местами
          [left, right] = [right, left];

        if (top > bottom)
          // Меняем координаты местами
          [top, bottom] = [bottom, top];

        break;
    }

    this.pos = {
      ...this.pos,
      cellX: left,
      cellY: top,
      spanX: right - left + 1,
      spanY: bottom - top + 1
    };
  };
}
