import { screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NavDrawer } from '@/components/layout/AppShell';
import { STORAGE_NAMESPACE } from '@/constants';
import { analytics } from '@/services/analytics';
import { setWaitlistTransport } from '@/services/premium';
import { usePremiumStore } from '@/store/premiumStore';
import { renderWithProviders, userEvent } from '@/test/renderWithProviders';

import { PremiumCard } from './PremiumCard';

const KEY = `${STORAGE_NAMESPACE}:premium`;

const EXISTING = { email: 'learner@example.com', submittedAt: '2026-09-20T10:00:00.000Z' };

beforeEach(() => {
  usePremiumStore.setState({ signup: null });
  setWaitlistTransport(null);
});

/** The CTA opens a lazily loaded chunk, so the dialog arrives a tick after the press. */
async function openDialog(user: ReturnType<typeof userEvent.setup>, label: RegExp) {
  await user.click(screen.getByRole('button', { name: label }));
  return screen.findByRole('dialog');
}

function storedSignup(): { email: unknown; submittedAt: unknown } | null {
  const raw = localStorage.getItem(KEY);
  if (raw === null) return null;
  return (JSON.parse(raw) as { data: { signup: typeof EXISTING | null } }).data.signup;
}

describe('<PremiumCard />', () => {
  it('pitches an unbuilt tier, and says so, rather than doing nothing when pressed', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PremiumCard />);

    const dialog = await openDialog(user, /go premium/i);

    expect(within(dialog).getByRole('heading', { name: /no premium tier yet/i })).toBeVisible();
    expect(dialog).toHaveAccessibleDescription(/nothing to buy, no price, no date/i);
    // The one promise the copy must never make while there is no backend.
    expect(within(dialog).getByText(/no email will arrive/i)).toBeVisible();
  });

  it('records that the pitch was seen, so impressions can be weighed against signups', async () => {
    const track = vi.spyOn(analytics, 'track');
    const user = userEvent.setup();
    renderWithProviders(<PremiumCard />);

    await openDialog(user, /go premium/i);

    expect(track).toHaveBeenCalledWith('premium_dialog_opened', { returning: false });
  });

  it('is a labelled, optional field and not a required one', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PremiumCard />);
    await openDialog(user, /go premium/i);

    const field = screen.getByLabelText(/email address/i);
    expect(field).toHaveAccessibleDescription(/optional/i);
    expect(field).not.toBeRequired();
  });
});

describe('<PremiumCard /> validation', () => {
  it('rejects a malformed address, ties the message to the field, and persists nothing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PremiumCard />);
    await openDialog(user, /go premium/i);

    const field = screen.getByLabelText(/email address/i);
    await user.type(field, 'learner@');
    await user.click(screen.getByRole('button', { name: /register my interest/i }));

    await waitFor(() => {
      expect(field).toBeInvalid();
    });
    expect(field).toHaveAccessibleDescription(/does not look like an email address/i);
    // What was typed is kept, so it can be corrected rather than retyped.
    expect(field).toHaveValue('learner@');

    expect(storedSignup()).toBeNull();
    expect(usePremiumStore.getState().signup).toBeNull();
  });

  it('clears the error as soon as the learner starts correcting it', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PremiumCard />);
    await openDialog(user, /go premium/i);

    const field = screen.getByLabelText(/email address/i);
    await user.type(field, 'learner@');
    await user.click(screen.getByRole('button', { name: /register my interest/i }));
    await waitFor(() => {
      expect(field).toBeInvalid();
    });

    await user.type(field, 'example.com');

    expect(field).not.toBeInvalid();
  });

  it('accepts a blank field, because the email is optional and the vote still counts', async () => {
    const track = vi.spyOn(analytics, 'track');
    const user = userEvent.setup();
    renderWithProviders(<PremiumCard />);
    await openDialog(user, /go premium/i);

    await user.click(screen.getByRole('button', { name: /register my interest/i }));

    await waitFor(() => {
      expect(usePremiumStore.getState().signup?.email).toBeNull();
    });
    expect(track).toHaveBeenCalledWith('premium_interest_registered', { withEmail: false });
  });
});

describe('<PremiumCard /> submission', () => {
  it('persists through the storage service, records the event, and announces the outcome', async () => {
    const track = vi.spyOn(analytics, 'track');
    const user = userEvent.setup();
    renderWithProviders(<PremiumCard />);
    await openDialog(user, /go premium/i);

    await user.type(screen.getByLabelText(/email address/i), 'learner@example.com');
    await user.click(screen.getByRole('button', { name: /register my interest/i }));

    const status = await screen.findByRole('status');
    await waitFor(() => {
      expect(status).toHaveTextContent(/saved in this browser/i);
    });
    // Announced *and* focused: the form that was holding focus has just been replaced.
    expect(status).toHaveFocus();

    expect(usePremiumStore.getState().signup?.email).toBe('learner@example.com');
    expect(storedSignup()).toMatchObject({ email: 'learner@example.com' });
    expect(track).toHaveBeenCalledWith('premium_interest_registered', { withEmail: true });
  });

  it('submits on Enter, through the form rather than a click handler', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PremiumCard />);
    await openDialog(user, /go premium/i);

    await user.type(screen.getByLabelText(/email address/i), 'learner@example.com{Enter}');

    await waitFor(() => {
      expect(usePremiumStore.getState().signup?.email).toBe('learner@example.com');
    });
  });

  it('keeps the learner un-registered when the transport rejects', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    setWaitlistTransport({ submit: () => Promise.reject(new Error('503')) });
    const user = userEvent.setup();
    renderWithProviders(<PremiumCard />);
    await openDialog(user, /go premium/i);

    const field = screen.getByLabelText(/email address/i);
    await user.type(field, 'learner@example.com');
    await user.click(screen.getByRole('button', { name: /register my interest/i }));

    await waitFor(() => {
      expect(field).toHaveAccessibleDescription(/could not be saved/i);
    });
    expect(usePremiumStore.getState().signup).toBeNull();
    expect(field).toHaveValue('learner@example.com');
  });
});

describe('<PremiumCard /> for a learner who already registered', () => {
  beforeEach(() => {
    usePremiumStore.setState({ signup: EXISTING });
  });

  it('does not pitch the card again', () => {
    renderWithProviders(<PremiumCard />);

    expect(screen.getByRole('button', { name: /see what you saved/i })).toBeVisible();
    expect(screen.queryByRole('button', { name: /go premium/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/get premium features/i)).not.toBeInTheDocument();
  });

  it('opens on what was saved, with no ask and no form', async () => {
    const track = vi.spyOn(analytics, 'track');
    const user = userEvent.setup();
    renderWithProviders(<PremiumCard />);

    const dialog = await openDialog(user, /see what you saved/i);

    expect(within(dialog).getByRole('heading', { name: /already registered/i })).toBeVisible();
    expect(dialog).toHaveAccessibleDescription(/you registered on Sep 20, 2026/i);
    expect(within(dialog).getByText(/learner@example\.com/)).toBeVisible();

    expect(screen.queryByLabelText(/email address/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /register my interest/i })).not.toBeInTheDocument();

    expect(track).toHaveBeenCalledWith('premium_dialog_opened', { returning: true });
  });

  it('lets them take the address back, and announces that it is gone', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PremiumCard />);
    await openDialog(user, /see what you saved/i);

    await user.click(screen.getByRole('button', { name: /remove this/i }));

    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent(/nothing about premium is stored on this device/i);
    expect(usePremiumStore.getState().signup).toBeNull();
    expect(storedSignup()).toBeNull();
  });
});

describe('<PremiumCard /> keyboard and focus', () => {
  it('dismisses on Escape and hands focus back to the button that opened it', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PremiumCard />);

    const cta = screen.getByRole('button', { name: /go premium/i });
    const dialog = await openDialog(user, /go premium/i);
    expect(dialog.contains(document.activeElement)).toBe(true);

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(cta).toHaveFocus();
  });

  it('dismisses on the close button too', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PremiumCard />);
    await openDialog(user, /go premium/i);

    await user.click(screen.getByRole('button', { name: /close dialog/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  /**
   * The card sits in the sidebar, which is an off-canvas drawer on phones — so this dialog opens
   * inside another focus trap. One Escape must dismiss one thing.
   */
  it('leaves the mobile drawer open when the dialog inside it is dismissed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<NavDrawer open onClose={onClose} />);

    const drawer = screen.getByRole('dialog', { name: /navigation/i });
    await user.click(within(drawer).getByRole('button', { name: /go premium/i }));
    const premium = await screen.findByRole('dialog', { name: /no premium tier yet/i });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(premium).not.toBeInTheDocument();
    });
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: /navigation/i })).toBeInTheDocument();

    // And the drawer's own trap is back on top once the dialog above it has gone.
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
