import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {

  transform(text: string, search: any): string {
    if (!search || search === undefined) {
      return text;
    } else {
      let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
      pattern = pattern.split(' ').filter((t: any) => {
        return t.length > 0;
      }).join('|');
      pattern = '(' + pattern + ')' + '(?![^<]*>)';
      const regex = new RegExp(pattern, 'gi');

      return search ? text.toString().replace(regex, (match) => `<span class="highlight">${match}</span>`) : text;
    }
  }

}
