import { Link } from 'react-router-dom';

import { Icon } from '@/components/icons';
import { ArabicText } from '@/components/ui/ArabicText';
import { Badge } from '@/components/ui/Badge';
import { WordThumbnail } from '@/components/ui/WordThumbnail';
import { routePaths } from '@/constants/routes';
import { WORD_STATUS_LABEL, WORD_STATUS_VARIANT } from '@/features/vocabulary/wordStatus';
import { useWordStatus } from '@/store/progressStore';
import type { VocabularyWord } from '@/types/content';

import styles from './ReviewQueue.module.css';

export interface ReviewQueueItemProps {
  word: VocabularyWord;
}

/** One due word. Reads its own status so the queue shows why the word came back. */
export function ReviewQueueItem({ word }: ReviewQueueItemProps) {
  const status = useWordStatus(word.id);

  return (
    <Link to={routePaths.wordDetail(word.id)} className={styles.item}>
      <WordThumbnail
        wordId={word.id}
        arabic={word.arabic}
        {...(word.image ? { src: word.image } : {})}
        size={44}
      />
      <span className={styles.copy}>
        <ArabicText className={styles.arabic}>{word.arabic}</ArabicText>
        <span className={styles.english}>{word.english}</span>
      </span>
      <Badge variant={WORD_STATUS_VARIANT[status]} size="sm">
        {WORD_STATUS_LABEL[status]}
      </Badge>
      <Icon name="chevron-right" size={18} className={styles.chevron} />
    </Link>
  );
}
