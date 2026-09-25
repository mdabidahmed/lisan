import { Alert } from '@/components/ui/Alert';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { DEFAULT_PROFILE } from '@/constants/app';

import styles from './Settings.module.css';

/**
 * Lisan has no accounts yet (spec §42 rules out client-side credentials), so the account block
 * describes the local profile honestly instead of offering a sign-out that would do nothing.
 */
export function AccountSection() {
  return (
    <Card padding="md">
      <CardHeader title="Account" icon="profile" accent="indigo" as="h2" />

      <div className={styles.profile}>
        <Avatar name={DEFAULT_PROFILE.name} size="lg" />
        <div className={styles.profileCopy}>
          <p className={styles.profileName}>{DEFAULT_PROFILE.name}</p>
          <p className={styles.profileRole}>{DEFAULT_PROFILE.role} on this device</p>
        </div>
        <Badge variant="neutral" size="sm">
          Local profile
        </Badge>
      </div>

      <Alert variant="info" title="No sign-in needed" className={styles.outcome}>
        Your learning lives in this browser, so there is no account to create and nothing to log out
        of. When cloud sync arrives, signing in will carry this data across your devices — until
        then, an exported backup is how you move it.
      </Alert>
    </Card>
  );
}
