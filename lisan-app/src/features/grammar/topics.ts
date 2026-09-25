import type { GrammarTopic } from '@/types';

/** The ten grammar topics, in the order the spec lists them (§56). */
export const GRAMMAR_TOPICS: readonly GrammarTopic[] = [
  'nahw',
  'sarf',
  'pronouns',
  'verbs',
  'nouns',
  'adjectives',
  'sentence-structure',
  'particles',
  'cases',
  'verb-forms',
];

/**
 * Nahw (syntax) and sarf (morphology) keep their Arabic names because that is what the tradition
 * — and every other textbook a learner will meet — calls them.
 */
export const GRAMMAR_TOPIC_LABELS: Record<GrammarTopic, string> = {
  nahw: 'Nahw',
  sarf: 'Sarf',
  pronouns: 'Pronouns',
  verbs: 'Verbs',
  nouns: 'Nouns',
  adjectives: 'Adjectives',
  'sentence-structure': 'Sentence Structure',
  particles: 'Particles',
  cases: 'Cases',
  'verb-forms': 'Verb Forms',
};

export function isGrammarTopic(value: string): value is GrammarTopic {
  return (GRAMMAR_TOPICS as readonly string[]).includes(value);
}

export function grammarTopicLabel(topic: GrammarTopic): string {
  return GRAMMAR_TOPIC_LABELS[topic];
}
