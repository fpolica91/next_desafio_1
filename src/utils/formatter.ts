import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface FormattedPost {
  slug?: string;
  first_publication_date: string | null;
  content: {
    title: string;
    subtitle: string;
    author: string;
  };
}

export function formatter(post: Post): FormattedPost {
  return {
    slug: post.uid,
    first_publication_date: format(
      new Date(post.first_publication_date),
      'dd MMM yyyy',
      { locale: ptBR }
    ),
    content: {
      author: post.data.author,
      title: post.data.title,
      subtitle: post.data.subtitle,
    },
  };
}
