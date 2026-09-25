import { Link } from 'react-router-dom';

import { Icon } from '@/components/icons';
import { ArabicText } from '@/components/ui/ArabicText';
import { Badge } from '@/components/ui/Badge';
import { routePaths } from '@/constants/routes';
import { grammarTopicLabel } from '@/features/grammar';
import type { GrammarLesson } from '@/types/content';
import { cn } from '@/utils/cn';

import styles from './Grammar.module.css';

export interface LessonCardProps {
  lesson: GrammarLesson;
  completed: boolean;
}

/** One lesson tile in the grammar library. Completion is shown by a badge, not colour alone. */
export function LessonCard({ lesson, completed }: LessonCardProps) {
  return (
    <li>
      <Link to={routePaths.grammarLesson(lesson.id)} className={styles.card}>
        <span className={styles.cardTop}>
          <span className={cn(styles.icon, completed && styles.iconCompleted)}>
            <Icon name={completed ? 'check' : lesson.icon} size={22} />
          </span>
          {completed ? (
            <Badge variant="success" size="sm" icon="check">
              Completed
            </Badge>
          ) : null}
        </span>

        <span className={styles.title}>{lesson.title}</span>
        <ArabicText className={styles.arabic}>{lesson.arabicTitle}</ArabicText>
        <span className={styles.summary}>{lesson.summary}</span>

        <span className={styles.meta}>
          <Badge variant="primary" size="sm">
            {lesson.level}
          </Badge>
          <span className={styles.topic}>{grammarTopicLabel(lesson.topic)}</span>
          <span className={styles.minutes}>{lesson.estimatedMinutes} min</span>
        </span>
      </Link>
    </li>
  );
}
