/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GetStaticPaths, GetStaticProps } from 'next';
import { useState } from 'react';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';
import { formatDate } from '../../utils/forrmatDate';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Header from '../../components/Header';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: any) {
  const [currentPost, setPost] = useState(post);
  currentPost.content.map(item => console.log(item));

  return (
    <>
      <Header />
      <img
        src={currentPost.data.banner.url}
        alt="banner"
        className={styles.banner}
      />
      <main className={commonStyles.container}>
        <div className={styles.post}>
          <div className={styles.postTop}>
            <h1>{currentPost.title}</h1>
            <ul>
              <li>
                <time>
                  <FiCalendar /> {currentPost.first_publication_date}
                </time>
              </li>
              <li>
                <span>
                  <FiUser /> {currentPost.author}
                </span>
              </li>
              <li>
                <span>
                  <FiClock /> 5 min
                </span>
              </li>
            </ul>
          </div>
          <div>
            {currentPost.content.map((item: any) => (
              <article key={item.heading}>
                <h2>{item.heading}</h2>
                <div
                  className={styles.postContent}
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(item.body),
                  }}
                />
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query();

  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});
  const content = response.data.content.map(item => ({
    heading: item.heading,
    body: [...item.body],
  }));

  const post = {
    slug: response.uid,
    title: response.data.title,
    author: response.data.author,
    first_publication_date: formatDate(response.first_publication_date),
    data: {
      banner: response.data.banner,
    },
    content,
  };

  // console.log(response.data.content.heading);

  return {
    props: {
      post,
    },
  };
};
