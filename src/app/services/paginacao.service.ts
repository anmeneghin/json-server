import { Injectable } from '@angular/core';
export class Pagina {
  pagina: number;
  porPagina: number;
  totalItens: number;

  totalPaginas(): number {
    return Math.ceil(this.totalItens / this.porPagina);
  }

  constructor(pagina: number, porPagina: number, totalItens: number) {
    this.pagina = pagina;
    this.porPagina = porPagina;
    this.totalItens = totalItens;
  }
}
@Injectable({
  providedIn: 'root'
})

export class PaginacaoService {
  constructor() {/* - */ }

  createPager(pagina: Pagina) {
    return this.getPager(pagina.totalItens ?? 0, pagina.pagina, pagina.porPagina, pagina.totalPaginas())
  }

  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10, totalPages: number = 0) {
    // calculate total pages
    if (totalPages === 0) {
      totalPages = Math.ceil(totalItems / pageSize);
    }


    // ensure current page isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let startPage: number, endPage: number;

    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    const pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
      i => startPage + i
    );


    // console.log(pages);
    // return object with all pager properties required by the view
    return {
      totalItems: (totalItems as number),
      currentPage: (currentPage as number),
      pageSize: (pageSize as number),
      totalPages: (totalPages as number),
      startPage: (startPage as number),
      endPage: (endPage as number),
      startIndex: (startIndex as number),
      endIndex: (endIndex as number),
      pages: (pages as number[])
    };
  }
}
