/**
 * Canonical domain types for Lisan.
 *
 * Both the application code and the authored content under `src/data/` import from here, so this
 * barrel is the contract between them. Shapes are additive-only.
 */
export type { IconName } from '@/components/icons/iconNames';

export * from './content';
export * from './progress';
export * from './quiz';
export * from './settings';
export * from './api';
export * from './ui';
