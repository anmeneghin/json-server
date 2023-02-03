
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Pagina } from './paginacao.service';


export interface Response {
  totalCount: number;
  result?: Item[];
}

export interface Item {
  id?: number;
  nome?: string;
  descricao?: string;
  data?: Date;
  status?: string;
  responsavel?: string;
}


export class ItensPagina extends Pagina {
  itens: Item[];

  constructor(itens: Item[], pagina: number, porPagina: number, totalItens: number) {
    super(pagina, porPagina, totalItens);
    this.itens = itens ?? [];
  }
}

@Injectable({
  providedIn: 'root'
})


export class JsonServerService {
  itens: Item[] | any = [];
  private readonly API = 'http://localhost:3000/itens';

  constructor(
    private httpService: HttpClient
  ) { }

  listarItensPaginados(filtro: string, page: number, perPage: number, nomeColuna: string, ordem: string, attFiltro: string): Observable<ItensPagina> {

    const url = this.API + '/?_page=' + page + '&_start=1' + '&_limit=' + perPage + '&_sort=' + nomeColuna + '&_order=' + ordem + '&' + attFiltro + '_like=' + filtro;

    return this.httpService.get<Response>(
      url,
      {
        observe: 'response',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }),
      }
    )
      .pipe(
        tap(res => console.log(res)),
        map((res) => {
          return new ItensPagina(res.body!.result ?? [], page, perPage, res.body!.totalCount);
        })
      );
  }

  listarItens(): Observable<Item[]> {
    return this.httpService.get<Item[]>(
      this.API,
      {
        observe: 'response',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }),
      }
    )
      .pipe(
        map((res) => {
          return res.body ?? [];
        })
      );

  }

  obterItem(id: any): Observable<Item> {
    return this.httpService
      .get<Item>(`${this.API}/${id}`, {
        observe: 'response',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }),
      })
      .pipe(
        map((res) => {
          let item: Item = res.body ?? {};
          return item;
        })
      );
  }

  excluirItem(id: any): Observable<Item> {
    return this.httpService
      .delete<Item>(`${this.API}/${id}`, {
        observe: 'response',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }),
      })
      .pipe(catchError((err) => this.handleError(err)));

  }

  adicionarItem(item: Item) {
    item.id = this.itens[this.itens.length - 1] + 1;

    return this.httpService
      .post<Item>(this.API, item, {
        observe: 'response',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }),
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  editarItem(id: any, item: Item) {
    return this.httpService
      .put<Item>(`${this.API}/${id}`, item, {
        observe: 'response',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }),
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  private handleError(error: any): Observable<any> {
    let errorMessage = '';

    if (
      error instanceof HttpErrorResponse &&
      error.error.hasOwnProperty('message')
    ) {
      // client-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.log('Cadastro Item Service Error: ', errorMessage);
    return throwError(errorMessage);
  }

  private _listeners = new Subject<any>();
  listen(): Observable<any> {
    return this._listeners.asObservable();
  }
  filter(filterBy: string) {
    this._listeners.next(filterBy);
  }
}

