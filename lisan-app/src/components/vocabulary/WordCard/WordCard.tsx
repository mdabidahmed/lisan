import { ArabicText } from '@/components/ui/ArabicText';
import { AudioButton } from '@/components/ui/AudioButton';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { VocabularyMeta } from '@/components/ui/VocabularyMeta';
import { WordThumbnail } from '@/components/ui/WordThumbnail';
import { AUDIO_SPEED_OPTIONS } from '@/constants/app';
import type { VocabularyWord } from '@/types/content';

import styles from './WordCard.module.css';

export interface WordCardProps {
  word: VocabularyWord;
  categoryName?: string | undefined;
  /** Playback rate multiplier, surfaced as the "1.0x" control in the reference screen. */
  audioSpeed?: number;
  onAudioSpeedChange?: ((speed: number) => void) | undefined;
}

const speedOptions = AUDIO_SPEED_OPTIONS.map((speed) => ({
  value: String(speed),
  label: `${speed.toFixed(2).replace(/0$/, '')}x`,
}));

/** The word-detail hero (reference screen 3): illustration, large Arabic, audio controls. */
export function WordCard({
  word,
  categoryName,
  audioSpeed = 1,
  onAudioSpeedChange,
}: WordCardProps) {
  return (
    <Card padding="lg">
      <div className={styles.hero}>
        <WordThumbnail
          wordId={word.id}
          arabic={word.arabic}
          {...(word.image ? { src: word.image } : {})}
          alt={`Illustration for ${word.english}`}
          size={240}
          radius="var(--radius-lg)"
          className={styles.thumb}
        />

        <div className={styles.copy}>
          <ArabicText as="h2" className={styles.arabic}>
            {word.arabic}
          </ArabicText>
          <p className={styles.transliteration}>{word.transliteration}</p>
          <p className={styles.english}>{word.english}</p>

          <VocabularyMeta
            {...(categoryName ? { categoryName } : {})}
            level={word.level}
            {...(word.partOfSpeech ? { partOfSpeech: word.partOfSpeech } : {})}
            className={styles.meta}
          />

          <div className={styles.controls}>
            <AudioButton
              text={word.arabic}
              size="lg"
              variant="primary"
              rate={audioSpeed}
              label={`Listen to ${word.english} in Arabic`}
            />
            <Select
              options={speedOptions}
              value={String(audioSpeed)}
              onValueChange={(value) => onAudioSpeedChange?.(Number(value))}
              label="Playback speed"
              selectSize="lg"
              className={styles.speed}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
