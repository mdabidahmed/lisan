/**
 * The Lisan design system.
 *
 * Page code should import from the specific folder (`@/components/ui/Button`) so that a page only
 * pulls in what it renders; this barrel exists for discoverability and for tests.
 */

/* ── Atoms ────────────────────────────────────────────────────────────────── */
export { Alert, type AlertProps, type AlertVariant } from './Alert';
export {
  ArabicText,
  type ArabicTextElement,
  type ArabicTextFlow,
  type ArabicTextProps,
} from './ArabicText';
export { Avatar, type AvatarProps, type AvatarSize } from './Avatar';
export { Badge, type BadgeProps, type BadgeSize } from './Badge';
export { Button, type ButtonProps, type ButtonSize, type ButtonVariant } from './Button';
export {
  Card,
  CardHeader,
  type CardElevation,
  type CardHeaderProps,
  type CardPadding,
  type CardProps,
} from './Card';
export { Checkbox, type CheckboxProps } from './Checkbox';
export { Chip, type ChipProps } from './Chip';
export { Combobox, type ComboboxOption, type ComboboxProps, type ComboboxSize } from './Combobox';
export { Divider, type DividerProps } from './Divider';
export {
  useFontControls,
  type FontControls,
  type FontFamilyControl,
  type MonospaceTransliterationControl,
} from './FontControls';
export {
  IconButton,
  type IconButtonProps,
  type IconButtonSize,
  type IconButtonVariant,
} from './IconButton';
export { Input, type InputProps, type InputSize } from './Input';
export { ProgressBar, type ProgressBarProps, type ProgressBarTone } from './ProgressBar';
export { ResponsiveImage, type ResponsiveImageProps } from './ResponsiveImage';
export { Select, type SelectOption, type SelectProps, type SelectSize } from './Select';
export { Skeleton, type SkeletonProps } from './Skeleton';
export { Spinner, type SpinnerProps } from './Spinner';
export { Switch, type SwitchProps } from './Switch';
export { Tooltip, type TooltipAlign, type TooltipPlacement, type TooltipProps } from './Tooltip';
export { UrduText, type UrduTextProps } from './UrduText';

/* ── Molecules ────────────────────────────────────────────────────────────── */
export { AudioButton, type AudioButtonProps } from './AudioButton';
export { CategoryBadge, type CategoryBadgeProps } from './CategoryBadge';
export { DetailRow, type DetailRowProps } from './DetailRow';
export { EmptyState, type EmptyStateProps } from './EmptyState';
export { ErrorState, type ErrorStateProps } from './ErrorState';
export { Modal, type ModalProps } from './Modal';
export { Pagination, type PaginationProps } from './Pagination';
export { ProgressRing, type ProgressRingProps } from './ProgressRing';
export { QuizOption, type QuizOptionProps, type QuizOptionState } from './QuizOption';
export { SearchBox, type SearchBoxProps } from './SearchBox';
export { SectionHeader, type SectionHeaderProps } from './SectionHeader';
export { StatCard, type StatCardProps } from './StatCard';
export { TabPanel, Tabs, type TabItem, type TabPanelProps, type TabsProps } from './Tabs';
export {
  Toast,
  ToastViewport,
  type ToastData,
  type ToastProps,
  type ToastViewportProps,
} from './Toast';
export { VocabularyMeta, type VocabularyMetaProps } from './VocabularyMeta';
export { VocabularyRow, type VocabularyRowProps } from './VocabularyRow';
export { WordThumbnail, type WordThumbnailProps } from './WordThumbnail';
