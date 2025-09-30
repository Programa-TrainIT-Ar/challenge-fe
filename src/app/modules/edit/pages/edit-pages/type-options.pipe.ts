import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeOptions',
  standalone: true
})
export class TypeOptionsPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
    if('multiple_choice' === value) return 'Selección mutiple';
    if('simple_choice' === value) return 'Casilla';
    if('true_false' === value) return 'Verdadero o falso';
    return 'Tipo no disponible';
  }

}
