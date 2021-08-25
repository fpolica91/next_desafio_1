/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
import Link from 'next/link';
import styles from './header.module.scss';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function Header() {
  return (
    <div className={styles.postHeader}>
      <Link href="/">
        <a href="/">
          <img src="/logo.svg" alt="spacetraveling" />
        </a>
      </Link>
    </div>
  );
}
