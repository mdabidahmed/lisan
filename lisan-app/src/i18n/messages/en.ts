/**
 * English UI copy — the source of truth for every translation key in the app.
 *
 * Rules for editing this file (see `src/i18n/README.md`):
 *   • One top-level group per feature area, mirroring `src/pages` and `src/features`. `common` is
 *     reserved for copy that genuinely appears in more than one area.
 *   • Every leaf is a string. A leaf that holds anything else drops out of `TranslationKey`.
 *   • `as const` is load-bearing: both the key union and the `{placeholder}` names of each message
 *     are read back out of these literal types, so a typo is a compile error, not a blank label.
 *   • Interpolation uses `{name}` tokens. Write numbers as bare tokens — `t()` formats them for the
 *     active locale, so a message must never pre-format or hard-code digits.
 *   • Arabic learning content (words, examples, grammar) is data, not copy. It lives in `src/data`
 *     and is never translated; see `src/i18n/contentDirection.ts`.
 */
export const en = {
  common: {
    /**
     * Language names are written in their own language on purpose: a language picker has to be
     * readable to the speaker of the language being picked, whatever the interface locale is.
     */
    languageName: {
      en: 'English',
      ar: 'العربية',
    },
  },

  /**
   * The sidebar upsell and the dialog behind it.
   *
   * Written against a product that does not exist yet, which is the whole constraint: no feature is
   * named as a commitment, no price or date appears anywhere, and `dialog.localOnly` states plainly
   * that nothing is sent and no email will arrive. If a real endpoint is ever wired behind
   * `submitWaitlist`, that string stops being true and has to be rewritten before the switch flips —
   * see the seam note in `src/services/premium/waitlist.ts`.
   */
  premium: {
    card: {
      title: 'Unlock More',
      body: 'Get premium features and extra content',
      cta: 'Go Premium',
      /** Shown instead of the pitch once the learner has registered. */
      registeredBody: 'You asked for this. Nothing to do for now.',
      registeredCta: 'See what you saved',
    },
    dialog: {
      title: 'There is no premium tier yet',
      description:
        'Nothing to buy, no price, no date. This button exists to find out whether the tier is worth building at all.',
      bodyFree:
        'Everything in Lisan is free, and a paid tier would extend it rather than fence off what you already use.',
      bodyDirection:
        'The directions under consideration are the ones that cost money to run: a larger authored vocabulary, recorded human pronunciation in place of your browser’s voice, and progress that follows you between devices. None of it is built, and none of it is promised.',
      emailLabel: 'Email address',
      emailHint: 'Optional. Registering with the field blank still counts.',
      emailError:
        'That does not look like an email address. Correct it, or clear the field to register without one.',
      localOnlyTitle: 'Nothing leaves this device',
      localOnly:
        'There is no server behind this button. Your answer, and the address if you leave one, are saved in this browser only — so no email will arrive, and clearing your browser data clears this too.',
      submit: 'Register my interest',
      submitError: 'That could not be saved. Try once more.',
      dismiss: 'Not now',
      close: 'Done',
      submittedTitle: 'Registered',
      submitted:
        'Saved in this browser. That is one more voice for a premium tier — and still nothing to buy, so nothing will arrive by email.',
      registeredTitle: 'You have already registered',
      registeredOn: 'You registered on {date}. Still no premium tier, still no price and no date.',
      registeredEmail: 'The address saved in this browser: {email}',
      registeredNoEmail: 'You registered without leaving an address.',
      forget: 'Remove this',
      forgottenTitle: 'Removed',
      forgotten: 'Nothing about premium is stored on this device any more.',
    },
  },

  settings: {
    meta: {
      title: 'Settings',
      description: 'Appearance, learning goals, audio and accessibility preferences.',
    },
    header: {
      title: 'Settings',
      subtitle: 'Tune Lisan to the way you learn best.',
    },
    toast: {
      savedTitle: 'Settings saved',
    },
    language: {
      cardTitle: 'Language',
      fieldLabel: 'Interface language',
      unavailableTitle: 'Arabic interface is on the way',
      unavailableBody:
        'The interface is English for now. Arabic vocabulary, examples and grammar already render in full Arabic script, right to left, and stay that way whichever interface language you choose.',
      savedDescription: 'Interface language updated',
    },
    /**
     * Typeface names are brand names: they are written the same in every locale, the way
     * `languageName` writes each language in its own script. They live here so the Settings page
     * holds no literal copy, not because they will ever be translated.
     */
    fonts: {
      arabicLabel: 'Arabic font',
      arabicHint:
        'Applies to vocabulary, examples and grammar. Each face sets harakat its own way.',
      arabicOption: {
        naskh: 'Noto Naskh Arabic',
        amiri: 'Amiri',
        indopak: 'IndoPak Nastaleeq',
      },
      arabicSaved: 'Arabic font updated',
      readingLabel: 'Reading font',
      readingHint: 'Applies to English text across the app.',
      readingOption: {
        inter: 'Inter',
        spectral: 'Spectral',
      },
      readingSaved: 'Reading font updated',
      monoLabel: 'Monospace transliteration',
      monoDescription: 'Set romanised pronunciation in IBM Plex Mono, so diacritics line up.',
      previewLabel: 'Preview',
      previewNote: '“{word}”, from the vocabulary library.',
    },
    learning: {
      goalOption: '{count} words per day',
      speedOption: '{speed}x',
    },
  },

  topbar: {
    /**
     * The quick font switcher names its own chrome and nothing else: the field labels and the
     * typeface names it lists come from `settings.fonts`, which is the only place they are
     * written. Copying them here would let the two surfaces drift a rewording apart.
     */
    fonts: {
      trigger: 'Change typeface',
      title: 'Typeface',
    },
  },
} as const;
