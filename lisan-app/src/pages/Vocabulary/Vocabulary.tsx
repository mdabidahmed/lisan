import { useMemo } from 'react';

import { DashboardLayout, PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Combobox } from '@/components/ui/Combobox';
import { Pagination } from '@/components/ui/Pagination';
import { SearchBox } from '@/components/ui/SearchBox';
import { VocabularyFilters, VocabularyList } from '@/components/vocabulary';
import { useCategories, useWords } from '@/features/vocabulary';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useBookmarkActions, useBookmarkIds } from '@/store/bookmarksStore';
import type { VocabularyWord } from '@/types/content';
import { formatNumber } from '@/utils/format';

import { useVocabularyFilters } from './useVocabularyFilters';
import styles from './Vocabulary.module.css';

export function VocabularyPage() {
  useDocumentMeta({
    title: 'Vocabulary',
    description: 'Browse Arabic vocabulary with audio, transliteration, meaning and examples.',
  });

  const filters = useVocabularyFilters();
  const { data: categories = [] } = useCategories();
  const { data: page, isLoading, isError, refetch } = useWords(filters.query);

  const bookmarkIds = useBookmarkIds();
  const { toggle } = useBookmarkActions();

  const categoriesById = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category])),
    [categories],
  );

  const categoryOptions = useMemo(
    () => [
      { value: 'all', label: 'All Categories' },
      ...categories.map((category) => ({
        value: category.id,
        label: category.name,
        icon: category.icon,
        color: category.color,
      })),
    ],
    [categories],
  );

  const items = page?.items ?? [];
  const total = page?.total ?? 0;
  const totalPages = page?.totalPages ?? 1;

  return (
    <DashboardLayout
      header={
        <PageHeader
          title="Vocabulary"
          subtitle="Explore commonly used Arabic words with audio, meaning and examples."
        />
      }
    >
      <div className={styles.controls}>
        <SearchBox
          value={filters.search}
          onValueChange={filters.setSearch}
          placeholder="Search words (e.g. teacher, book, food...)"
          label="Search Arabic or English"
          size="lg"
          className={styles.search}
        />
        <Combobox
          options={categoryOptions}
          value={filters.categoryId}
          onValueChange={filters.setCategory}
          label="Filter by category"
          size="lg"
          className={styles.categorySelect}
        />
      </div>

      <div className={styles.chips}>
        <Chip
          label="All"
          selected={filters.categoryId === 'all'}
          onClick={() => {
            filters.setCategory('all');
          }}
        />
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            selected={filters.categoryId === category.id}
            onClick={() => {
              filters.setCategory(category.id);
            }}
          />
        ))}
      </div>

      <VocabularyFilters
        level={filters.level}
        onLevelChange={filters.setLevel}
        status={filters.status}
        onStatusChange={filters.setStatus}
        bookmarkedOnly={filters.bookmarkedOnly}
        onBookmarkedOnlyChange={filters.setBookmarkedOnly}
        sort={filters.sort}
        onSortChange={filters.setSort}
        isFiltered={filters.isFiltered}
        onReset={filters.reset}
      />

      <VocabularyList
        words={items}
        categories={categoriesById}
        bookmarkedIds={bookmarkIds}
        isLoading={isLoading}
        {...(isError ? { error: true, onRetry: () => void refetch() } : {})}
        onToggleBookmark={(word: VocabularyWord) => {
          toggle(word.id);
        }}
        emptyTitle={filters.isFiltered ? 'No words match these filters' : 'No vocabulary found'}
        emptyDescription={
          filters.isFiltered
            ? 'Nothing in the library matches every filter at once. Clear them to see the full list, or relax one at a time.'
            : 'The vocabulary library is still loading its content.'
        }
        emptyAction={
          filters.isFiltered ? (
            <Button variant="secondary" iconLeft="close" onClick={filters.reset}>
              Clear all filters
            </Button>
          ) : undefined
        }
      />

      {total > 0 ? (
        <div className={styles.footer}>
          <p className={styles.count}>
            Showing {formatNumber(items.length)} of {formatNumber(total)} words
          </p>
          <Pagination
            page={filters.page}
            totalPages={totalPages}
            onPageChange={filters.setPage}
            label="Vocabulary pages"
          />
        </div>
      ) : null}
    </DashboardLayout>
  );
}
