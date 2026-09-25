import { Suspense, lazy, useCallback, useId, useState } from 'react';

import { Icon } from '@/components/icons';
import { useTranslation } from '@/i18n';
import { analytics } from '@/services/analytics';
import { usePremiumSignup } from '@/store/premiumStore';

import styles from './PremiumCard.module.css';

/**
 * Lazy for one reason: the dialog validates with Zod, and this card renders in the app shell on every
 * route. A static import would put `vendor-schema` — 25 kB gzipped — in front of first paint for every
 * learner, to serve a dialog most of them will never open. See `MANUAL_CHUNKS` in `vite.config.ts`.
 */
const PremiumDialog = lazy(() =>
  import('./PremiumDialog').then((m) => ({ default: m.PremiumDialog })),
);

/**
 * Sidebar footer upsell (reference screens 1–5).
 *
 * There is no premium tier and nothing to buy, so the CTA opens a dialog that says exactly that and
 * offers to record the learner's interest instead. It is the honest version of a button that used to
 * do nothing at all: the interest is kept on the device, through the storage service, and the copy
 * does not pretend an email is on its way.
 *
 * A learner who has already registered is not pitched again — the card's own copy changes, and the
 * dialog opens on a summary of what they said rather than on the ask.
 */
export function PremiumCard() {
  const { t } = useTranslation();
  const signup = usePremiumSignup();
  const [open, setOpen] = useState(false);
  /* The shell keeps two of these mounted at all times — the desktop rail and the mobile drawer, each
     hidden by CSS at the other's breakpoint — so a hard-coded id was a duplicate on every page, and
     the drawer card's `aria-labelledby` resolved to the rail card's heading. */
  const titleId = useId();

  const registered = signup !== null;

  const handleOpen = useCallback(() => {
    // Both halves of the only evidence there will be for whether this tier is worth building: how
    // many learners ask, out of how many looked.
    analytics.track('premium_dialog_opened', { returning: registered });
    setOpen(true);
  }, [registered]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <section className={styles.card} aria-labelledby={titleId}>
      <span className={styles.badge}>
        <Icon name={registered ? 'check' : 'trophy'} size={16} />
      </span>
      <h2 id={titleId} className={styles.title}>
        {t('premium.card.title')}
      </h2>
      <p className={styles.body}>
        {registered ? t('premium.card.registeredBody') : t('premium.card.body')}
      </p>
      <button type="button" className={styles.cta} aria-haspopup="dialog" onClick={handleOpen}>
        {registered ? t('premium.card.registeredCta') : t('premium.card.cta')}
        <Icon name="arrow-right" size={16} />
      </button>

      {/* Nothing to show while the chunk is in flight: it is a local request behind a deliberate
          press, and a spinner flashing in the sidebar would be more startling than the wait. */}
      {open ? (
        <Suspense fallback={null}>
          <PremiumDialog onClose={handleClose} />
        </Suspense>
      ) : null}
    </section>
  );
}
