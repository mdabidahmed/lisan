import { Link } from 'react-router-dom';

import { illustrations } from '@/assets';
import { Icon } from '@/components/icons';
import { ROUTES } from '@/constants/routes';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { ARABIC_CONTENT_ATTRS } from '@/i18n';

import styles from './NotFound.module.css';

export function NotFoundPage() {
  useDocumentMeta({
    title: 'Page not found',
    description: 'The page you were looking for does not exist.',
  });

  return (
    <div className={styles.wrapper}>
      <img
        className={styles.illustration}
        src={illustrations.notFound.src}
        alt=""
        width={illustrations.notFound.width}
        height={illustrations.notFound.height}
        decoding="async"
      />
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.arabic} {...ARABIC_CONTENT_ATTRS}>
        الصَّفْحَةُ غَيْرُ مَوْجُودَة
      </p>
      <p className={styles.body}>
        The page you were looking for does not exist. It may have moved, or the link may be out of
        date.
      </p>
      <Link to={ROUTES.home} className={styles.cta}>
        Back to home
        <Icon name="arrow-right" size={18} />
      </Link>
    </div>
  );
}
