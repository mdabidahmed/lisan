import type { IconName } from '@/components/icons';
import { ROUTES } from '@/constants/routes';

export interface QuickAction {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: IconName;
  readonly to: string;
  /** Token suffix: `--color-tile-<accent>` and `--color-tile-<accent>-soft`. */
  readonly accent: 'vocabulary' | 'grammar' | 'practice' | 'progress';
}

export const DEFAULT_QUICK_ACTIONS: readonly QuickAction[] = [
  {
    id: 'vocabulary',
    title: 'Vocabulary',
    description: 'Everyday words with audio',
    icon: 'vocabulary',
    to: ROUTES.vocabulary,
    accent: 'vocabulary',
  },
  {
    id: 'grammar',
    title: 'Grammar',
    description: 'Simple to advanced lessons',
    icon: 'grammar',
    to: ROUTES.grammar,
    accent: 'grammar',
  },
  {
    id: 'practice',
    title: 'Practice',
    description: 'Quizzes & exercises',
    icon: 'practice',
    to: ROUTES.practice,
    accent: 'practice',
  },
  {
    id: 'progress',
    title: 'Track Progress',
    description: 'See your improvement',
    icon: 'statistics',
    to: ROUTES.progress,
    accent: 'progress',
  },
];
