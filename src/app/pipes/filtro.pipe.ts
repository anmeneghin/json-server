import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'arrayFiltro' })

export class ArrayFiltroPipe implements PipeTransform {

  transform(value: Array<any>, filtro: any): any {
    if (filtro) {
      filtro = filtro.toUpperCase();
      return value.filter(a =>
        a.nome.toUpperCase().indexOf(filtro) >= 0 ||
        a.descricao.toUpperCase().indexOf(filtro) >= 0 ||
        a.data.toString().indexOf(filtro) >= 0 ||
        a.status.toUpperCase().indexOf(filtro) >= 0 ||
        a.responsavel.toUpperCase().indexOf(filtro) >= 0
      );


    } else {
      // Quando filtro for vazio ou nulo,
      // retornamos o próprio array
      return value;
    }
  }
}
