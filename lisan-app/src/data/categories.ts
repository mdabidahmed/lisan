/**
 * The 20 vocabulary categories — the spec's original 17 (spec §24), with Numbers & Time split
 * into standalone Numbers and Time categories so Numbers can carry a full 1–100 count, plus
 * standalone Vegetables and Fruit categories for produce-specific vocabulary.
 *
 * `wordCount` is deliberately absent here: it is derived from the real word
 * lists in `src/data/index.ts`, so the number can never drift from the content.
 *
 * `color` is always a reference to a design token of the form
 * `--color-category-<slug>` defined in the token stylesheet.
 */
import type { Category } from '@/types';

/** A category as authored — the derived `wordCount` is added by the barrel. */
export type CategoryDefinition = Omit<Category, 'wordCount'>;

export const categoryDefinitions = [
  {
    id: 'basics',
    name: 'Basics',
    arabicName: 'الْأَسَاسِيَّات',
    description:
      'The first words every learner needs: greetings, yes and no, and how to be polite.',
    icon: 'vocabulary',
    color: 'var(--color-category-basics)',
    level: 'A1',
  },
  {
    id: 'numbers',
    name: 'Numbers',
    arabicName: 'الْأَرْقَام',
    description: 'Counting from one to a hundred, the building block of every other number.',
    icon: 'statistics',
    color: 'var(--color-category-numbers)',
    level: 'A1',
  },
  {
    id: 'time',
    name: 'Time',
    arabicName: 'الْوَقْت',
    description: 'Telling the time, and talking about days, months and years.',
    icon: 'study-time',
    color: 'var(--color-category-time)',
    level: 'A1',
  },
  {
    id: 'family-people',
    name: 'Family & People',
    arabicName: 'الْعَائِلَة وَالنَّاس',
    description: 'Relatives, friends and neighbours — the people you talk about every day.',
    icon: 'family',
    color: 'var(--color-category-family)',
    level: 'A1',
  },
  {
    id: 'food-dining',
    name: 'Food & Dining',
    arabicName: 'الطَّعَام وَالشَّرَاب',
    description: 'Everyday food and drink, plus the words you need to order a meal out.',
    icon: 'food',
    color: 'var(--color-category-food)',
    level: 'A1',
  },
  {
    id: 'vegetables',
    name: 'Vegetables',
    arabicName: 'الْخُضْرَوَات',
    description: 'Everyday vegetables from the market and kitchen, one plant at a time.',
    icon: 'food',
    color: 'var(--color-category-vegetables)',
    level: 'A1',
  },
  {
    id: 'fruit',
    name: 'Fruit',
    arabicName: 'الْفَوَاكِه',
    description: 'Sweet and tart fruit, from the orchard to the fruit bowl.',
    icon: 'food',
    color: 'var(--color-category-fruit)',
    level: 'A1',
  },
  {
    id: 'home-rooms',
    name: 'Home & Rooms',
    arabicName: 'الْبَيْت وَالْغُرَف',
    description: 'Rooms, furniture and household objects found in an Arabic-speaking home.',
    icon: 'home',
    color: 'var(--color-category-home)',
    level: 'A1',
  },
  {
    id: 'shopping-money',
    name: 'Shopping & Money',
    arabicName: 'التَّسَوُّق وَالْمَال',
    description: 'Markets, prices and payment — everything needed to buy and sell.',
    icon: 'places',
    color: 'var(--color-category-shopping)',
    level: 'A2',
  },
  {
    id: 'transport-travel',
    name: 'Transport & Travel',
    arabicName: 'النَّقْل وَالسَّفَر',
    description: 'Getting around by car, bus, train or plane, and the places travel takes you.',
    icon: 'travel',
    color: 'var(--color-category-travel)',
    level: 'A2',
  },
  {
    id: 'daily-life',
    name: 'Daily Life',
    arabicName: 'الْحَيَاة الْيَوْمِيَّة',
    description: 'Morning routines, chores and appointments that fill an ordinary day.',
    icon: 'streak',
    color: 'var(--color-category-daily)',
    level: 'A2',
  },
  {
    id: 'verbs',
    name: 'Verbs',
    arabicName: 'الْأَفْعَال',
    description: 'High-frequency action words, shown in both the past and present tense.',
    icon: 'practice',
    color: 'var(--color-category-verbs)',
    level: 'A2',
  },
  {
    id: 'adjectives',
    name: 'Adjectives',
    arabicName: 'الصِّفَات',
    description: 'Describing words and their opposites, from size and speed to mood and taste.',
    icon: 'theme',
    color: 'var(--color-category-adjectives)',
    level: 'A2',
  },
  {
    id: 'school-education',
    name: 'School & Education',
    arabicName: 'الْمَدْرَسَة وَالتَّعْلِيم',
    description: 'Classrooms, study materials and exams from primary school to university.',
    icon: 'education',
    color: 'var(--color-category-school)',
    level: 'A2',
  },
  {
    id: 'work-professions',
    name: 'Work & Professions',
    arabicName: 'الْعَمَل وَالْمِهَن',
    description: 'Common jobs and the vocabulary of the workplace.',
    icon: 'work',
    color: 'var(--color-category-work)',
    level: 'B1',
  },
  {
    id: 'nature-animals',
    name: 'Nature & Animals',
    arabicName: 'الطَّبِيعَة وَالْحَيَوَانَات',
    description: 'Landscape, weather and the animals that appear throughout Arabic literature.',
    icon: 'nature',
    color: 'var(--color-category-nature)',
    level: 'B1',
  },
  {
    id: 'health-body',
    name: 'Health & Body',
    arabicName: 'الصِّحَّة وَالْجِسْم',
    description: 'Parts of the body and the language of illness, treatment and staying well.',
    icon: 'favorite',
    color: 'var(--color-category-health)',
    level: 'B1',
  },
  {
    id: 'technology-media',
    name: 'Technology & Media',
    arabicName: 'التِّقْنِيَة وَالْإِعْلَام',
    description: 'Devices, the internet and the news — modern Arabic as it is written today.',
    icon: 'keyboard',
    color: 'var(--color-category-technology)',
    level: 'B1',
  },
  {
    id: 'abstract-academic',
    name: 'Abstract & Academic',
    arabicName: 'الْمَفَاهِيم الْمُجَرَّدَة',
    description: 'Ideas, values and research vocabulary for essays, debate and formal writing.',
    icon: 'grammar',
    color: 'var(--color-category-abstract)',
    level: 'B2',
  },
  {
    id: 'expressions-idioms',
    name: 'Expressions & Idioms',
    arabicName: 'التَّعْبِيرَات وَالْأَمْثَال',
    description: 'Set phrases and proverbs that make speech sound natural rather than translated.',
    icon: 'microphone',
    color: 'var(--color-category-expressions)',
    level: 'B2',
  },
] satisfies readonly CategoryDefinition[];
