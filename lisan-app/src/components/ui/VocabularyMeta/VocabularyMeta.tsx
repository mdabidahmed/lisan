import { Badge } from '@/components/ui/Badge';
import type { BadgeVariant, CEFRLevel, WordStatus } from '@/types';
import { cn } from '@/utils';

import styles from './VocabularyMeta.module.css';

export interface VocabularyMetaProps {
  categoryName?: string | undefined;
  level?: CEFRLevel | undefined;
  partOfSpeech?: string | undefined;
  status?: WordStatus | undefined;
  className?: string | undefined;
}

const STATUS_LABEL: Record<WordStatus, string> = {
  new: 'New',
  learning: 'Learning',
  review: 'Due for review',
  mastered: 'Mastered',
};

const STATUS_VARIANT: Record<WordStatus, BadgeVariant> = {
  new: 'info',
  learning: 'warning',
  review: 'purple',
  mastered: 'success',
};

/** Category, CEFR level, part of speech and learning status as a single wrapping chip row. */
export function VocabularyMeta({
  categoryName,
  level,
  partOfSpeech,
  status,
  className,
}: VocabularyMetaProps) {
  if (!categoryName && !level && !partOfSpeech && !status) return null;

  return (
    <div className={cn(styles.root, className)}>
      {categoryName ? (
        <Badge variant="neutral" size="sm">
          {categoryName}
        </Badge>
      ) : null}
      {level ? (
        <Badge variant="primary" size="sm">
          {level}
        </Badge>
      ) : null}
      {partOfSpeech ? <span className={styles.partOfSpeech}>{partOfSpeech}</span> : null}
      {status ? (
        <Badge
          variant={STATUS_VARIANT[status]}
          size="sm"
          {...(status === 'mastered' ? { icon: 'check' as const } : {})}
        >
          {STATUS_LABEL[status]}
        </Badge>
      ) : null}
    </div>
  );
}
