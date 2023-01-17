import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: 'asc' };

export interface TabelaConfigInterface {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
  selector: 'th[appTabelaSortable]',
})
export class TabelaSortableDirective {
  @Input() appTabelaSortable!: string;
  @Input() direction: SortDirection = 'asc';
  @Output() sort = new EventEmitter<SortEvent>();

  @HostListener('click') onClick(): void {
    this.rotate();
  }

  rotate(): void {
    this.direction = rotate[this.direction];
    this.sort.emit({
      column: this.appTabelaSortable,
      direction: this.direction,
    });
  }
}
