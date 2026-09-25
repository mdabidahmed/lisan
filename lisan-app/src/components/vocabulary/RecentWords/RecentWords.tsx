import { Link } from 'react-router-dom';

import { ArabicText } from '@/components/ui/ArabicText';
import { WordThumbnail } from '@/components/ui/WordThumbnail';
import { routePaths } from '@/constants/routes';
import type { VocabularyWord } from '@/types/content';
import { cn } from '@/utils/cn';

import styles from './RecentWords.module.css';

export interface RecentWordsProps {
  words: readonly VocabularyWord[];
  className?: string | undefined;
}

/** Horizontally scrollable strip of recently studied words. */
export function RecentWords({ words, className }: RecentWordsProps) {
  if (words.length === 0) return null;

  return (
    <ul className={cn(styles.strip, 'u-scroll-x', className)}>
      {words.map((word) => (
        <li key={word.id} className={styles.item}>
          <Link to={routePaths.wordDetail(word.id)} className={styles.tile}>
            <WordThumbnail
              wordId={word.id}
              arabic={word.arabic}
              {...(word.image ? { src: word.image } : {})}
              size={52}
            />
            <span className={styles.copy}>
              <ArabicText className={styles.arabic}>{word.arabic}</ArabicText>
              <span className={styles.transliteration}>{word.transliteration}</span>
              <span className={styles.english}>{word.english}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
