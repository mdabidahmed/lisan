import { Link } from 'react-router-dom';

import { Icon } from '@/components/icons';
import { ROUTES } from '@/constants/routes';

import styles from './ReminderCard.module.css';

export interface ReminderCardProps {
  title?: string;
  description?: string;
  tipTitle?: string;
  tip?: string;
}

/** "Daily Reminder" encouragement card (reference screen 1). The whole card links into practice. */
export function ReminderCard({
  title = 'Daily Reminder',
  description = 'A little progress each day leads to big results.',
  tipTitle = 'Keep your daily habit',
  tip = 'A few minutes every day makes a difference.',
}: ReminderCardProps) {
  return (
    <Link to={ROUTES.practice} className={styles.card}>
      <div className={styles.row}>
        <span className={styles.badge}>
          <Icon name="study-time" size={22} />
        </span>
        <div className={styles.copy}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
      </div>

      <div className={styles.tip}>
        <span className={styles.tipIcon}>
          <Icon name="streak" size={20} />
        </span>
        <div>
          <p className={styles.tipTitle}>{tipTitle}</p>
          <p className={styles.tipText}>{tip}</p>
        </div>
      </div>
    </Link>
  );
}
