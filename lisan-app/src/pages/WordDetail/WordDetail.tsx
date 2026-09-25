import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Icon } from '@/components/icons';
import { LearningLayout } from '@/components/layout';
import { ArabicText } from '@/components/ui/ArabicText';
import { AudioButton } from '@/components/ui/AudioButton';
import { Card } from '@/components/ui/Card';
import { DetailRow } from '@/components/ui/DetailRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { IconButton } from '@/components/ui/IconButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TabPanel, Tabs } from '@/components/ui/Tabs';
import { Tooltip } from '@/components/ui/Tooltip';
import { UrduText } from '@/components/ui/UrduText';
import { WordDetailSkeleton } from '@/components/skeletons';
import { RelatedWords, WordCard, WordProgressPanel } from '@/components/vocabulary';
import { ROUTES } from '@/constants/routes';
import { useCategories, useRelatedWords, useWord, useWordLearning } from '@/features/vocabulary';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { isNotFoundError } from '@/services/api';
import { useBookmarkActions, useIsBookmarked } from '@/store/bookmarksStore';
import { useSetting } from '@/store/settingsStore';

import styles from './WordDetail.module.css';

const TABS = [
  { id: 'details', label: 'Details' },
  { id: 'examples', label: 'Examples' },
  { id: 'related', label: 'Related Words' },
] as const;

export function WordDetailPage() {
  const { wordId = '' } = useParams<{ wordId: string }>();
  const [tab, setTab] = useState<string>('details');

  const { data: word, isLoading, isError, error, refetch } = useWord(wordId);
  const { data: categories = [] } = useCategories();
  const related = useRelatedWords(wordId);
  const learning = useWordLearning(wordId);
  const bookmarked = useIsBookmarked(wordId);
  const { toggle } = useBookmarkActions();
  const audioSpeed = useSetting('audioSpeed');
  const [speed, setSpeed] = useState(audioSpeed);

  useDocumentMeta({
    title: word ? `${word.english} — ${word.transliteration}` : 'Word',
    description: word
      ? `${word.english} in Arabic is ${word.arabic} (${word.transliteration}). Listen to the pronunciation and see example sentences.`
      : undefined,
    type: 'article',
  });

  const category = categories.find((item) => item.id === word?.categoryId);

  if (isLoading) return <WordDetailSkeleton />;

  // A 404 is not a failed request: the id in the URL is simply not in the library, and retrying
  // it can only fail again. It falls through to the not-found state below.
  if (isError && !isNotFoundError(error)) {
    return (
      <LearningLayout backTo={ROUTES.vocabulary}>
        <ErrorState
          title="We could not load this word"
          description="Check your connection and try again."
          onRetry={() => void refetch()}
        />
      </LearningLayout>
    );
  }

  if (!word) {
    return (
      <LearningLayout backTo={ROUTES.vocabulary}>
        <EmptyState
          icon="search"
          title="Word not found"
          description="This word is not in the library. It may have been renamed or removed."
        />
      </LearningLayout>
    );
  }

  const categoryHref = `${ROUTES.vocabulary}?${new URLSearchParams({
    category: word.categoryId,
  }).toString()}`;

  return (
    <LearningLayout
      backTo={ROUTES.vocabulary}
      backLabel="Back to words"
      actions={
        <Tooltip
          content={bookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
          placement="bottom"
          align="end"
        >
          <IconButton
            icon="favorite"
            label={
              bookmarked
                ? `Remove ${word.english} from bookmarks`
                : `Add ${word.english} to bookmarks`
            }
            variant="bookmark"
            active={bookmarked}
            aria-pressed={bookmarked}
            hideNativeTitle
            onClick={() => {
              toggle(word.id);
            }}
          />
        </Tooltip>
      }
    >
      <WordCard
        word={word}
        {...(category ? { categoryName: category.name } : {})}
        audioSpeed={speed}
        onAudioSpeedChange={setSpeed}
      />

      <Tabs items={TABS} value={tab} onValueChange={setTab} aria-label="Word information" />

      <div className={styles.grid}>
        <TabPanel id="details" active={tab === 'details'}>
          <Card padding="none">
            <div className={styles.rows}>
              <DetailRow icon="grammar" label="Category">
                {category?.name ?? word.categoryId}
              </DetailRow>
              <DetailRow icon="vocabulary" label="Part of Speech">
                {word.partOfSpeech ?? '—'}
              </DetailRow>
              <DetailRow icon="family" label="Plural Form" arabic>
                {word.pluralForm
                  ? `${word.pluralForm.arabic} (${word.pluralForm.transliteration})`
                  : '—'}
              </DetailRow>
              <DetailRow icon="info" label="Meaning in Urdu">
                {word.meaningUrdu === undefined ? '—' : <UrduText>{word.meaningUrdu}</UrduText>}
              </DetailRow>
              <DetailRow icon="info" label="Meaning in Hindi">
                {word.meaningHindi ?? '—'}
              </DetailRow>
            </div>
          </Card>
        </TabPanel>

        <TabPanel id="examples" active={tab === 'examples'}>
          <Card padding="md">
            <SectionHeader title="Example Sentences" as="h3" />
            <ul className={styles.examples}>
              {word.examples.map((example) => (
                <li key={example.arabic} className={styles.example}>
                  <div className={styles.exampleCopy}>
                    {/* A whole sentence, and every one of them ends in a full stop. */}
                    <ArabicText as="p" flow="sentence" className={styles.exampleArabic}>
                      {example.arabic}
                    </ArabicText>
                    {example.transliteration ? (
                      <p className={styles.exampleTranslit}>{example.transliteration}</p>
                    ) : null}
                    <p className={styles.exampleEnglish}>{example.english}</p>
                  </div>
                  <AudioButton
                    text={example.arabic}
                    rate={speed}
                    variant="primary"
                    label="Play example sentence"
                  />
                </li>
              ))}
            </ul>
          </Card>
        </TabPanel>

        <TabPanel id="related" active={tab === 'related'}>
          <Card padding="md">
            <SectionHeader
              title="Related Words"
              as="h3"
              action={
                <Link to={categoryHref} className={styles.viewAll}>
                  View All
                  <Icon name="arrow-right" size={16} />
                </Link>
              }
            />
            <RelatedWords
              words={related.data ?? []}
              isLoading={related.isLoading}
              isError={related.isError}
              onRetry={() => void related.refetch()}
              className={styles.related}
            />
          </Card>
        </TabPanel>
      </div>

      <WordProgressPanel
        status={learning.status}
        accuracy={learning.accuracy}
        answers={learning.answers}
        repetitions={learning.repetitions}
        nextReviewAt={learning.nextReviewAt}
        onMarkLearned={learning.markLearned}
        onReset={learning.reset}
      />
    </LearningLayout>
  );
}
