import { type OccurrenceType } from '../api/occurences';

export const translateType = (type: OccurrenceType) => {
  switch (type) {
    case 'flooding':
      return 'Alagamento';
    case 'landslide':
      return 'Deslizamento';
    case 'congestion':
      return 'Congestionamento';
    default:
      return 'Desconhecido';
  }
};
