/**
 * Lisan seed content — the single source of vocabulary, grammar and practice
 * data for the app.
 *
 * This module stands in for a backend: the services layer should read from
 * here (and only here) so that swapping in a real API later means changing one
 * repository implementation, not every page. It is side-effect free — the only
 * work done at import time is building two lookup maps — and every export is
 * tree-shakeable.
 *
 * ---------------------------------------------------------------------------
 * ROMANIZATION SCHEME
 * ---------------------------------------------------------------------------
 * Transliteration follows DIN 31635 with the two conventions that the product
 * spec's own examples use (kitāb, maṭʿam, muʿallim, shāy, tuffāḥ):
 *
 *   Long vowels     ā  ī  ū            كِتَاب → kitāb
 *   Emphatics       ṣ  ḍ  ṭ  ẓ         طَالِب → ṭālib
 *   Also dotted     ḥ (ح)              حَلِيب → ḥalīb
 *   Digraphs        th (ث)  kh (خ)  dh (ذ)  sh (ش)  gh (غ)
 *                   — not š / ḫ / ḏ / ġ, so the text stays keyboard-typable
 *   ʿ = ʿayn (ع)    ʾ = hamza (ء)      مَاء → māʾ,  مَطْعَم → maṭʿam
 *   Hamza is not written word-initially: أَكَلَ → akala
 *   Tāʾ marbūṭa     -a in pause, -at in an iḍāfa
 *                   مَدْرَسَة → madrasa,  مَدْرَسَةُ الْقَرْيَةِ → madrasatu al-qaryati
 *   Shadda          doubles the letter: مُدَرِّس → mudarris
 *   Article         always written al-, assimilated before the fourteen sun
 *                   letters: التُّفَّاح → at-tuffāḥ, الْقَمَر → al-qamar.
 *                   The initial vowel is never elided after another word, so
 *                   فِي الْبَيْتِ is fī al-bayti — predictable for learners.
 *
 * Head-words are cited in pausal form, without case endings (muhandis, not
 * muhandisun). Example sentences are transliterated letter for letter,
 * including full iʿrāb, so the romanization always matches the vowelled Arabic
 * above it.
 *
 * Every Arabic string in this dataset carries full harakat, including plural
 * forms and example sentences.
 */
import type { Category, VocabularyWord } from '@/types';
import { categoryDefinitions } from './categories';
import abstractAcademic from './words/abstract-academic';
import adjectives from './words/adjectives';
import basics from './words/basics';
import dailyLife from './words/daily-life';
import expressionsIdioms from './words/expressions-idioms';
import familyPeople from './words/family-people';
import foodDining from './words/food-dining';
import fruit from './words/fruit';
import healthBody from './words/health-body';
import homeRooms from './words/home-rooms';
import natureAnimals from './words/nature-animals';
import numbers from './words/numbers';
import schoolEducation from './words/school-education';
import shoppingMoney from './words/shopping-money';
import technologyMedia from './words/technology-media';
import time from './words/time';
import transportTravel from './words/transport-travel';
import vegetables from './words/vegetables';
import verbs from './words/verbs';
import workProfessions from './words/work-professions';

/** Every word in the dataset, in category order. */
export const words: VocabularyWord[] = [
  ...basics,
  ...numbers,
  ...time,
  ...familyPeople,
  ...foodDining,
  ...vegetables,
  ...fruit,
  ...homeRooms,
  ...shoppingMoney,
  ...transportTravel,
  ...dailyLife,
  ...verbs,
  ...adjectives,
  ...schoolEducation,
  ...workProfessions,
  ...natureAnimals,
  ...healthBody,
  ...technologyMedia,
  ...abstractAcademic,
  ...expressionsIdioms,
];

function buildWordsById(source: readonly VocabularyWord[]): ReadonlyMap<string, VocabularyWord> {
  const index = new Map<string, VocabularyWord>();
  for (const word of source) {
    index.set(word.id, word);
  }
  return index;
}

function buildWordsByCategory(
  source: readonly VocabularyWord[],
): ReadonlyMap<string, VocabularyWord[]> {
  const index = new Map<string, VocabularyWord[]>();
  for (const word of source) {
    const bucket = index.get(word.categoryId);
    if (bucket) {
      bucket.push(word);
    } else {
      index.set(word.categoryId, [word]);
    }
  }
  return index;
}

/** O(1) lookup by word id, built once at module load. */
export const wordsById: ReadonlyMap<string, VocabularyWord> = buildWordsById(words);

/** O(1) lookup of a category's words, built once at module load. */
export const wordsByCategory: ReadonlyMap<string, VocabularyWord[]> = buildWordsByCategory(words);

/** The 18 categories, with `wordCount` derived from the actual word lists. */
export const categories: Category[] = categoryDefinitions.map((category) => ({
  ...category,
  wordCount: wordsByCategory.get(category.id)?.length ?? 0,
}));

export { grammarLessons, lessonExamples } from './grammar';
export { practiceModes } from './practiceModes';

export type { CategoryDefinition } from './categories';
export type { PracticeDirection, PracticeModeDefinition, PracticeModeType } from './practiceModes';
