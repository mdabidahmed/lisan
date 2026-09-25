import { describe, expect, it } from 'vitest';

import { DEFAULT_SETTINGS } from '@/constants';
import type { ProgressSummaryData } from '@/store/progressStore';
import type { AppSettings } from '@/types';

import {
  BACKUP_KIND,
  BACKUP_VERSION,
  backupFileName,
  countBackup,
  createBackup,
  parseBackup,
  parseBackupJson,
  serializeBackup,
  type BackupInput,
} from './dataTransfer';

const progress: ProgressSummaryData = {
  byWordId: {
    apple: {
      wordId: 'apple',
      status: 'review',
      correctAnswers: 3,
      incorrectAnswers: 1,
      repetitions: 3,
      easeFactor: 2.5,
      intervalDays: 6,
      nextReviewAt: '2026-09-27T10:00:00.000Z',
      lastReviewedAt: '2026-09-21T10:00:00.000Z',
    },
    book: {
      wordId: 'book',
      status: 'learning',
      correctAnswers: 1,
      incorrectAnswers: 0,
      repetitions: 1,
    },
  },
  studyDays: ['2026-09-20', '2026-09-21'],
  quizzesCompleted: 4,
  studyMinutes: 92,
  totalCorrect: 18,
  totalAnswers: 20,
  snapshots: [
    {
      date: '2026-09-14',
      wordsLearned: 1,
      quizzesCompleted: 2,
      totalCorrect: 8,
      totalAnswers: 10,
      studyMinutes: 40,
    },
    {
      date: '2026-09-21',
      wordsLearned: 2,
      quizzesCompleted: 4,
      totalCorrect: 18,
      totalAnswers: 20,
      studyMinutes: 92,
    },
  ],
};

const settings: AppSettings = { ...DEFAULT_SETTINGS, theme: 'dark', dailyGoal: 20, language: 'ar' };

const input: BackupInput = {
  settings,
  progress,
  bookmarks: ['book', 'apple'],
  grammar: [{ lessonId: 'definite-article', completedAt: '2026-09-21T10:00:00.000Z' }],
};

describe('createBackup', () => {
  it('stamps the document so an unrelated JSON file can never be mistaken for one', () => {
    const backup = createBackup(input, new Date('2026-09-21T12:00:00.000Z'));

    expect(backup.kind).toBe(BACKUP_KIND);
    expect(backup.version).toBe(BACKUP_VERSION);
    expect(backup.exportedAt).toBe('2026-09-21T12:00:00.000Z');
  });

  it('names the file after the day it was taken', () => {
    expect(backupFileName(new Date(2026, 8, 21, 12))).toBe('lisan-backup-2026-09-21.json');
  });

  it('counts what is inside, for the confirmation message', () => {
    expect(countBackup(createBackup(input))).toEqual({
      words: 2,
      bookmarks: 2,
      lessons: 1,
      quizzes: 4,
    });
  });
});

describe('backup round trip', () => {
  it('survives serialise → parse with every slice intact', () => {
    const result = parseBackupJson(serializeBackup(createBackup(input)));

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.backup.settings).toEqual(settings);
    expect(result.backup.progress).toEqual(progress);
    expect(result.backup.bookmarks).toEqual(['book', 'apple']);
    expect(result.backup.grammar).toEqual(input.grammar);
  });

  it('keeps optional SRS fields off a word that never had them', () => {
    const result = parseBackupJson(serializeBackup(createBackup(input)));
    if (!result.ok) throw new Error('expected a valid backup');

    expect(Object.keys(result.backup.progress?.byWordId.book ?? {})).toEqual([
      'wordId',
      'status',
      'correctAnswers',
      'incorrectAnswers',
      'repetitions',
    ]);
  });

  it('accepts a document with only some of the slices', () => {
    const result = parseBackup({
      kind: BACKUP_KIND,
      version: BACKUP_VERSION,
      exportedAt: '2026-09-21T12:00:00.000Z',
      bookmarks: ['apple'],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.backup.bookmarks).toEqual(['apple']);
    expect(result.backup.progress).toBeUndefined();
  });

  it('drops members it does not know about instead of importing them', () => {
    const result = parseBackup({
      kind: BACKUP_KIND,
      version: BACKUP_VERSION,
      exportedAt: '2026-09-21T12:00:00.000Z',
      bookmarks: ['apple'],
      mischief: { evil: true },
    });

    if (!result.ok) throw new Error('expected a valid backup');
    expect(result.backup).not.toHaveProperty('mischief');
  });

  it('de-duplicates study days', () => {
    const result = parseBackup({
      kind: BACKUP_KIND,
      version: BACKUP_VERSION,
      exportedAt: '2026-09-21T12:00:00.000Z',
      progress: { ...progress, studyDays: ['2026-09-21', '2026-09-21', '2026-09-20'] },
    });

    if (!result.ok) throw new Error('expected a valid backup');
    expect(result.backup.progress?.studyDays).toEqual(['2026-09-21', '2026-09-20']);
  });
});

describe('backup validation', () => {
  it('rejects a file that is not JSON', () => {
    const result = parseBackupJson('not json at all');

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain('not valid JSON');
  });

  it('rejects a JSON file that is not a Lisan backup', () => {
    const result = parseBackupJson(JSON.stringify({ hello: 'world' }));

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain('not a Lisan backup');
  });

  it('rejects a backup written by a different schema version', () => {
    const result = parseBackup({ ...createBackup(input), version: 99 });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain('not a Lisan backup');
  });

  it('rejects an unknown word status and says where the problem is', () => {
    const backup = createBackup(input);
    const result = parseBackup({
      ...backup,
      progress: {
        ...progress,
        byWordId: {
          apple: { ...progress.byWordId.apple, status: 'legendary' },
        },
      },
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain('damaged');
    expect(result.issues.join(' ')).toContain('progress.byWordId.apple.status');
  });

  it('rejects negative tallies and malformed study days', () => {
    const negative = parseBackup({
      ...createBackup(input),
      progress: { ...progress, totalAnswers: -3 },
    });
    expect(negative.ok).toBe(false);

    const badDay = parseBackup({
      ...createBackup(input),
      progress: { ...progress, studyDays: ['yesterday'] },
    });
    expect(badDay.ok).toBe(false);
  });

  it('rejects settings that are out of range or the wrong type', () => {
    const outOfRange = parseBackup({
      ...createBackup(input),
      progress: undefined,
      settings: { ...settings, dailyGoal: 0 },
    });
    expect(outOfRange.ok).toBe(false);

    const wrongType = parseBackup({
      ...createBackup(input),
      settings: { ...settings, highContrast: 'yes' },
    });
    expect(wrongType.ok).toBe(false);
  });

  it('rejects a bookmark list that is not a list of ids', () => {
    expect(parseBackup({ ...createBackup(input), bookmarks: [''] }).ok).toBe(false);
    expect(parseBackup({ ...createBackup(input), bookmarks: 'apple' }).ok).toBe(false);
  });

  it('reports at most a handful of issues, so the UI stays readable', () => {
    const result = parseBackup({
      kind: BACKUP_KIND,
      version: BACKUP_VERSION,
      exportedAt: '2026-09-21T12:00:00.000Z',
      settings: {},
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.length).toBeLessThanOrEqual(5);
    expect(result.issues.length).toBeGreaterThan(0);
  });
});
