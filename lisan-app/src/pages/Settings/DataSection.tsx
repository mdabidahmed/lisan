import { useRef, useState, type ChangeEvent } from 'react';

import { useToast } from '@/app/providers/toast';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Modal } from '@/components/ui/Modal';
import { useDataTransfer, type ImportOutcome } from '@/features/settings';

import styles from './Settings.module.css';

function describeCounts(outcome: Extract<ImportOutcome, { ok: true }>): string {
  const { words, bookmarks, lessons, quizzes } = outcome.counts;
  return `Restored ${words} words, ${bookmarks} bookmarks, ${lessons} finished lessons and ${quizzes} quizzes.`;
}

/** Export, import and reset of everything Lisan keeps on this device (spec §23 and §58). */
export function DataSection() {
  const toast = useToast();
  const { exportToFile, importFromFile, resetLearningData } = useDataTransfer();

  const fileRef = useRef<HTMLInputElement>(null);
  const [outcome, setOutcome] = useState<ImportOutcome | null>(null);
  const [importing, setImporting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [alsoSettings, setAlsoSettings] = useState(false);

  const handleExport = () => {
    const result = exportToFile();
    if (result.ok) toast.success('Backup downloaded', { description: result.fileName });
    else toast.error('Export failed', { description: result.error });
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Clearing the value lets the same file be chosen again after a failed import.
    event.target.value = '';
    if (!file) return;

    setImporting(true);
    const result = await importFromFile(file);
    setImporting(false);
    setOutcome(result);

    if (result.ok) toast.success('Import complete', { description: describeCounts(result) });
    else toast.error('Nothing was imported', { description: result.error });
  };

  const handleReset = () => {
    resetLearningData({ includeSettings: alsoSettings });
    setConfirming(false);
    setAlsoSettings(false);
    setOutcome(null);
    toast.success(
      'Learning data reset',
      alsoSettings ? { description: 'Preferences are back to their defaults too.' } : {},
    );
  };

  return (
    <Card padding="md">
      <CardHeader
        title="Data"
        subtitle="Everything you learn is stored in this browser. A backup is how you move it."
        icon="statistics"
        accent="teal"
        as="h2"
      />

      <div className={styles.dataRows}>
        <div className={styles.dataRow}>
          <div className={styles.dataCopy}>
            <p className={styles.dataTitle}>Export</p>
            <p className={styles.dataHint}>
              Downloads your progress, bookmarks, finished grammar lessons and preferences as one
              JSON file.
            </p>
          </div>
          <Button variant="secondary" onClick={handleExport}>
            Export data
          </Button>
        </div>

        <div className={styles.dataRow}>
          <div className={styles.dataCopy}>
            <p className={styles.dataTitle}>Import</p>
            <p className={styles.dataHint}>
              Replaces what is on this device with the contents of a backup file. Anything the file
              does not contain is left alone.
            </p>
          </div>
          <Button
            variant="secondary"
            loading={importing}
            onClick={() => {
              fileRef.current?.click();
            }}
          >
            Import backup
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className={styles.fileInput}
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event) => {
              void handleFile(event);
            }}
          />
        </div>

        <div className={styles.dataRow}>
          <div className={styles.dataCopy}>
            <p className={styles.dataTitle}>Reset</p>
            <p className={styles.dataHint}>
              Clears your progress, bookmarks, finished lessons and quiz history. This cannot be
              undone.
            </p>
          </div>
          <Button
            variant="danger"
            iconLeft="alert"
            onClick={() => {
              setConfirming(true);
            }}
          >
            Reset data
          </Button>
        </div>
      </div>

      {outcome === null ? null : outcome.ok ? (
        <Alert variant="success" title="Import complete" className={styles.outcome}>
          {describeCounts(outcome)}
        </Alert>
      ) : (
        <Alert variant="error" title={outcome.error} className={styles.outcome}>
          {outcome.issues.length === 0 ? (
            'Choose a file that was exported from Lisan.'
          ) : (
            <ul className={styles.issues}>
              {outcome.issues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          )}
        </Alert>
      )}

      <Modal
        open={confirming}
        onClose={() => {
          setConfirming(false);
        }}
        title="Reset learning data?"
        description="Your words learned, bookmarks, finished grammar lessons and quiz history will be cleared on this device."
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setConfirming(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReset}>
              Reset data
            </Button>
          </>
        }
      >
        <div className={styles.confirmBody}>
          <Alert variant="warning" title="There is no cloud copy">
            Export a backup first if there is any chance you want this data back.
          </Alert>
          <Checkbox
            checked={alsoSettings}
            label="Also restore default preferences"
            description="Theme, daily goal, audio speed and accessibility settings."
            onChange={(event) => {
              setAlsoSettings(event.target.checked);
            }}
          />
        </div>
      </Modal>
    </Card>
  );
}
