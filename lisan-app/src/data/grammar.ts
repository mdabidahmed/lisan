/**
 * Grammar lessons for the Grammar page (spec §56).
 *
 * `GrammarLesson`, `GrammarSection` and `GrammarExample` are part of the shared
 * contract in `@/types`, so they are re-exported here for convenience rather
 * than redefined — one source of truth. Examples live inside the section they
 * illustrate, which is where the contract puts them; `lessonExamples()` gives
 * any UI that wants a flat list one without duplicating data.
 *
 * Arabic is fully vowelled and transliteration follows the DIN 31635-based
 * scheme documented at the top of `src/data/index.ts`.
 */
import type { GrammarExample, GrammarLesson } from '@/types';

export type { GrammarExample, GrammarLesson, GrammarSection, GrammarTopic } from '@/types';

export const grammarLessons = [
  {
    id: 'definite-article',
    title: 'The Definite Article',
    arabicTitle: 'أَلْ التَّعْرِيف',
    topic: 'nouns',
    level: 'A1',
    summary:
      'Arabic has no word for "a" — definiteness is marked by attaching الـ to the front of the noun.',
    icon: 'grammar',
    estimatedMinutes: 6,
    sections: [
      {
        id: 'indefinite-by-default',
        heading: 'Indefinite by default',
        body: 'A bare Arabic noun is already indefinite: كِتَاب means "a book". Indefiniteness is often marked in speech by nunation (tanwīn), the -un / -an / -in ending written as a doubled vowel sign.',
        examples: [
          {
            arabic: 'هٰذَا كِتَابٌ.',
            transliteration: 'hādhā kitābun.',
            english: 'This is a book.',
          },
        ],
      },
      {
        id: 'adding-al',
        heading: 'Adding الـ',
        body: 'To say "the", attach الـ directly to the noun with no space: الْكِتَاب. The noun then loses its nunation, so كِتَابٌ (kitābun) becomes الْكِتَابُ (al-kitābu).',
        examples: [
          {
            arabic: 'هٰذَا هُوَ الْكِتَابُ.',
            transliteration: 'hādhā huwa al-kitābu.',
            english: 'This is the book.',
          },
          {
            arabic: 'الْبَيْتُ كَبِيرٌ.',
            transliteration: 'al-baytu kabīrun.',
            english: 'The house is big.',
          },
        ],
      },
      {
        id: 'hamzat-al-wasl',
        heading: 'The hamza of الـ is elided',
        body: 'The alif of الـ carries hamzat al-waṣl, a "connecting" hamza. It is pronounced only at the start of an utterance; after a preceding word the vowel drops in speech, which is why فِي الْبَيْتِ is read as one breath group.',
      },
    ],
    relatedWordIds: ['book', 'house', 'apple'],
  },
  {
    id: 'sun-and-moon-letters',
    title: 'Sun and Moon Letters',
    arabicTitle: 'الْحُرُوف الشَّمْسِيَّة وَالْقَمَرِيَّة',
    topic: 'nahw',
    level: 'A1',
    summary:
      'The lām of الـ is sometimes silent: fourteen "sun" letters swallow it and double themselves instead.',
    icon: 'volume',
    estimatedMinutes: 5,
    sections: [
      {
        id: 'two-groups',
        heading: 'Two groups of letters',
        body: 'The fourteen sun letters are ت ث د ذ ر ز س ش ص ض ط ظ ل ن. The other fourteen are moon letters. The spelling never changes — only the pronunciation does.',
      },
      {
        id: 'in-speech',
        heading: 'What happens in speech',
        body: 'Before a sun letter the lām is not pronounced and the following consonant is doubled with a shadda: الشَّمْس is read ash-shams, not al-shams. Before a moon letter the lām is pronounced normally: الْقَمَر is al-qamar.',
        examples: [
          {
            arabic: 'الشَّمْسُ مُشْرِقَةٌ.',
            transliteration: 'ash-shamsu mushriqatun.',
            english: 'The sun is shining.',
          },
          {
            arabic: 'الْقَمَرُ جَمِيلٌ.',
            transliteration: 'al-qamaru jamīlun.',
            english: 'The moon is beautiful.',
          },
        ],
      },
      {
        id: 'in-this-app',
        heading: 'Why it matters here',
        body: 'This app transliterates what is actually said, so you will see at-tuffāḥ for التُّفَّاح but al-kitāb for الْكِتَاب. Reading the transliteration aloud therefore trains the correct assimilation.',
        examples: [
          {
            arabic: 'الطَّالِبُ فِي الْمَدْرَسَةِ.',
            transliteration: 'aṭ-ṭālibu fī al-madrasati.',
            english: 'The student is at school.',
          },
        ],
      },
    ],
    relatedWordIds: ['sun', 'moon', 'apple', 'student'],
  },
  {
    id: 'personal-pronouns',
    title: 'Personal Pronouns',
    arabicTitle: 'الضَّمَائِر الْمُنْفَصِلَة',
    topic: 'pronouns',
    level: 'A1',
    summary:
      'The standalone pronouns — أَنَا, أَنْتَ, هُوَ and the rest — and when Arabic can leave them out.',
    icon: 'profile',
    estimatedMinutes: 7,
    sections: [
      {
        id: 'the-core-set',
        heading: 'The core set',
        body: 'Singular: أَنَا (I), أَنْتَ / أَنْتِ (you m./f.), هُوَ (he), هِيَ (she). Plural: نَحْنُ (we), أَنْتُمْ / أَنْتُنَّ (you m./f.), هُمْ / هُنَّ (they m./f.). Arabic also has dual forms, أَنْتُمَا and هُمَا, used for exactly two people.',
        examples: [
          {
            arabic: 'أَنَا طَالِبٌ فِي الْجَامِعَةِ.',
            transliteration: 'anā ṭālibun fī al-jāmiʿati.',
            english: 'I am a student at the university.',
          },
        ],
      },
      {
        id: 'gender-is-marked',
        heading: 'Gender is always marked',
        body: 'Unlike English, "you" changes with the gender of the person addressed. Saying كَيْفَ حَالُكِ؟ to a man is a real mistake, not a stylistic slip.',
        examples: [
          {
            arabic: 'هِيَ مُدَرِّسَةٌ مَشْهُورَةٌ.',
            transliteration: 'hiya mudarrisatun mashhūratun.',
            english: 'She is a well-known teacher.',
          },
        ],
      },
      {
        id: 'often-optional',
        heading: 'Often optional with verbs',
        body: 'A verb already encodes its subject, so أَكْتُبُ alone means "I write". Adding أَنَا أَكْتُبُ is grammatical but emphatic — "I am the one writing".',
        examples: [
          {
            arabic: 'نَحْنُ أَصْدِقَاءُ مُنْذُ الطُّفُولَةِ.',
            transliteration: 'naḥnu aṣdiqāʾu mundhu aṭ-ṭufūlati.',
            english: 'We have been friends since childhood.',
          },
        ],
      },
    ],
    relatedWordIds: ['student', 'teacher', 'friend', 'man'],
  },
  {
    id: 'attached-pronouns',
    title: 'Attached Pronouns',
    arabicTitle: 'الضَّمَائِر الْمُتَّصِلَة',
    topic: 'pronouns',
    level: 'A2',
    summary:
      'Possession and objects are expressed with suffixes: كِتَابِي "my book", كِتَابُهُ "his book".',
    icon: 'profile',
    estimatedMinutes: 8,
    sections: [
      {
        id: 'one-set-three-jobs',
        heading: 'One set, three jobs',
        body: 'The suffixes ـِي، ـكَ، ـكِ، ـهُ، ـهَا، ـنَا، ـكُمْ، ـهُمْ attach to nouns to show possession, to verbs to mark the object, and to prepositions to complete them.',
      },
      {
        id: 'on-nouns',
        heading: 'On nouns',
        body: 'بَيْت becomes بَيْتِي (my house), بَيْتُكَ (your house), بَيْتُهَا (her house). A noun carrying a pronoun suffix is definite, so it never takes الـ and never takes nunation.',
        examples: [
          {
            arabic: 'هٰذَا كِتَابِي وَذٰلِكَ كِتَابُهَا.',
            transliteration: 'hādhā kitābī wa-dhālika kitābuhā.',
            english: 'This is my book and that is her book.',
          },
        ],
      },
      {
        id: 'on-verbs-and-prepositions',
        heading: 'On verbs and prepositions',
        body: 'The same endings mark the object: سَاعَدَنِي (he helped me), أَعْرِفُهُ (I know him). With prepositions they behave identically: مَعَهُ (with him), عِنْدِي (I have, literally "at me").',
        examples: [
          {
            arabic: 'صَدِيقِي سَاعَدَنِي فِي الْوَاجِبِ.',
            transliteration: 'ṣadīqī sāʿadanī fī al-wājibi.',
            english: 'My friend helped me with the homework.',
          },
          {
            arabic: 'عِنْدِي سُؤَالٌ لَكَ.',
            transliteration: 'ʿindī suʾālun laka.',
            english: 'I have a question for you.',
          },
        ],
      },
    ],
    relatedWordIds: ['book', 'house', 'friend', 'to-help'],
  },
  {
    id: 'nominal-sentence',
    title: 'The Nominal Sentence',
    arabicTitle: 'الْجُمْلَة الاِسْمِيَّة',
    topic: 'sentence-structure',
    level: 'A1',
    summary:
      'Arabic has no present-tense "to be" — a definite subject plus an indefinite predicate is a full sentence.',
    icon: 'grammar',
    estimatedMinutes: 7,
    sections: [
      {
        id: 'subject-and-predicate',
        heading: 'Subject and predicate',
        body: 'A nominal sentence pairs a mubtadaʾ (subject) with a khabar (predicate). الْبَيْتُ كَبِيرٌ literally reads "the-house big" and means "the house is big". Both parts take the nominative case.',
        examples: [
          {
            arabic: 'الْبَيْتُ كَبِيرٌ.',
            transliteration: 'al-baytu kabīrun.',
            english: 'The house is big.',
          },
        ],
      },
      {
        id: 'definiteness-clue',
        heading: 'The definiteness clue',
        body: 'The subject is normally definite and the predicate indefinite. That contrast is what tells you it is a sentence rather than a phrase: الْبَيْتُ الْكَبِيرُ (both definite) means "the big house", a noun phrase with no verb of being implied.',
        examples: [
          {
            arabic: 'الطَّعَامُ لَذِيذٌ جِدًّا.',
            transliteration: 'aṭ-ṭaʿāmu ladhīdhun jiddan.',
            english: 'The food is very delicious.',
          },
        ],
      },
      {
        id: 'past-with-kana',
        heading: 'Putting it in the past',
        body: 'Add كَانَ to move the sentence into the past. كَانَ الْبَيْتُ كَبِيرًا — "the house was big" — and note that كَانَ puts the predicate into the accusative.',
        examples: [
          {
            arabic: 'كَانَتِ الرِّحْلَةُ طَوِيلَةً.',
            transliteration: 'kānati ar-riḥlatu ṭawīlatan.',
            english: 'The trip was long.',
          },
        ],
      },
    ],
    relatedWordIds: ['house', 'big', 'food', 'delicious'],
  },
  {
    id: 'verbal-sentence',
    title: 'The Verbal Sentence',
    arabicTitle: 'الْجُمْلَة الْفِعْلِيَّة',
    topic: 'sentence-structure',
    level: 'A2',
    summary:
      'The classical word order is verb – subject – object, and the verb stays singular before a plural subject.',
    icon: 'practice',
    estimatedMinutes: 8,
    sections: [
      {
        id: 'verb-first',
        heading: 'Verb first',
        body: 'كَتَبَ الطَّالِبُ الدَّرْسَ — "wrote the-student the-lesson". The verb is nominative-neutral, the subject (fāʿil) takes the nominative, and the object (mafʿūl bihi) takes the accusative.',
        examples: [
          {
            arabic: 'كَتَبَ الطَّالِبُ الدَّرْسَ.',
            transliteration: 'kataba aṭ-ṭālibu ad-darsa.',
            english: 'The student wrote the lesson.',
          },
        ],
      },
      {
        id: 'asymmetric-agreement',
        heading: 'Agreement is asymmetric',
        body: 'When the verb comes first it stays singular even if the subject is plural: ذَهَبَ الطُّلَّابُ, not ذَهَبُوا الطُّلَّابُ. It does still agree in gender: ذَهَبَتِ الطَّالِبَاتُ.',
        examples: [
          {
            arabic: 'ذَهَبَ الْأَوْلَادُ إِلَى الْمَدْرَسَةِ.',
            transliteration: 'dhahaba al-awlādu ilā al-madrasati.',
            english: 'The boys went to the school.',
          },
          {
            arabic: 'تَقْرَأُ الْبِنْتُ كِتَابًا جَدِيدًا.',
            transliteration: 'taqraʾu al-bintu kitāban jadīdan.',
            english: 'The girl is reading a new book.',
          },
        ],
      },
      {
        id: 'fronting-the-subject',
        heading: 'Fronting the subject',
        body: 'Modern written Arabic often puts the subject first for emphasis or clarity: الطَّالِبُ كَتَبَ الدَّرْسَ. In that order the verb must agree in number as well — الطُّلَّابُ ذَهَبُوا.',
      },
    ],
    relatedWordIds: ['to-write', 'student', 'lesson', 'to-go'],
  },
  {
    id: 'adjective-agreement',
    title: 'Adjective Agreement',
    arabicTitle: 'الصِّفَة وَالْمَوْصُوف',
    topic: 'adjectives',
    level: 'A2',
    summary:
      'Adjectives follow their noun and copy it four ways: gender, number, case and definiteness.',
    icon: 'theme',
    estimatedMinutes: 8,
    sections: [
      {
        id: 'adjective-comes-second',
        heading: 'The adjective comes second',
        body: 'Unlike English, the adjective follows the noun it describes: بَيْتٌ كَبِيرٌ, "a big house". Reversing the order changes the meaning entirely.',
        examples: [
          {
            arabic: 'بَيْتٌ كَبِيرٌ',
            transliteration: 'baytun kabīrun',
            english: 'a big house',
          },
        ],
      },
      {
        id: 'four-way-agreement',
        heading: 'Four-way agreement',
        body: 'The adjective matches the noun in gender (add ة for feminine), number, case ending, and definiteness. So "the big house" is الْبَيْتُ الْكَبِيرُ — الـ appears on both words.',
        examples: [
          {
            arabic: 'الْمَدِينَةُ الْقَدِيمَةُ جَمِيلَةٌ.',
            transliteration: 'al-madīnatu al-qadīmatu jamīlatun.',
            english: 'The old city is beautiful.',
          },
        ],
      },
      {
        id: 'non-human-plurals',
        heading: 'Non-human plurals are feminine singular',
        body: 'Plurals of things and animals are treated as feminine singular: سَيَّارَاتٌ جَدِيدَةٌ, "new cars", not جُدُدٌ. This rule surprises most learners and is worth memorising early.',
        examples: [
          {
            arabic: 'اِشْتَرَيْنَا سَيَّارَاتٍ جَدِيدَةً.',
            transliteration: 'ishtaraynā sayyārātin jadīdatan.',
            english: 'We bought new cars.',
          },
        ],
      },
    ],
    relatedWordIds: ['big', 'old', 'beautiful', 'car'],
  },
  {
    id: 'idafa',
    title: 'The Iḍāfa Construction',
    arabicTitle: 'الْإِضَافَة',
    topic: 'nouns',
    level: 'A2',
    summary:
      'Two nouns placed side by side express possession: بَابُ الْبَيْتِ, "the door of the house".',
    icon: 'vocabulary',
    estimatedMinutes: 9,
    sections: [
      {
        id: 'how-it-is-built',
        heading: 'How it is built',
        body: 'Put the possessed noun first and the possessor second. The second noun takes the genitive case: مِفْتَاحُ الْبَابِ, "the key of the door".',
        examples: [
          {
            arabic: 'بَابُ الْبَيْتِ مَفْتُوحٌ.',
            transliteration: 'bābu al-bayti maftūḥun.',
            english: 'The door of the house is open.',
          },
          {
            arabic: 'كِتَابُ الطَّالِبِ عَلَى الطَّاوِلَةِ.',
            transliteration: 'kitābu aṭ-ṭālibi ʿalā aṭ-ṭāwilati.',
            english: "The student's book is on the table.",
          },
        ],
      },
      {
        id: 'first-noun-rules',
        heading: 'Rules for the first noun',
        body: 'The first term never takes الـ and never takes nunation, even when the whole phrase is definite. Definiteness comes from the last noun in the chain, so بَابُ الْبَيْتِ is "the door of the house" while بَابُ بَيْتٍ is "a door of a house".',
        examples: [
          {
            arabic: 'مِفْتَاحُ الْغُرْفَةِ مَعَ الْمُدِيرِ.',
            transliteration: 'miftāḥu al-ghurfati maʿa al-mudīri.',
            english: 'The key to the room is with the manager.',
          },
        ],
      },
      {
        id: 'where-adjectives-go',
        heading: 'Where adjectives go',
        body: 'An adjective describing any part of the chain waits until the very end: بَابُ الْبَيْتِ الْكَبِيرُ. Only the case and gender endings tell you whether "big" describes the door or the house.',
      },
    ],
    relatedWordIds: ['door', 'house', 'book', 'key'],
  },
  {
    id: 'broken-plurals',
    title: 'Broken Plurals',
    arabicTitle: 'جَمْع التَّكْسِير',
    topic: 'sarf',
    level: 'B1',
    summary:
      'Most Arabic nouns form the plural by reshaping the word internally rather than adding a suffix.',
    icon: 'vocabulary',
    estimatedMinutes: 9,
    sections: [
      {
        id: 'sound-plurals',
        heading: 'Sound plurals first',
        body: 'Some plurals are regular: مُهَنْدِس becomes مُهَنْدِسُونَ for men and مُدَرِّسَة becomes مُدَرِّسَات for women. These are the "sound" masculine and feminine plurals.',
        examples: [
          {
            arabic: 'الْمُهَنْدِسُونَ يَعْمَلُونَ فِي الْمَشْرُوعِ.',
            transliteration: 'al-muhandisūna yaʿmalūna fī al-mashrūʿi.',
            english: 'The engineers are working on the project.',
          },
        ],
      },
      {
        id: 'breaking-the-pattern',
        heading: 'Breaking the pattern',
        body: 'The majority of nouns instead pour the root consonants into a different template: كِتَاب → كُتُب, بَيْت → بُيُوت, طَالِب → طُلَّاب, رَجُل → رِجَال. The root letters stay in order; only the vowels and syllable shape change.',
        examples: [
          {
            arabic: 'عِنْدِي ثَلَاثَةُ كُتُبٍ.',
            transliteration: 'ʿindī thalāthatu kutubin.',
            english: 'I have three books.',
          },
          {
            arabic: 'الطُّلَّابُ فِي الصَّفِّ.',
            transliteration: 'aṭ-ṭullābu fī aṣ-ṣaffi.',
            english: 'The students are in the classroom.',
          },
        ],
      },
      {
        id: 'learn-them-as-pairs',
        heading: 'Learn them as pairs',
        body: 'There is no reliable rule for predicting which template a noun takes, so learn the plural together with the singular from the start. Every noun in this app shows its plural on the word detail page.',
      },
    ],
    relatedWordIds: ['book', 'engineer', 'student', 'man'],
  },
  {
    id: 'the-three-cases',
    title: 'The Three Cases',
    arabicTitle: 'الْإِعْرَاب: الرَّفْع وَالنَّصْب وَالْجَرّ',
    topic: 'cases',
    level: 'B1',
    summary:
      'A short vowel on the end of a noun tells you its job in the sentence: subject, object, or after a preposition.',
    icon: 'info',
    estimatedMinutes: 10,
    sections: [
      {
        id: 'nominative',
        heading: 'Nominative — الرَّفْع',
        body: 'Marked by ḍamma (-u, or -un when indefinite). Used for the subject of a verb and for both halves of a nominal sentence.',
        examples: [
          {
            arabic: 'الطَّالِبُ يَقْرَأُ الْكِتَابَ فِي الْمَكْتَبَةِ.',
            transliteration: 'aṭ-ṭālibu yaqraʾu al-kitāba fī al-maktabati.',
            english: 'The student reads the book in the library.',
          },
        ],
      },
      {
        id: 'accusative',
        heading: 'Accusative — النَّصْب',
        body: 'Marked by fatḥa (-a, or -an when indefinite). Used for the direct object and for adverbial expressions such as جِدًّا and صَبَاحًا.',
        examples: [
          {
            arabic: 'رَأَيْتُ الْمُدَرِّسَ أَمَامَ الْمَدْرَسَةِ.',
            transliteration: 'raʾaytu al-mudarrisa amāma al-madrasati.',
            english: 'I saw the teacher in front of the school.',
          },
        ],
      },
      {
        id: 'genitive',
        heading: 'Genitive — الْجَرّ',
        body: 'Marked by kasra (-i, or -in when indefinite). Used after any preposition and for the second noun of an iḍāfa.',
        examples: [
          {
            arabic: 'ذَهَبْتُ إِلَى السُّوقِ صَبَاحًا.',
            transliteration: 'dhahabtu ilā as-sūqi ṣabāḥan.',
            english: 'I went to the market in the morning.',
          },
        ],
      },
      {
        id: 'when-you-can-ignore-it',
        heading: 'When you can ignore it',
        body: 'Case endings are written in vowelled texts and pronounced in formal speech, but they are dropped at the end of an utterance and in everyday conversation. Learn to recognise them before worrying about producing them.',
      },
    ],
    relatedWordIds: ['student', 'book', 'school', 'market'],
  },
  {
    id: 'past-tense',
    title: 'The Past Tense',
    arabicTitle: 'الْفِعْل الْمَاضِي',
    topic: 'verbs',
    level: 'A1',
    summary:
      'The dictionary form of every Arabic verb is "he did" — endings are then added for the other persons.',
    icon: 'replay',
    estimatedMinutes: 7,
    sections: [
      {
        id: 'the-base-form',
        heading: 'The base form',
        body: 'كَتَبَ means "he wrote" and is the form you will find in any dictionary. Its three consonants ك-ت-ب are the root that every related word is built from.',
      },
      {
        id: 'suffixes-for-person',
        heading: 'Suffixes for person',
        body: 'Add ـتُ for "I", ـتَ / ـتِ for "you" (m./f.), ـنَا for "we", ـَتْ for "she", and ـُوا for "they": كَتَبْتُ، كَتَبْتَ، كَتَبْنَا، كَتَبَتْ، كَتَبُوا.',
        examples: [
          {
            arabic: 'كَتَبْتُ رِسَالَةً أَمْسِ.',
            transliteration: 'katabtu risālatan amsi.',
            english: 'I wrote a letter yesterday.',
          },
          {
            arabic: 'ذَهَبَتْ إِلَى الْعَمَلِ مُبَكِّرًا.',
            transliteration: 'dhahabat ilā al-ʿamali mubakkiran.',
            english: 'She went to work early.',
          },
          {
            arabic: 'قَرَأُوا الْكِتَابَ كُلَّهُ.',
            transliteration: 'qaraʾū al-kitāba kullahu.',
            english: 'They read the whole book.',
          },
        ],
      },
      {
        id: 'negating-the-past',
        heading: 'Negation',
        body: 'Negate the past with مَا plus the past verb (مَا كَتَبَ) or, more formally, with لَمْ plus the jussive of the present (لَمْ يَكْتُبْ). Both mean "he did not write".',
      },
    ],
    relatedWordIds: ['to-write', 'to-read', 'to-go', 'yesterday'],
  },
  {
    id: 'present-tense',
    title: 'The Present Tense',
    arabicTitle: 'الْفِعْل الْمُضَارِع',
    topic: 'verbs',
    level: 'A2',
    summary: 'The present is built with prefixes — أ، تَ، يَ، نَ — rather than suffixes.',
    icon: 'play',
    estimatedMinutes: 8,
    sections: [
      {
        id: 'prefixes-carry-the-person',
        heading: 'Prefixes carry the person',
        body: 'From كَتَبَ you get أَكْتُبُ (I write), تَكْتُبُ (you write / she writes), يَكْتُبُ (he writes) and نَكْتُبُ (we write). The prefix identifies the subject; some persons add a suffix as well.',
        examples: [
          {
            arabic: 'أَكْتُبُ الْوَاجِبَ كُلَّ مَسَاءٍ.',
            transliteration: 'aktubu al-wājiba kulla masāʾin.',
            english: 'I write the homework every evening.',
          },
        ],
      },
      {
        id: 'one-tense-two-meanings',
        heading: 'One tense, two meanings',
        body: 'الْمُضَارِع covers both the English simple present and the present continuous. يَقْرَأُ can mean "he reads" or "he is reading" — context decides.',
        examples: [
          {
            arabic: 'هُوَ يَتَعَلَّمُ الْعَرَبِيَّةَ فِي الْجَامِعَةِ.',
            transliteration: 'huwa yataʿallamu al-ʿarabiyyata fī al-jāmiʿati.',
            english: 'He is learning Arabic at the university.',
          },
        ],
      },
      {
        id: 'future-and-negation',
        heading: 'Future and negation',
        body: 'Prefix سَـ or add سَوْفَ for the future: سَيَكْتُبُ, "he will write". Negate the present with لَا: لَا أَعْرِفُ, "I do not know".',
        examples: [
          {
            arabic: 'سَنُسَافِرُ غَدًا إِنْ شَاءَ اللَّهُ.',
            transliteration: 'sanusāfiru ghadan in shāʾa allāhu.',
            english: 'We will travel tomorrow, God willing.',
          },
        ],
      },
    ],
    relatedWordIds: ['to-write', 'to-learn', 'to-travel', 'to-know'],
  },
  {
    id: 'verb-forms',
    title: 'The Verb Forms',
    arabicTitle: 'أَوْزَان الْفِعْل',
    topic: 'verb-forms',
    level: 'B2',
    summary:
      'One root can be poured into ten templates, each twisting the meaning in a predictable direction.',
    icon: 'grammar',
    estimatedMinutes: 12,
    sections: [
      {
        id: 'root-plus-pattern',
        heading: 'Root plus pattern',
        body: 'Arabic builds vocabulary by inserting a three-letter root into a pattern. From ع-ل-م come عَلِمَ (to know), عَلَّمَ (to teach), تَعَلَّمَ (to learn), عِلْم (knowledge) and مُعَلِّم (teacher).',
        examples: [
          {
            arabic: 'عَلَّمَ الْمُدَرِّسُ التَّلَامِيذَ الْقَاعِدَةَ.',
            transliteration: 'ʿallama al-mudarrisu at-talāmīdha al-qāʿidata.',
            english: 'The teacher taught the pupils the rule.',
          },
        ],
      },
      {
        id: 'what-the-forms-do',
        heading: 'What the common forms do',
        body: 'Form II (فَعَّلَ) usually makes a verb causative or intensive. Form III (فَاعَلَ) adds another party — سَاعَدَ, "to help". Form V (تَفَعَّلَ) makes Form II reflexive. Form VIII (اِفْتَعَلَ) is often reflexive or middle, as in اِسْتَمَعَ, "to listen".',
        examples: [
          {
            arabic: 'تَعَلَّمَ التِّلْمِيذُ الْقَاعِدَةَ بِسُرْعَةٍ.',
            transliteration: 'taʿallama at-tilmīdhu al-qāʿidata bi-surʿatin.',
            english: 'The pupil learned the rule quickly.',
          },
          {
            arabic: 'اِسْتَمَعْتُ إِلَى الدَّرْسِ مَرَّتَيْنِ.',
            transliteration: 'istamaʿtu ilā ad-darsi marratayni.',
            english: 'I listened to the lesson twice.',
          },
        ],
      },
      {
        id: 'why-it-is-worth-it',
        heading: 'Why it is worth the effort',
        body: 'Once the patterns are familiar you can guess the meaning of unfamiliar words and look up any verb by its root. Every verb in this app is tagged with its form.',
      },
    ],
    relatedWordIds: ['to-teach', 'to-learn', 'to-listen', 'to-help'],
  },
  {
    id: 'prepositions',
    title: 'Prepositions',
    arabicTitle: 'حُرُوف الْجَرّ',
    topic: 'particles',
    level: 'A2',
    summary:
      'A small set of particles — فِي، مِنْ، إِلَى، عَلَى، بِ، لِ، مَعَ — that always put the next noun in the genitive.',
    icon: 'places',
    estimatedMinutes: 7,
    sections: [
      {
        id: 'the-everyday-set',
        heading: 'The everyday set',
        body: 'فِي (in), مِنْ (from), إِلَى (to), عَلَى (on), بِ (with, by), لِ (for, to), عَنْ (about), مَعَ (with). بِ and لِ are written joined to the following word.',
        examples: [
          {
            arabic: 'الْكِتَابُ عَلَى الطَّاوِلَةِ.',
            transliteration: 'al-kitābu ʿalā aṭ-ṭāwilati.',
            english: 'The book is on the table.',
          },
        ],
      },
      {
        id: 'they-govern-the-genitive',
        heading: 'They govern the genitive',
        body: 'Whatever follows a preposition takes a kasra: فِي الْبَيْتِ، مِنَ السُّوقِ، إِلَى الْمَدْرَسَةِ. This is the easiest place to start hearing case endings.',
        examples: [
          {
            arabic: 'خَرَجْتُ مِنَ الْبَيْتِ إِلَى السُّوقِ.',
            transliteration: 'kharajtu mina al-bayti ilā as-sūqi.',
            english: 'I went out from the house to the market.',
          },
        ],
      },
      {
        id: 'verbs-choose-their-own',
        heading: 'Verbs choose their own',
        body: 'Arabic verbs pair with specific prepositions and the pairing rarely matches English. بَحَثَ عَنْ is "to search for", اِسْتَمَعَ إِلَى is "to listen to", and حَصَلَ عَلَى is "to obtain". Learn the verb and its preposition as one unit.',
        examples: [
          {
            arabic: 'أَبْحَثُ عَنْ مِفْتَاحِ السَّيَّارَةِ.',
            transliteration: 'abḥathu ʿan miftāḥi as-sayyārati.',
            english: 'I am looking for the car key.',
          },
        ],
      },
    ],
    relatedWordIds: ['house', 'market', 'table', 'key'],
  },
] satisfies GrammarLesson[];

/** Every example in a lesson, flattened in section order. */
export function lessonExamples(lesson: GrammarLesson): GrammarExample[] {
  return lesson.sections.flatMap((section) => section.examples ?? []);
}

export default grammarLessons;
