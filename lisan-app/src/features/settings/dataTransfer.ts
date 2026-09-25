import { z } from 'zod';

import { DEFAULT_SETTINGS } from '@/constants/app';
import type { LessonCompletion } from '@/store/lessonProgressStore';
import type { ProgressSummaryData } from '@/store/progressStore';
import type { AppSettings, ProgressSnapshot, WordProgress, WordStatus } from '@/types';
import { toDateKey } from '@/utils/date';

/**
 * Export and import of everything Lisan keeps on the device (spec §58).
 *
 * The file is a single JSON document with one member per persisted slice, so it reads like the
 * storage it came from and a human can diff two backups. `kind` and `version` are checked before
 * anything else: an unrecognised document is rejected outright rather than partially applied,
 * because half-restored learner state is worse than none.
 *
 * Validation is deliberately strict about the shape and lenient about nothing. Every schema below
 * re-projects its output through an explicit object literal, which both drops unknown members and
 * keeps absent optional members absent — the repo compiles with `exactOptionalPropertyTypes`.
 */

export const BACKUP_KIND = 'lisan.backup';
export const BACKUP_VERSION = 1;

/** Annotated so the literal list cannot drift from the shared union. */
const wordStatusSchema: z.ZodType<WordStatus> = z.enum(['new', 'learning', 'review', 'mastered']);

const isoDateTime = z.string().min(1).max(64);

const wordProgressSchema = z
  .object({
    wordId: z.string().min(1),
    status: wordStatusSchema,
    correctAnswers: z.number().int().min(0),
    incorrectAnswers: z.number().int().min(0),
    repetitions: z.number().int().min(0),
    easeFactor: z.number().min(1).max(10).optional(),
    intervalDays: z.number().min(0).max(10_000).optional(),
    nextReviewAt: isoDateTime.optional(),
    lastReviewedAt: isoDateTime.optional(),
  })
  .transform((value): WordProgress => ({
    wordId: value.wordId,
    status: value.status,
    correctAnswers: value.correctAnswers,
    incorrectAnswers: value.incorrectAnswers,
    repetitions: value.repetitions,
    ...(value.easeFactor === undefined ? {} : { easeFactor: value.easeFactor }),
    ...(value.intervalDays === undefined ? {} : { intervalDays: value.intervalDays }),
    ...(value.nextReviewAt === undefined ? {} : { nextReviewAt: value.nextReviewAt }),
    ...(value.lastReviewedAt === undefined ? {} : { lastReviewedAt: value.lastReviewedAt }),
  }));

const dateKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const progressSnapshotSchema: z.ZodType<ProgressSnapshot> = z
  .object({
    date: dateKey,
    wordsLearned: z.number().int().min(0),
    quizzesCompleted: z.number().int().min(0),
    totalCorrect: z.number().int().min(0),
    totalAnswers: z.number().int().min(0),
    /** Fractional since study time started keeping sub-minute precision; whole minutes from an
     * older backup are the same reading and still validate. */
    studyMinutes: z.number().min(0),
  })
  .transform((value) => ({
    date: value.date,
    wordsLearned: value.wordsLearned,
    quizzesCompleted: value.quizzesCompleted,
    totalCorrect: value.totalCorrect,
    totalAnswers: value.totalAnswers,
    studyMinutes: value.studyMinutes,
  }));

const progressSchema: z.ZodType<ProgressSummaryData> = z
  .object({
    byWordId: z.record(z.string().min(1), wordProgressSchema),
    /** `YYYY-MM-DD`, the same key the streak calculation uses. */
    studyDays: z.array(dateKey),
    quizzesCompleted: z.number().int().min(0),
    /** See `progressSnapshotSchema`: minutes, and fractions of one are meaningful. */
    studyMinutes: z.number().min(0),
    totalCorrect: z.number().int().min(0),
    totalAnswers: z.number().int().min(0),
    /**
     * Optional so a document exported before the progress store kept dated snapshots still
     * restores. Its absence costs the learner a week of deltas, not their progress.
     */
    snapshots: z.array(progressSnapshotSchema).optional(),
  })
  .transform((value) => ({
    byWordId: value.byWordId,
    studyDays: [...new Set(value.studyDays)],
    quizzesCompleted: value.quizzesCompleted,
    studyMinutes: value.studyMinutes,
    totalCorrect: value.totalCorrect,
    totalAnswers: value.totalAnswers,
    snapshots: value.snapshots ?? [],
  }));

const settingsSchema: z.ZodType<AppSettings> = z
  .object({
    theme: z.enum(['light', 'dark', 'system']),
    language: z.enum(['en', 'ar']),
    dailyGoal: z.number().int().min(1).max(500),
    audioSpeed: z.number().min(0.25).max(4),
    autoPlayAudio: z.boolean(),
    quizQuestionCount: z.number().int().min(1).max(100),
    quizDifficulty: z.enum(['easy', 'medium', 'hard', 'mixed']),
    reducedMotion: z.boolean(),
    textSize: z.enum(['default', 'large']),
    highContrast: z.boolean(),
    /**
     * Optional so a backup written before the font preferences existed still restores — it comes
     * back on the default faces, which is what that learner was looking at when they exported.
     * Same reasoning as `snapshots` above: an old document must never be rejected wholesale for
     * a field that did not exist when it was written.
     */
    arabicFont: z.enum(['naskh', 'amiri', 'indopak']).optional(),
    readingFont: z.enum(['inter', 'spectral']).optional(),
    monospaceTransliteration: z.boolean().optional(),
  })
  .transform((value) => ({
    ...value,
    arabicFont: value.arabicFont ?? DEFAULT_SETTINGS.arabicFont,
    readingFont: value.readingFont ?? DEFAULT_SETTINGS.readingFont,
    monospaceTransliteration:
      value.monospaceTransliteration ?? DEFAULT_SETTINGS.monospaceTransliteration,
  }));

const lessonCompletionSchema: z.ZodType<LessonCompletion> = z
  .object({
    lessonId: z.string().min(1),
    completedAt: isoDateTime,
  })
  .transform((value) => ({ lessonId: value.lessonId, completedAt: value.completedAt }));

export const backupSchema = z.object({
  kind: z.literal(BACKUP_KIND),
  version: z.literal(BACKUP_VERSION),
  exportedAt: isoDateTime,
  settings: settingsSchema.optional(),
  progress: progressSchema.optional(),
  bookmarks: z.array(z.string().min(1)).optional(),
  grammar: z.array(lessonCompletionSchema).optional(),
});

export type LisanBackup = z.infer<typeof backupSchema>;

export interface BackupInput {
  settings: AppSettings;
  progress: ProgressSummaryData;
  bookmarks: readonly string[];
  grammar: readonly LessonCompletion[];
}

export function createBackup(input: BackupInput, now: Date = new Date()): LisanBackup {
  return {
    kind: BACKUP_KIND,
    version: BACKUP_VERSION,
    exportedAt: now.toISOString(),
    settings: input.settings,
    progress: input.progress,
    bookmarks: [...input.bookmarks],
    grammar: input.grammar.map((completion) => ({ ...completion })),
  };
}

export function serializeBackup(backup: LisanBackup): string {
  return `${JSON.stringify(backup, null, 2)}\n`;
}

export function backupFileName(now: Date = new Date()): string {
  return `lisan-backup-${toDateKey(now)}.json`;
}

export interface BackupCounts {
  words: number;
  bookmarks: number;
  lessons: number;
  quizzes: number;
}

export function countBackup(backup: LisanBackup): BackupCounts {
  return {
    words: Object.keys(backup.progress?.byWordId ?? {}).length,
    bookmarks: backup.bookmarks?.length ?? 0,
    lessons: backup.grammar?.length ?? 0,
    quizzes: backup.progress?.quizzesCompleted ?? 0,
  };
}

export type BackupParseResult =
  { ok: true; backup: LisanBackup } | { ok: false; error: string; issues: string[] };

const MAX_REPORTED_ISSUES = 5;

function describe(issue: z.core.$ZodIssue): string {
  const path = issue.path.map((segment) => String(segment)).join('.');
  return path === '' ? issue.message : `${path}: ${issue.message}`;
}

/** Parses an already-decoded value. Exported so tests can skip the JSON round-trip. */
export function parseBackup(value: unknown): BackupParseResult {
  const result = backupSchema.safeParse(value);
  if (result.success) return { ok: true, backup: result.data };

  const issues = result.error.issues.slice(0, MAX_REPORTED_ISSUES).map(describe);
  const wrongKind = result.error.issues.some(
    (issue) => issue.path[0] === 'kind' || issue.path[0] === 'version',
  );

  return {
    ok: false,
    error: wrongKind
      ? 'That file is not a Lisan backup, or it was written by a newer version.'
      : 'That backup file is damaged, so nothing was imported.',
    issues,
  };
}

export function parseBackupJson(text: string): BackupParseResult {
  let decoded: unknown;
  try {
    decoded = JSON.parse(text);
  } catch {
    return {
      ok: false,
      error: 'That file is not valid JSON, so nothing was imported.',
      issues: [],
    };
  }
  return parseBackup(decoded);
}
