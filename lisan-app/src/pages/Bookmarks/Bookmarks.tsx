import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { illustrations } from '@/assets';
import { DashboardLayout, PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { SearchBox } from '@/components/ui/SearchBox';
import { VocabularyList } from '@/components/vocabulary';
import { BOOKMARKS_PAGE_SIZE } from '@/constants/app';
import { ROUTES } from '@/constants/routes';
import { useCategories, useWords } from '@/features/vocabulary';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useBookmarkActions, useBookmarkIds } from '@/store/bookmarksStore';
import { formatNumber } from '@/utils/format';

import styles from './Bookmarks.module.css';

export function BookmarksPage() {
  useDocumentMeta({
    title: 'Bookmarks',
    description: 'Every Arabic word you have saved, with audio and quick review.',
  });

  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const bookmarkIds = useBookmarkIds();
  const { toggle } = useBookmarkActions();
  const { data: categories = [] } = useCategories();

  const query = useMemo(
    () => ({
      bookmarkedOnly: true,
      bookmarkedIds: bookmarkIds,
      ...(search.trim() ? { q: search.trim() } : {}),
      pageSize: BOOKMARKS_PAGE_SIZE,
    }),
    [bookmarkIds, search],
  );

  const { data: page, isLoading } = useWords(query);

  const categoriesById = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category])),
    [categories],
  );

  const words = page?.items ?? [];

  return (
    <DashboardLayout
      header={
        <PageHeader
          title="Bookmarks"
          subtitle="Your saved words, ready for a quick review session."
        />
      }
    >
      <div className={styles.controls}>
        <SearchBox
          value={search}
          onValueChange={setSearch}
          placeholder="Search your bookmarks..."
          label="Search bookmarks"
          className={styles.search}
        />
        <p className={styles.count}>{formatNumber(bookmarkIds.length)} saved</p>
      </div>

      <VocabularyList
        words={words}
        categories={categoriesById}
        bookmarkedIds={bookmarkIds}
        isLoading={isLoading}
        onToggleBookmark={(word) => {
          toggle(word.id);
        }}
        emptyIllustration={illustrations.emptyBookmarks}
        emptyTitle="You haven't bookmarked any words yet"
        emptyDescription="Tap the heart on any word to save it here for later review."
        emptyAction={
          <Button
            iconRight="arrow-right"
            onClick={() => {
              void navigate(ROUTES.vocabulary);
            }}
          >
            Browse vocabulary
          </Button>
        }
      />
    </DashboardLayout>
  );
}
