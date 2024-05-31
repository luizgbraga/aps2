import { formatDistance } from 'date-fns';
import { capitalizeFirstLetter } from './string';
import { pt } from 'date-fns/locale';

export function dateDistance(date: Date, addSufix: boolean): string {
  return capitalizeFirstLetter(
    formatDistance(date, Date.now(), {
      addSuffix: addSufix,
      locale: pt,
    })
  );
}
