import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDate(first_publication_date: any): any {
  return format(new Date(first_publication_date), 'dd MMM yyyy', {
    locale: ptBR,
  });
}
