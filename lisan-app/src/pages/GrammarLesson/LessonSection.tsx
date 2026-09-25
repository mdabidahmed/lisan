import { ArabicText } from '@/components/ui/ArabicText';
import { AudioButton } from '@/components/ui/AudioButton';
import { Card } from '@/components/ui/Card';
import type { GrammarSection } from '@/types/content';

import styles from './GrammarLesson.module.css';

export interface LessonSectionProps {
  section: GrammarSection;
}

/**
 * One explanation plus its worked examples.
 *
 * Each example is a small three-line block — vowelled Arabic, transliteration, translation — so
 * the eye can move between the script and its meaning without hunting.
 */
export function LessonSection({ section }: LessonSectionProps) {
  const examples = section.examples ?? [];

  return (
    <Card as="section" padding="md">
      <h2 className={styles.sectionHeading}>{section.heading}</h2>
      <p className={styles.sectionBody}>{section.body}</p>

      {examples.length === 0 ? null : (
        <ul className={styles.examples}>
          {examples.map((example, index) => (
            <li key={`${section.id}-${String(index)}`} className={styles.example}>
              <div className={styles.exampleHead}>
                {/*
                  A worked example is a whole sentence ending in a full stop, so the run needs a
                  right-to-left base to finish on the left. It takes that base on the isolate
                  rather than on this `<p>`: the `<p>` is a flex item beside the audio button, and
                  a base direction on it would align the sentence against the button the moment the
                  line wraps. See `ArabicText`.
                */}
                <ArabicText as="p" flow="sentence" className={styles.exampleArabic}>
                  {example.arabic}
                </ArabicText>
                <AudioButton
                  text={example.arabic}
                  size="sm"
                  variant="soft"
                  label={`Play the example: ${example.english}`}
                />
              </div>

              {example.transliteration === undefined ? null : (
                <p className={styles.exampleTransliteration}>{example.transliteration}</p>
              )}
              <p className={styles.exampleEnglish}>{example.english}</p>
              {example.note === undefined ? null : (
                <p className={styles.exampleNote}>{example.note}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
