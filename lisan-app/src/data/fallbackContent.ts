import type { Category, GrammarLesson, PracticeMode, VocabularyWord } from '@/types';

/**
 * A tiny, self-contained content set: the API layer's fallback when a slice of the authored
 * dataset is missing or empty, so a partial `@/data` renders instead of crashing. See the guard in
 * `src/services/api/contentSource.ts`.
 *
 * It lives here, in `src/data`, because it is production content — eleven words the app may
 * genuinely serve. It used to live in `src/test/fixtures/`, which put a test fixture in the
 * production module graph; `src/test/fixtures/sampleContent.ts` now re-exports from this file, so
 * unit tests still get a small deterministic dataset from the one place that authors it.
 *
 * Deliberately not exported from `src/data/index.ts`: nothing but `contentSource` should reach for
 * it, and the barrel is the 352-word dataset's own entry point.
 *
 * It mirrors the words visible in the reference screens so the shell looks right even without the
 * full dataset. Every id, and every `categoryId`, must exist in the authored dataset too —
 * `src/services/api/contentSource.test.ts` enforces that, because a fallback that resolves to ids
 * the rest of the app has never heard of degrades into silently empty screens.
 */

export const fallbackCategories: Category[] = [
  {
    id: 'family-people',
    name: 'Family & People',
    arabicName: 'الْعَائِلَة',
    description: 'Talk about relatives, friends and the people around you.',
    icon: 'family',
    color: 'green',
    level: 'A1',
    wordCount: 1,
  },
  {
    id: 'food-dining',
    name: 'Food & Dining',
    arabicName: 'الطَّعَام',
    description: 'Everyday food, drinks and ordering at a restaurant.',
    icon: 'food',
    color: 'orange',
    level: 'A1',
    wordCount: 2,
  },
  {
    id: 'work-professions',
    name: 'Work & Professions',
    arabicName: 'الْمِهَن',
    description: 'Jobs, workplaces and describing what people do.',
    icon: 'work',
    color: 'blue',
    level: 'A2',
    wordCount: 4,
  },
  {
    id: 'school-education',
    name: 'School & Education',
    arabicName: 'التَّعْلِيم',
    description: 'Classrooms, study materials and academic life.',
    icon: 'education',
    color: 'pink',
    level: 'A1',
    wordCount: 2,
  },
  {
    id: 'daily-life',
    name: 'Daily Life',
    arabicName: 'الْحَيَاة الْيَوْمِيَّة',
    description: 'The words you reach for every single day.',
    icon: 'home',
    color: 'purple',
    level: 'A1',
    wordCount: 1,
  },
  {
    id: 'nature-animals',
    name: 'Nature & Animals',
    arabicName: 'الطَّبِيعَة',
    description: 'Weather, landscapes, plants and animals.',
    icon: 'nature',
    color: 'teal',
    level: 'A2',
    wordCount: 1,
  },
];

export const fallbackWords: VocabularyWord[] = [
  {
    id: 'engineer',
    english: 'Engineer',
    arabic: 'الْمُهَنْدِسُ',
    transliteration: 'al-muhandisu',
    categoryId: 'work-professions',
    level: 'A2',
    partOfSpeech: 'Noun (إسْم)',
    pluralForm: { arabic: 'الْمُهَنْدِسُونَ', transliteration: 'al-muhandisūn' },
    meaningUrdu: 'انجینئر',
    meaningHindi: 'इंजीनियर',
    audio: { source: 'browser' },
    examples: [
      {
        arabic: 'الْمُهَنْدِسُ يَبْنِي الْمَبَانِيَ.',
        english: 'The engineer builds buildings.',
        transliteration: 'al-muhandisu yabnī al-mabānī.',
      },
      {
        arabic: 'أُرِيدُ أَنْ أَكُونَ مُهَنْدِسًا.',
        english: 'I want to be an engineer.',
        transliteration: 'urīdu an akūna muhandisan.',
      },
    ],
    relatedWords: ['teacher', 'doctor', 'student'],
    tags: ['profession', 'people'],
  },
  {
    id: 'teacher',
    english: 'Teacher',
    arabic: 'مُدَرِّسٌ',
    transliteration: 'mudarrisu',
    categoryId: 'work-professions',
    level: 'A1',
    partOfSpeech: 'Noun (إسْم)',
    pluralForm: { arabic: 'مُدَرِّسُونَ', transliteration: 'mudarrisūn' },
    audio: { source: 'browser' },
    examples: [
      {
        arabic: 'الْمُدَرِّسُ فِي الْفَصْلِ.',
        english: 'The teacher is in the classroom.',
        transliteration: 'al-mudarrisu fī al-faṣl.',
      },
    ],
    relatedWords: ['student', 'school'],
    tags: ['profession', 'education'],
  },
  {
    id: 'doctor',
    english: 'Doctor',
    arabic: 'طَبِيبٌ',
    transliteration: 'ṭabibu',
    categoryId: 'work-professions',
    level: 'A1',
    partOfSpeech: 'Noun (إسْم)',
    audio: { source: 'browser' },
    examples: [
      {
        arabic: 'الطَّبِيبُ يُسَاعِدُ الْمَرْضَى.',
        english: 'The doctor helps the patients.',
        transliteration: 'aṭ-ṭabību yusāʿidu al-marḍā.',
      },
    ],
    relatedWords: ['engineer'],
    tags: ['profession', 'health'],
  },
  {
    id: 'student',
    english: 'Student',
    arabic: 'طَالِبٌ',
    transliteration: 'ṭālibu',
    categoryId: 'school-education',
    level: 'A1',
    partOfSpeech: 'Noun (إسْم)',
    pluralForm: { arabic: 'طُلَّابٌ', transliteration: 'ṭullāb' },
    audio: { source: 'browser' },
    examples: [
      {
        arabic: 'الطَّالِبُ يَقْرَأُ الْكِتَابَ.',
        english: 'The student reads the book.',
        transliteration: 'aṭ-ṭālibu yaqraʾu al-kitāb.',
      },
    ],
    relatedWords: ['teacher', 'book'],
    tags: ['education', 'people'],
  },
  {
    id: 'book',
    english: 'Book',
    arabic: 'كِتَاب',
    transliteration: 'kitāb',
    categoryId: 'school-education',
    level: 'A1',
    partOfSpeech: 'Noun (إسْم)',
    pluralForm: { arabic: 'كُتُب', transliteration: 'kutub' },
    audio: { source: 'browser' },
    examples: [
      {
        arabic: 'هَذَا كِتَابٌ جَدِيدٌ.',
        english: 'This is a new book.',
        transliteration: 'hādhā kitābun jadīd.',
      },
    ],
    relatedWords: ['student'],
    tags: ['education', 'object'],
  },
  {
    id: 'apple',
    english: 'Apple',
    arabic: 'تُفَّاح',
    transliteration: 'tuffāḥ',
    categoryId: 'food-dining',
    level: 'A1',
    partOfSpeech: 'Noun (إسْم)',
    audio: { source: 'browser' },
    examples: [
      {
        arabic: 'أُحِبُّ أَنْ آكُلَ التُّفَّاحَ.',
        english: 'I like to eat apples.',
        transliteration: 'uḥibbu an ākula at-tuffāḥ.',
      },
    ],
    relatedWords: ['water'],
    tags: ['food', 'fruit'],
  },
  {
    id: 'water',
    english: 'Water',
    arabic: 'مَاء',
    transliteration: 'māʾ',
    categoryId: 'food-dining',
    level: 'A1',
    partOfSpeech: 'Noun (إسْم)',
    audio: { source: 'browser' },
    examples: [
      {
        arabic: 'أَشْرَبُ الْمَاءَ كُلَّ يَوْمٍ.',
        english: 'I drink water every day.',
        transliteration: 'ashrabu al-māʾa kulla yawm.',
      },
    ],
    tags: ['food', 'drink'],
  },
  {
    id: 'house',
    english: 'House',
    arabic: 'بَيْت',
    transliteration: 'bayt',
    categoryId: 'daily-life',
    level: 'A1',
    partOfSpeech: 'Noun (إسْم)',
    pluralForm: { arabic: 'بُيُوت', transliteration: 'buyūt' },
    audio: { source: 'browser' },
    examples: [
      {
        arabic: 'بَيْتِي قَرِيبٌ مِنَ الْمَدْرَسَةِ.',
        english: 'My house is near the school.',
        transliteration: 'baytī qarībun mina al-madrasa.',
      },
    ],
    tags: ['home', 'place'],
  },
  {
    id: 'mother',
    english: 'Mother',
    arabic: 'أُمّ',
    transliteration: 'umm',
    categoryId: 'family-people',
    level: 'A1',
    partOfSpeech: 'Noun (إسْم)',
    audio: { source: 'browser' },
    examples: [
      {
        arabic: 'أُمِّي تَطْبُخُ الطَّعَامَ.',
        english: 'My mother cooks the food.',
        transliteration: 'ummī taṭbukhu aṭ-ṭaʿām.',
      },
    ],
    tags: ['family', 'people'],
  },
  {
    id: 'tree',
    english: 'Tree',
    arabic: 'شَجَرَة',
    transliteration: 'shajara',
    categoryId: 'nature-animals',
    level: 'A2',
    partOfSpeech: 'Noun (إسْم)',
    pluralForm: { arabic: 'أَشْجَار', transliteration: 'ashjār' },
    audio: { source: 'browser' },
    examples: [
      {
        arabic: 'الشَّجَرَةُ كَبِيرَةٌ وَجَمِيلَةٌ.',
        english: 'The tree is big and beautiful.',
        transliteration: 'ash-shajaratu kabīratun wa-jamīla.',
      },
    ],
    tags: ['nature'],
  },
  {
    id: 'computer',
    english: 'Computer',
    arabic: 'حَاسُوبٌ',
    transliteration: 'ḥāsūb',
    categoryId: 'work-professions',
    level: 'A2',
    partOfSpeech: 'Noun (إسْم)',
    audio: { source: 'browser' },
    examples: [
      {
        arabic: 'أَعْمَلُ عَلَى الْحَاسُوبِ.',
        english: 'I work on the computer.',
        transliteration: 'aʿmalu ʿalā al-ḥāsūb.',
      },
    ],
    tags: ['technology', 'work'],
  },
];

export const fallbackGrammarLessons: GrammarLesson[] = [
  {
    id: 'definite-article',
    title: 'The Definite Article (al-)',
    arabicTitle: 'أَلْ التَّعْرِيف',
    topic: 'nouns',
    level: 'A1',
    summary: 'How ال turns an indefinite noun into a definite one, and when its لـ goes silent.',
    icon: 'grammar',
    estimatedMinutes: 6,
    sections: [
      {
        id: 'overview',
        heading: 'What it does',
        body: 'Arabic has no separate word for "the". Instead, the prefix ال attaches directly to the noun.',
        examples: [
          { arabic: 'كِتَاب', english: 'a book', transliteration: 'kitāb' },
          { arabic: 'الْكِتَاب', english: 'the book', transliteration: 'al-kitāb' },
        ],
      },
    ],
    relatedWordIds: ['book'],
  },
  {
    id: 'nominal-sentence',
    title: 'The Nominal Sentence',
    arabicTitle: 'الْجُمْلَة الاِسْمِيَّة',
    topic: 'sentence-structure',
    level: 'A2',
    summary: 'Arabic sentences that start with a noun need no verb for "to be" in the present.',
    icon: 'grammar',
    estimatedMinutes: 8,
    sections: [
      {
        id: 'structure',
        heading: 'Subject + predicate',
        body: 'A nominal sentence pairs a definite subject (mubtadaʾ) with an indefinite predicate (khabar).',
        examples: [
          {
            arabic: 'الْبَيْتُ كَبِيرٌ.',
            english: 'The house is big.',
            transliteration: 'al-baytu kabīr.',
          },
        ],
      },
    ],
    relatedWordIds: ['house'],
  },
];

export const fallbackPracticeModes: PracticeMode[] = [
  {
    id: 'multiple-choice',
    title: 'Multiple Choice',
    description: 'Read an Arabic word and pick the correct English meaning.',
    icon: 'quiz',
    questionCount: 10,
    accent: 'blue',
    available: true,
  },
  {
    id: 'listening',
    title: 'Listening',
    description: 'Listen to Arabic pronunciation and select the correct meaning.',
    icon: 'volume',
    questionCount: 10,
    accent: 'green',
    available: true,
  },
  {
    id: 'typing',
    title: 'Typing',
    description: 'Translate an English word by typing it in Arabic.',
    icon: 'keyboard',
    questionCount: 10,
    accent: 'purple',
    available: true,
  },
  {
    id: 'image-match',
    title: 'Image Match',
    description: 'Match the Arabic word with the picture that shows it.',
    icon: 'image',
    questionCount: 8,
    accent: 'orange',
    available: true,
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Flip through cards and review words due for repetition.',
    icon: 'flashcard',
    questionCount: 20,
    accent: 'pink',
    available: true,
  },
];
