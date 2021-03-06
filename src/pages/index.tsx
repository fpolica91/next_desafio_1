import { GetStaticProps } from 'next';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { formatter } from '../utils/formatter';
import Header from '../components/Header';

interface Post {
  slug?: string;
  first_publication_date: string | null;
  content: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState<string>(postsPagination.next_page);

  const loadNextPosts = async (): Promise<void> => {
    const response = await fetch(nextPage);
    const data = await response.json();
    const results = data.results.map(post => formatter(post));
    setPosts([...posts, ...results]);
    setNextPage(data.next_page);
  };

  return (
    <>
      <Head> Home </Head>
      <main className={commonStyles.container}>
        <Header />
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/post/${post.slug}`} key={post.slug}>
              <a>
                <strong>{post.content.title}</strong>
                <p>{post.content.subtitle}</p>
                <ul>
                  <li>
                    <FiCalendar />
                    <time>{post.first_publication_date}</time>
                  </li>
                  <li>
                    <FiUser />
                    {post.content.author}
                  </li>
                </ul>
              </a>
            </Link>
          ))}
        </div>
        {nextPage && (
          <button
            className={styles.nextPage}
            type="button"
            onClick={loadNextPosts}
          >
            carregar mas posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      orderings: '[document.first_publication_date desc]',
    }
  );

  const posts = postsResponse.results.map(post => formatter(post));

  const postsPagination = {
    results: posts,
    next_page: postsResponse.next_page,
  };

  // const posts = postsResponse.results;
  // TODO
  return {
    props: {
      postsPagination,
    },
  };
};
