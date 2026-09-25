import { useTheme } from '@/app/providers/theme';
import { IconButton } from '@/components/ui/IconButton';

export function ThemeToggle() {
  const { resolved, toggle } = useTheme();
  const nextTheme = resolved === 'dark' ? 'light' : 'dark';

  return (
    <IconButton
      icon="theme"
      label={`Switch to ${nextTheme} theme`}
      variant="secondary"
      onClick={toggle}
      aria-pressed={resolved === 'dark'}
    />
  );
}
