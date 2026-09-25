import type { MouseEvent } from 'react';

import { Icon } from '@/components/icons';
import { AudioButton } from '@/components/ui/AudioButton';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { IconButton } from '@/components/ui/IconButton';
import { Tooltip } from '@/components/ui/Tooltip';
import { WordThumbnail } from '@/components/ui/WordThumbnail';
import { ARABIC_CONTENT_ATTRS } from '@/i18n';
import type { Category, VocabularyWord } from '@/types';
import { cn } from '@/utils';

import styles from './VocabularyRow.module.css';

export interface VocabularyRowProps {
  word: VocabularyWord;
  category?: Category | undefined;
  bookmarked?: boolean | undefined;
  onOpen: (word: VocabularyWord) => void;
  onToggleBookmark?: ((word: VocabularyWord) => void) | undefined;
  showChevron?: boolean | undefined;
  className?: string | undefined;
}

/**
 * Vocabulary list item: a fixed image column, an Arabic/transliteration column, an
 * English-meaning/example column, a centred category badge, and the actions — the same five
 * columns on every row, so the badge and buttons land at the same x-position however long any one
 * row's text runs.
 *
 * The whole row is clickable, but the click target is a real `<button>` stretched over the row by
 * its `::after`. That keeps one tab stop and real keyboard semantics while leaving the audio and
 * bookmark controls as independent buttons layered above it. The button carries an explicit
 * `aria-label` (arabic, transliteration, meaning, category) so its accessible name stays a clean
 * summary regardless of how the visible columns are laid out — the example sentence is supporting
 * visual content, not part of the row's name.
 */
export function VocabularyRow({
  word,
  category,
  bookmarked = false,
  onOpen,
  onToggleBookmark,
  showChevron = false,
  className,
}: VocabularyRowProps) {
  const handleBookmark = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggleBookmark?.(word);
  };

  const example = word.examples[0]?.english;
  const accessibleName = [word.arabic, word.transliteration, word.english, category?.name]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cn(styles.row, className)}>
      <WordThumbnail
        wordId={word.id}
        arabic={word.arabic}
        size={64}
        className={styles.thumbnail}
        {...(word.image === undefined ? {} : { src: word.image })}
      />

      <button
        type="button"
        className={styles.primary}
        aria-label={accessibleName}
        onClick={() => {
          onOpen(word);
        }}
      >
        <span className={styles.wordCol}>
          <span className={styles.arabic} {...ARABIC_CONTENT_ATTRS}>
            {word.arabic}
          </span>
          <span className={styles.transliteration}>{word.transliteration}</span>
        </span>

        <span className={styles.meaningCol}>
          <span className={styles.meaning}>{word.english}</span>
          {example === undefined ? null : <span className={styles.example}>{example}</span>}
        </span>
      </button>

      {category === undefined ? (
        <span className={styles.categoryCell} />
      ) : (
        <span className={styles.categoryCell}>
          <CategoryBadge
            name={category.name}
            icon={category.icon}
            color={category.color}
            size="sm"
          />
        </span>
      )}

      <div className={styles.actions}>
        <AudioButton text={word.arabic} variant="primary" size="md" tooltipAlign="end" />
        {onToggleBookmark === undefined ? null : (
          <Tooltip content={bookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'} align="end">
            <IconButton
              icon="favorite"
              label={
                bookmarked
                  ? `Remove ${word.english} from bookmarks`
                  : `Add ${word.english} to bookmarks`
              }
              variant="bookmark"
              shape="circle"
              size="md"
              active={bookmarked}
              hideNativeTitle
              onClick={handleBookmark}
            />
          </Tooltip>
        )}
        {showChevron ? <Icon name="chevron-right" size={18} className={styles.chevron} /> : null}
      </div>
    </div>
  );
}
