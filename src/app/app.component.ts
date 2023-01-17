import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { fromEvent, Subject, Subscription } from 'rxjs';

import { JsonServerService, Item } from './services/json-server.service';
import { PaginacaoService } from './services/paginacao.service';
import { debounceTime, filter, tap } from 'rxjs/operators';

import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fade', [
      state('void',
        style({
          opacity: 0
        })
      ),
      transition(':enter, :leave', [
        animate('250ms')
      ])
    ])
  ],
})
export class AppComponent {
  @Input() carregaItemEvent!: any;
  @Input() itemElement: any;
  @Input() term: any;

  @ViewChild('campoBusca') campoBusca!: ElementRef<HTMLInputElement>;

  sort = new Subject();
  error$ = new Subject<boolean>();

  subscriptions: Subscription[] = [];

  loading: boolean = true;

  sortParams: any = { type: 'nome', orientation: 'asc' };
  selectedOption!: any;
  obj: any;
  itens: Item[] = [];
  itensPagina: any;

  modalOpen: boolean = false;

  filtro: string = '';
  action!: string;
  icon!: string;

  perPage = 10;
  currentPage: number = 1;

  tableOptions = [
    { id: 1, label: '5 itens por página', value: 5 },
    { id: 2, label: '10 itens por página', value: 10 },
    { id: 3, label: '20 itens por página', value: 20 },
  ];

  constructor(
    private jsonServerService: JsonServerService,
    private paginacaoService: PaginacaoService,
    public router: Router) {
    this.jsonServerService.listen().subscribe(() => {
      this.reload(1);
    });
  }

  ngOnInit(): void {
    this.selectedOption = this.tableOptions[1].label;
    this.reload(1);

    this.subscriptions.push(
      this.sort.asObservable()
        .pipe(
          tap(() => this.loading = true),
          filter((sortParams: any) => sortParams.type !== this.sortParams.type || sortParams.orientation !== this.sortParams.orientation),
          tap(sortParms => this.sortParams = sortParms),
          tap(() => this.reload(1))
        )
        .subscribe()
    );
  }

  ngAfterViewInit() {
    fromEvent(this.campoBusca.nativeElement, 'keyup')
      .pipe(
        debounceTime(500)
      )
      .subscribe((e: Event) => {
        const target = e.target as HTMLInputElement;
        this.filtro = target.value;
        this.reload(1);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['carregaItemEvent'] && changes['carregaItemEvent'].currentValue === undefined) {
      console.log('On changes: ', this.carregaItemEvent);
    }
    else if (changes['carregaItemEvent'] && changes['carregaItemEvent'].currentValue !== changes['carregaItemEvent']) {
      console.log('On changes: ', this.carregaItemEvent);
      this.reload(1);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  // ----------------------------------Sort da Tabela-------------------------------------------
  onSort(type: string): void {
    if (type === this.sortParams.type) {
      const orientation = this.sortParams.orientation === 'desc' ? 'asc' : 'desc';
      this.sort.next({ type: type, orientation: orientation });
    } else {
      this.sort.next({ type: type, orientation: 'desc' });
    }
  }

  // ----------------------------------Recarregamento dos dados-------------------------------------------
  reload(page: number): void {
    this.currentPage = page;

    this.jsonServerService.listarItensPaginados(this.filtro, this.currentPage, this.perPage, this.sortParams.type, this.sortParams.orientation)
      .subscribe(pag => {
        this.itens = pag.itens;

        this.itensPagina = this.paginacaoService.createPager(pag);

        this.loading = false;
      });
  }

  // ----------------------------------ABRIR MODAL-------------------------------------------
  openModal(action: string, obj: any, icon: string, open: boolean): void {
    this.modalOpen = open;
    this.action = action;
    this.obj = obj;
    this.icon = icon;
  }

  // ----------------------------------EDITAR-------------------------------------------
  editar(url: string, itemObj: any): void {
    this.router.navigate([url, { id: itemObj.id }]);
  }

  btnChangeRouter(value: string): void {
    this.router.navigateByUrl(value);
  }

  // ----------------------------------Função do dropdown para definir a quantidade de itens a serem exibidos por página-------------------------------------------
  setItensPorPagina(item: any): void {
    this.perPage = item.value;
    this.loading = true;
    this.selectedOption = item.label;

    this.reload(1);
  }
}
