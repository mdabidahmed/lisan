# i18n

Typed translation scaffolding for Lisan. English is the only interface locale today; Arabic is
registered, listed in Settings as unavailable, and gated so that it cannot become active until its
dictionary exists.

No i18n dependency: a nested dictionary plus one context is enough at this scale, and deriving the
key union from the dictionary gives stronger guarantees than most libraries do.

## Layout

| File                  | Role                                                                    |
| --------------------- | ----------------------------------------------------------------------- |
| `messages/en.ts`      | English copy. The source of truth for every key.                        |
| `keys.ts`             | Derives `TranslationKey` and the per-message placeholder types.         |
| `locales.ts`          | Locale ids, direction, `Intl` tags, availability, `resolveLocale`.      |
| `translate.ts`        | `createTranslator(locale)` and the module-scope `t`.                    |
| `format.ts`           | `Intl` wrappers: numbers, percentages, dates, weekdays, relative time.  |
| `I18nProvider.tsx`    | Publishes the locale to React and to `<html lang>` / `<html dir>`.      |
| `useTranslation.ts`   | `{ t, locale, dir }`.                                                   |
| `documentLocale.ts`   | The only writer of `lang`/`dir` on the document root.                   |
| `contentDirection.ts` | Why Arabic content direction is independent of the interface direction. |

## Using it

```tsx
const { t, locale, dir } = useTranslation();

t('settings.header.title'); // 'Settings'
t('settings.learning.goalOption', { count: 20 }); // '20 words per day'
formatDate(word.addedAt, locale); // 'Mar 5, 2026'
```

Keys are checked against the English dictionary, so `t('settings.headr.title')` is a compile error
rather than a blank label. So are the interpolation values: a message with `{count}` cannot be
rendered without one, and a message without placeholders rejects them.

Numbers passed as interpolation values are formatted for the active locale, so write `{count}` and
pass the raw number — never pre-format digits into a message.

## Adding a locale

1. `messages/xx.ts` — copy `en.ts` and translate the values. Type the export as
   `LocalizedDictionary` and the typecheck names every key that is missing or invented; anything
   still missing at runtime falls back to the English message rather than to blank space.
2. `translate.ts` — add the dictionary to `DICTIONARIES`.
3. `locales.ts` — add the id to `LOCALE_IDS` (if new), fill in `LOCALES[xx]`, and set
   `uiAvailable: true`.
4. `index.html` — add the locale to the `directions` map in the inline bootstrap, so the first paint
   is already in the right direction.
5. `common.languageName` — add the language's own name, in its own language.

Steps 3 and 4 are the switch: until `uiAvailable` is `true`, `resolveLocale` keeps the locale out of
the interface even if a learner has it persisted in settings, and the Settings language card renders
it as unavailable.

## Migrating a page's strings

One page, or one card, at a time — a whole-app sweep collides with everything else in flight.
`src/pages/Settings/Settings.tsx` is the worked example: its page chrome, document metadata and
language card go through `t()` while the rest of the page is still literal copy.

1. Add a group for the page to `messages/en.ts` (`settings`, `vocabulary`, …), nested by card or
   section. Move the copy across verbatim — this is not the moment to rewrite wording.
2. Replace `${value}` template literals with `{name}` placeholders.
3. In the component, `const { t } = useTranslation();` and swap the literals for keys.
4. Tests keep asserting on the visible text. If a test breaks, the copy moved — not the key.

Arabic learning content is data, not copy: words, examples and grammar live in `src/data` and are
never translated.

## Direction

`I18nProvider` sets `lang` and `dir` on `<html>` from the active locale, and nothing else.

Arabic **content** direction is independent of the interface: every element rendering Arabic carries
its own `lang="ar" dir="rtl"` (see `contentDirection.ts` and product spec §63), which holds whether
the interface is English or Arabic. An English interface still renders تُفَّاح right to left; an
Arabic interface does not flip the English gloss beside it.

## Relationship to `src/utils`

`src/utils/format.ts` and `src/utils/date.ts` are the app-facing vocabulary on top of this layer,
not a second implementation of it. They own the things `Intl` has no opinion about — percentages
expressed 0–100, `"12h 30m"` durations, `"1:33"` quiz clocks, signed deltas — and hand everything
else here. No module outside `format.ts` constructs an `Intl` formatter or names a locale tag.

Every one of those helpers takes a `Locale` and defaults to `DEFAULT_LOCALE`, so a call site
becomes locale-aware by passing `locale` from `useTranslation()` and changes in no other way.
Most still take the default, which is correct while English is the only available interface.

## Outstanding

- The interface is still largely literal English. `messages/en.ts` covers the Settings page; the
  rest migrates card by card (see above). Nothing is blocked on this layer.
- `formatDuration` and `formatElapsed` in `src/utils/format.ts` build `"12h 30m"` and `"1:33"`
  from literal letters and a colon. `Intl.NumberFormat`'s `unit` style and `Intl.DurationFormat`
  can localise both, but they change the English output too, so that is a copy decision rather
  than a mechanical swap.
