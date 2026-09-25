import { useEffect, useRef, useState, type SubmitEvent } from 'react';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { usePremiumWaitlist } from '@/features/premium';
import { formatDate, useTranslation, type TranslationKey } from '@/i18n';
import type { WaitlistFailure } from '@/services/premium';

import styles from './PremiumDialog.module.css';

/**
 * `pitch` is the first-time ask; `registered` is what a learner who already said yes sees instead of
 * being asked again. `submitted` and `forgotten` are the two outcomes, and both are announced.
 */
type View = 'pitch' | 'registered' | 'submitted' | 'forgotten';

const TITLE_KEYS = {
  pitch: 'premium.dialog.title',
  registered: 'premium.dialog.registeredTitle',
  submitted: 'premium.dialog.submittedTitle',
  forgotten: 'premium.dialog.forgottenTitle',
} as const satisfies Record<View, TranslationKey>;

const FAILURE_KEYS = {
  invalid_email: 'premium.dialog.emailError',
  transport_failed: 'premium.dialog.submitError',
} as const satisfies Record<WaitlistFailure, TranslationKey>;

export interface PremiumDialogProps {
  onClose: () => void;
}

/**
 * The dialog behind the sidebar's premium card.
 *
 * Mounted only while open, and lazily, by `PremiumCard` — which is what keeps Zod out of the app
 * shell, since this is the only path to `submitWaitlist`.
 *
 * Dialog semantics come from `Modal`: focus trapped on open, restored to the card's button on close,
 * Escape to dismiss, `aria-modal` and a labelled heading. The card sits in the sidebar, which is an
 * off-canvas drawer on phones, so this opens *inside* another focus trap; `useFocusTrap` tracks
 * nesting so Escape here dismisses this dialog and leaves the drawer where it was.
 */
export function PremiumDialog({ onClose }: PremiumDialogProps) {
  const { t, locale } = useTranslation();
  const { signup, submit, forget } = usePremiumWaitlist();

  /* What the learner had when the dialog opened. Snapshotted, so removing a signup mid-dialog cannot
     pull the date and address out from under the view that is describing them. */
  const [existing] = useState(signup);

  const [view, setView] = useState<View>(existing === null ? 'pitch' : 'registered');
  const [email, setEmail] = useState('');
  const [failure, setFailure] = useState<WaitlistFailure | null>(null);
  const [pending, setPending] = useState(false);

  const announceRef = useRef<HTMLDivElement>(null);

  /*
   * The live region below announces the outcome. Focus moves there too, because the form or the
   * summary that was holding focus has just been replaced — without this, focus falls to the body and
   * the learner is left outside the dialog they are still looking at.
   */
  useEffect(() => {
    if (view === 'pitch' || view === 'registered') return;
    announceRef.current?.focus({ preventScroll: true });
  }, [view]);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    const result = await submit(email);
    setPending(false);

    if (result.ok) {
      setFailure(null);
      setView('submitted');
      return;
    }
    // The field keeps what was typed either way: an invalid address needs correcting, and a transport
    // that failed needs nothing but the button pressed again.
    setFailure(result.reason);
  };

  const handleForget = (): void => {
    forget();
    setView('forgotten');
  };

  const description =
    view === 'pitch'
      ? t('premium.dialog.description')
      : view === 'registered' && existing !== null
        ? t('premium.dialog.registeredOn', { date: formatDate(existing.submittedAt, locale) })
        : undefined;

  return (
    <Modal open onClose={onClose} title={t(TITLE_KEYS[view])} description={description}>
      {/* Rendered unconditionally so the live region exists before it has anything to say —
          a region inserted at the same moment as its text is announced unreliably. */}
      <div className={styles.announce} role="status" tabIndex={-1} ref={announceRef}>
        {view === 'submitted' ? (
          <Alert variant="success">{t('premium.dialog.submitted')}</Alert>
        ) : null}
        {view === 'forgotten' ? (
          <Alert variant="info">{t('premium.dialog.forgotten')}</Alert>
        ) : null}
      </div>

      {view === 'pitch' ? (
        <form
          className={styles.form}
          // Our own validation, in the services layer, is the one the learner sees — the browser's
          // bubble would fire first, say something we did not write, and never reach Zod.
          noValidate
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
        >
          <p className={styles.paragraph}>{t('premium.dialog.bodyFree')}</p>
          <p className={styles.paragraph}>{t('premium.dialog.bodyDirection')}</p>

          <Input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setFailure(null);
            }}
            label={t('premium.dialog.emailLabel')}
            hint={t('premium.dialog.emailHint')}
            error={failure === null ? undefined : t(FAILURE_KEYS[failure])}
            fullWidth
          />

          <Alert variant="info" title={t('premium.dialog.localOnlyTitle')}>
            {t('premium.dialog.localOnly')}
          </Alert>

          <div className={styles.actions}>
            <Button variant="secondary" onClick={onClose}>
              {t('premium.dialog.dismiss')}
            </Button>
            <Button type="submit" loading={pending}>
              {t('premium.dialog.submit')}
            </Button>
          </div>
        </form>
      ) : null}

      {view === 'registered' ? (
        <div className={styles.form}>
          <p className={styles.paragraph}>
            {existing?.email == null
              ? t('premium.dialog.registeredNoEmail')
              : t('premium.dialog.registeredEmail', { email: existing.email })}
          </p>

          <Alert variant="info" title={t('premium.dialog.localOnlyTitle')}>
            {t('premium.dialog.localOnly')}
          </Alert>

          <div className={styles.actions}>
            <Button variant="secondary" onClick={handleForget}>
              {t('premium.dialog.forget')}
            </Button>
            <Button onClick={onClose}>{t('premium.dialog.close')}</Button>
          </div>
        </div>
      ) : null}

      {view === 'submitted' || view === 'forgotten' ? (
        <div className={styles.actions}>
          <Button onClick={onClose}>{t('premium.dialog.close')}</Button>
        </div>
      ) : null}
    </Modal>
  );
}
