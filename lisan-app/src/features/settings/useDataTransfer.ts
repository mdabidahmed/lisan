import { useMemo } from 'react';

import { useLessonProgressStore } from '@/store/lessonProgressStore';
import { useBookmarksStore } from '@/store/bookmarksStore';
import { useProgressStore } from '@/store/progressStore';
import { useQuizSessionStore } from '@/store/quizSessionStore';
import { useSettingsStore } from '@/store/settingsStore';

import {
  backupFileName,
  countBackup,
  createBackup,
  parseBackupJson,
  serializeBackup,
  type BackupCounts,
  type LisanBackup,
} from './dataTransfer';

export type ExportOutcome = { ok: true; fileName: string } | { ok: false; error: string };

export type ImportOutcome =
  { ok: true; counts: BackupCounts } | { ok: false; error: string; issues: string[] };

export interface ResetOptions {
  /** Also restore appearance, audio and goal preferences to their defaults. */
  includeSettings?: boolean | undefined;
}

export interface DataTransferApi {
  /** Everything on this device, as a backup document. */
  snapshot: () => LisanBackup;
  exportToFile: () => ExportOutcome;
  importFromText: (text: string) => ImportOutcome;
  importFromFile: (file: File) => Promise<ImportOutcome>;
  resetLearningData: (options?: ResetOptions) => void;
}

function downloadJson(fileName: string, contents: string): boolean {
  // Object URLs are unavailable in some embedded webviews (and under jsdom), and a blocked
  // download must not take the settings page down with it.
  try {
    const url = URL.createObjectURL(new Blob([contents], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.rel = 'noopener';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}

function snapshot(): LisanBackup {
  const { actions: _settingsActions, ...settings } = useSettingsStore.getState();
  const { actions: _progressActions, ...progress } = useProgressStore.getState();

  return createBackup({
    settings,
    progress,
    bookmarks: useBookmarksStore.getState().ids,
    grammar: Object.values(useLessonProgressStore.getState().completedById),
  });
}

function applyBackup(backup: LisanBackup): void {
  if (backup.settings) {
    // `update` also mirrors the theme into its own key for the anti-FOUC script in index.html.
    useSettingsStore.getState().actions.update(backup.settings);
  }

  if (backup.progress) {
    useProgressStore.getState().actions.hydrate(backup.progress);
  }

  if (backup.bookmarks) {
    const { clear, add } = useBookmarksStore.getState().actions;
    clear();
    // `add` prepends, so restoring back-to-front preserves the exported order.
    for (const wordId of [...backup.bookmarks].reverse()) add(wordId);
  }

  if (backup.grammar) {
    useLessonProgressStore.getState().actions.replaceAll(backup.grammar);
  }
}

function resetLearningData(options: ResetOptions = {}): void {
  useProgressStore.getState().actions.reset();
  useBookmarksStore.getState().actions.clear();
  useLessonProgressStore.getState().actions.reset();

  // `reset` deliberately keeps `lastResult` so the result page survives a reload; wiping learner
  // data has to take it with everything else.
  useQuizSessionStore.getState().actions.clearHistory();

  if (options.includeSettings) useSettingsStore.getState().actions.reset();
}

function importFromText(text: string): ImportOutcome {
  const parsed = parseBackupJson(text);
  if (!parsed.ok) return { ok: false, error: parsed.error, issues: parsed.issues };

  applyBackup(parsed.backup);
  return { ok: true, counts: countBackup(parsed.backup) };
}

async function importFromFile(file: File): Promise<ImportOutcome> {
  let text: string;
  try {
    text = await file.text();
  } catch {
    return { ok: false, error: 'That file could not be read.', issues: [] };
  }
  return importFromText(text);
}

function exportToFile(): ExportOutcome {
  const fileName = backupFileName();
  const started = downloadJson(fileName, serializeBackup(snapshot()));

  return started
    ? { ok: true, fileName }
    : { ok: false, error: 'This browser blocked the download. Try a different browser.' };
}

/**
 * Export, import and reset for all locally held learner data.
 *
 * Every slice is read and written through its store rather than through storage directly, so the
 * open page updates immediately and persistence stays the stores' business.
 */
export function useDataTransfer(): DataTransferApi {
  return useMemo(
    () => ({ snapshot, exportToFile, importFromText, importFromFile, resetLearningData }),
    [],
  );
}
