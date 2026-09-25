import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

import { Icon } from '@/components/icons';
import { useFontControls, type FontFamilyControl } from '@/components/ui/FontControls';
import { IconButton } from '@/components/ui/IconButton';
import { Switch } from '@/components/ui/Switch';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useTranslation } from '@/i18n';
import { cn } from '@/utils/cn';

import styles from './FontSwitcher.module.css';

/**
 * Typeface choice, one tap from anywhere.
 *
 * The same three preferences the Appearance card in Settings owns — they share
 * `useFontControls`, so neither surface can invent a face or write the setting differently. What
 * is different here is the reading: Settings is where a learner compares faces against a specimen,
 * this is where someone already mid-lesson changes their mind. So the popover stays open after a
 * choice; the page behind it is the specimen, re-set in the new face the moment it is picked.
 *
 * Nothing in it can start a font download. The options are named in the interface font, never set
 * in the face they name, because a three-line specimen of every option would fetch IndoPak, Amiri
 * and Spectral — over 300 kB — to open a menu. Bytes are spent when a face is chosen, by the same
 * `ThemeProvider` path that serves a preference restored from storage, and not before.
 */
export function FontSwitcher() {
  const { t } = useTranslation();
  const controls = useFontControls();
  const [open, setOpen] = useState(false);

  /** Trigger and panel together: the boundary for both an outside press and the focus trap. */
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const titleId = useId();

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  /*
    Escape, Tab containment and focus restored to the trigger, exactly as `Modal` gets them — but
    trapped around the trigger *and* the panel rather than the panel alone. Tab order inside the
    panel is roving, one stop per group, so the trap's first and last focusable elements are not
    its first and last tab stops and a Shift+Tab off the leading option would slip out. Including
    the trigger closes that edge and makes it the wrap point, which is where a backwards Tab out
    of the first option was heading anyway.

    Entry focus is taken over below: the trap would land on the trigger, and the point of this
    popover is that it opens on the choice already in force.
  */
  useFocusTrap(rootRef, open, { onEscape: close, autoFocus: false });

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const selected = panel.querySelector<HTMLElement>('[role="radio"][aria-checked="true"]');
    (selected ?? panel).focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    // The trigger is inside the boundary on purpose: pressing it while the popover is open has to
    // reach its own click handler and toggle, not be dismissed here and reopened a moment later.
    const handlePointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      if (root && !root.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [open]);

  return (
    <div className={styles.root} ref={rootRef}>
      <IconButton
        icon="keyboard"
        label={t('topbar.fonts.trigger')}
        variant="secondary"
        onClick={() => {
          setOpen((value) => !value);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        {...(open ? { 'aria-controls': panelId } : {})}
      />

      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={styles.panel}
        >
          <p id={titleId} className={styles.title}>
            {t('topbar.fonts.title')}
          </p>

          <FontOptionGroup control={controls.arabic} />
          <FontOptionGroup control={controls.reading} />

          <Switch
            checked={controls.monospace.checked}
            onCheckedChange={controls.monospace.toggle}
            label={controls.monospace.label}
            className={styles.switch}
          />
        </div>
      ) : null}
    </div>
  );
}

/**
 * One preference as a radio group. Arrow keys move and select in a single step, which is what a
 * radio group is expected to do and what suits a control whose effect is visible immediately —
 * arrowing through the faces re-sets the page under the popover, face by face.
 */
function FontOptionGroup<Value extends string>({ control }: { control: FontFamilyControl<Value> }) {
  const labelId = useId();
  const optionRefs = useRef(new Map<Value, HTMLButtonElement>());

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const { options } = control;
    const current = options.findIndex((option) => option.value === control.value);
    let target: (typeof options)[number] | undefined;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        target = options[(current + 1) % options.length];
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        target = options[(current - 1 + options.length) % options.length];
        break;
      case 'Home':
        target = options[0];
        break;
      case 'End':
        target = options[options.length - 1];
        break;
      default:
        return;
    }

    if (!target) return;
    event.preventDefault();
    control.select(target.value);
    optionRefs.current.get(target.value)?.focus();
  };

  return (
    <div className={styles.group}>
      <p id={labelId} className={styles.groupLabel}>
        {control.label}
      </p>
      <div role="radiogroup" aria-labelledby={labelId} className={styles.options}>
        {control.options.map((option) => {
          const selected = option.value === control.value;

          return (
            <button
              key={option.value}
              ref={(node) => {
                if (node) optionRefs.current.set(option.value, node);
                else optionRefs.current.delete(option.value);
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              className={cn(styles.option, selected && styles.optionSelected)}
              onClick={() => {
                control.select(option.value);
              }}
              onKeyDown={handleKeyDown}
            >
              <span className={styles.optionLabel}>{option.label}</span>
              {selected ? <Icon name="check" size={16} className={styles.optionCheck} /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
