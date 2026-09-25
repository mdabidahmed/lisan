import { Link } from 'react-router-dom';

import { ArabicText } from '@/components/ui/ArabicText';
import { WordThumbnail } from '@/components/ui/WordThumbnail';
import { routePaths } from '@/constants/routes';
import type { VocabularyWord } from '@/types/content';

import styles from './RelatedWords.module.css';

export interface RelatedWordTileProps {
  word: VocabularyWord;
}

/** One linked word in the related-words grid (reference screen 3). */
export function RelatedWordTile({ word }: RelatedWordTileProps) {
  return (
    <Link to={routePaths.wordDetail(word.id)} className={styles.tile}>
      <WordThumbnail
        wordId={word.id}
        arabic={word.arabic}
        {...(word.image ? { src: word.image } : {})}
        size={44}
      />
      <span className={styles.copy}>
        <ArabicText className={styles.arabic}>{word.arabic}</ArabicText>
        <span className={styles.transliteration}>{word.transliteration}</span>
        <span className={styles.english}>{word.english}</span>
      </span>
    </Link>
  );
}
