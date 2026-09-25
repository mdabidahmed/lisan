import { useRef, type KeyboardEvent } from 'react';

import { Icon, type IconName } from '@/components/icons';
import { cn } from '@/utils';

import styles from './Tabs.module.css';

export interface TabItem {
  id: string;
  label: string;
  icon?: IconName;
  disabled?: boolean;
}

export interface TabsProps {
  items: readonly TabItem[];
  value: string;
  onValueChange: (id: string) => void;
  variant?: 'segmented' | 'underline' | undefined;
  className?: string | undefined;
  'aria-label': string;
}

/**
 * Tab strip with automatic activation: arrow keys move focus and select in one step, which is the
 * expected pattern when every panel is already in the DOM.
 */
export function Tabs({
  items,
  value,
  onValueChange,
  variant = 'segmented',
  className,
  'aria-label': ariaLabel,
}: TabsProps) {
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const enabled = items.filter((item) => item.disabled !== true);
    if (enabled.length === 0) return;

    const current = enabled.findIndex((item) => item.id === value);
    let target: TabItem | undefined;

    switch (event.key) {
      case 'ArrowRight':
        target = enabled[(current + 1) % enabled.length];
        break;
      case 'ArrowLeft':
        target = enabled[(current - 1 + enabled.length) % enabled.length];
        break;
      case 'Home':
        target = enabled[0];
        break;
      case 'End':
        target = enabled[enabled.length - 1];
        break;
      default:
        return;
    }

    if (!target) return;
    event.preventDefault();
    onValueChange(target.id);
    tabRefs.current.get(target.id)?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(styles.root, styles[variant], className)}
    >
      {items.map((item) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            ref={(node) => {
              if (node) tabRefs.current.set(item.id, node);
              else tabRefs.current.delete(item.id);
            }}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-controls={`panel-${item.id}`}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            disabled={item.disabled ?? false}
            className={cn(styles.tab, selected && styles.selected)}
            onClick={() => {
              onValueChange(item.id);
            }}
            onKeyDown={handleKeyDown}
          >
            {item.icon === undefined ? null : <Icon name={item.icon} size={17} />}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
