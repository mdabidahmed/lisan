/**
 * Lisan visual asset registry.
 *
 * Every binary asset is imported through Vite, so the emitted URLs are
 * content-hashed and safe to cache immutably. The only hard-coded paths are the
 * favicon / PWA / share-card files under `brandUrls`, which must keep stable
 * URLs because they are referenced from `index.html` and the web app manifest.
 *
 * Theming the SVGs
 * ----------------
 * The hand-authored SVGs in `illustrations` and `decorative` paint through CSS
 * custom properties with on-brand fallbacks, so they render correctly as plain
 * `<img>` tags and recolour when inlined. Override these on an ancestor to
 * retheme them (for example for dark mode):
 *
 *   --lisan-pri       #1769FF   primary strokes and accents
 *   --lisan-soft      #BBD5FF   mid tint: secondary shapes, shadows
 *   --lisan-bg        #EAF2FF   pale surfaces ("paper")
 *   --lisan-surface   #FFFFFF   knockouts and highlights
 *   --lisan-ink       #172033   text-weight marks
 *   --lisan-success   #12B76A   --lisan-warning #F79009   --lisan-error #F04438
 *   --lisan-info      #2E90FA   --lisan-warning-deep #DC6803
 *   --lisan-leaf / --lisan-leaf-deep / --lisan-leaf-light   leaf flourish greens
 *   --lisan-blob-from / --lisan-blob-to                     quote blob gradient
 *   --lisan-scrim / --lisan-scrim-ink                       hero overlay
 *   --lisan-pattern                                         geometric pattern tile
 *   --lisan-wordmark / --lisan-wordmark-sub                 lockup type colours
 *
 * This file is generated artwork metadata, but it is plain source: edit freely.
 */

// Brand marks — vector, imported through Vite so they are content-hashed.
import logoMarkSrc from './brand/logo-mark.svg';
import logoLockupSrc from './brand/logo-lockup.svg';
import logoMonoSrc from './brand/logo-mono.svg';

// Home hero — responsive raster set.
import heroAvif1600 from './hero/hero-1600.avif';
import heroAvif960 from './hero/hero-960.avif';
import heroWebp1600 from './hero/hero-1600.webp';
import heroWebp960 from './hero/hero-960.webp';
import heroJpg1600 from './hero/hero-1600.jpg';

// Category art — 256w + 128w, AVIF with WebP fallback.
import catBasicsAvif from './categories/basics.avif';
import catBasicsWebp from './categories/basics.webp';
import catBasicsAvif128 from './categories/basics-128.avif';
import catBasicsWebp128 from './categories/basics-128.webp';
import catNumbersAvif from './categories/numbers.avif';
import catNumbersWebp from './categories/numbers.webp';
import catNumbersAvif128 from './categories/numbers-128.avif';
import catNumbersWebp128 from './categories/numbers-128.webp';
import catTimeAvif from './categories/time.avif';
import catTimeWebp from './categories/time.webp';
import catTimeAvif128 from './categories/time-128.avif';
import catTimeWebp128 from './categories/time-128.webp';
import catFamilyPeopleAvif from './categories/family-people.avif';
import catFamilyPeopleWebp from './categories/family-people.webp';
import catFamilyPeopleAvif128 from './categories/family-people-128.avif';
import catFamilyPeopleWebp128 from './categories/family-people-128.webp';
import catFoodDiningAvif from './categories/food-dining.avif';
import catFoodDiningWebp from './categories/food-dining.webp';
import catFoodDiningAvif128 from './categories/food-dining-128.avif';
import catFoodDiningWebp128 from './categories/food-dining-128.webp';
import catHomeRoomsAvif from './categories/home-rooms.avif';
import catHomeRoomsWebp from './categories/home-rooms.webp';
import catHomeRoomsAvif128 from './categories/home-rooms-128.avif';
import catHomeRoomsWebp128 from './categories/home-rooms-128.webp';
import catShoppingMoneyAvif from './categories/shopping-money.avif';
import catShoppingMoneyWebp from './categories/shopping-money.webp';
import catShoppingMoneyAvif128 from './categories/shopping-money-128.avif';
import catShoppingMoneyWebp128 from './categories/shopping-money-128.webp';
import catTransportTravelAvif from './categories/transport-travel.avif';
import catTransportTravelWebp from './categories/transport-travel.webp';
import catTransportTravelAvif128 from './categories/transport-travel-128.avif';
import catTransportTravelWebp128 from './categories/transport-travel-128.webp';
import catDailyLifeAvif from './categories/daily-life.avif';
import catDailyLifeWebp from './categories/daily-life.webp';
import catDailyLifeAvif128 from './categories/daily-life-128.avif';
import catDailyLifeWebp128 from './categories/daily-life-128.webp';
import catVerbsAvif from './categories/verbs.avif';
import catVerbsWebp from './categories/verbs.webp';
import catVerbsAvif128 from './categories/verbs-128.avif';
import catVerbsWebp128 from './categories/verbs-128.webp';
import catAdjectivesAvif from './categories/adjectives.avif';
import catAdjectivesWebp from './categories/adjectives.webp';
import catAdjectivesAvif128 from './categories/adjectives-128.avif';
import catAdjectivesWebp128 from './categories/adjectives-128.webp';
import catSchoolEducationAvif from './categories/school-education.avif';
import catSchoolEducationWebp from './categories/school-education.webp';
import catSchoolEducationAvif128 from './categories/school-education-128.avif';
import catSchoolEducationWebp128 from './categories/school-education-128.webp';
import catWorkProfessionsAvif from './categories/work-professions.avif';
import catWorkProfessionsWebp from './categories/work-professions.webp';
import catWorkProfessionsAvif128 from './categories/work-professions-128.avif';
import catWorkProfessionsWebp128 from './categories/work-professions-128.webp';
import catNatureAnimalsAvif from './categories/nature-animals.avif';
import catNatureAnimalsWebp from './categories/nature-animals.webp';
import catNatureAnimalsAvif128 from './categories/nature-animals-128.avif';
import catNatureAnimalsWebp128 from './categories/nature-animals-128.webp';
import catHealthBodyAvif from './categories/health-body.avif';
import catHealthBodyWebp from './categories/health-body.webp';
import catHealthBodyAvif128 from './categories/health-body-128.avif';
import catHealthBodyWebp128 from './categories/health-body-128.webp';
import catTechnologyMediaAvif from './categories/technology-media.avif';
import catTechnologyMediaWebp from './categories/technology-media.webp';
import catTechnologyMediaAvif128 from './categories/technology-media-128.avif';
import catTechnologyMediaWebp128 from './categories/technology-media-128.webp';
import catAbstractAcademicAvif from './categories/abstract-academic.avif';
import catAbstractAcademicWebp from './categories/abstract-academic.webp';
import catAbstractAcademicAvif128 from './categories/abstract-academic-128.avif';
import catAbstractAcademicWebp128 from './categories/abstract-academic-128.webp';
import catExpressionsIdiomsAvif from './categories/expressions-idioms.avif';
import catExpressionsIdiomsWebp from './categories/expressions-idioms.webp';
import catExpressionsIdiomsAvif128 from './categories/expressions-idioms-128.avif';
import catExpressionsIdiomsWebp128 from './categories/expressions-idioms-128.webp';
import catVegetablesAvif from './categories/vegetables.avif';
import catVegetablesWebp from './categories/vegetables.webp';
import catVegetablesAvif128 from './categories/vegetables-128.avif';
import catVegetablesWebp128 from './categories/vegetables-128.webp';
import catFruitAvif from './categories/fruit.avif';
import catFruitWebp from './categories/fruit.webp';
import catFruitAvif128 from './categories/fruit-128.avif';
import catFruitWebp128 from './categories/fruit-128.webp';

// Word art — 320w + 160w, AVIF with WebP fallback.
import wordEngineerAvif from './words/engineer.avif';
import wordEngineerWebp from './words/engineer.webp';
import wordEngineerAvif160 from './words/engineer-160.avif';
import wordEngineerWebp160 from './words/engineer-160.webp';
import wordTeacherAvif from './words/teacher.avif';
import wordTeacherWebp from './words/teacher.webp';
import wordTeacherAvif160 from './words/teacher-160.avif';
import wordTeacherWebp160 from './words/teacher-160.webp';
import wordDoctorAvif from './words/doctor.avif';
import wordDoctorWebp from './words/doctor.webp';
import wordDoctorAvif160 from './words/doctor-160.avif';
import wordDoctorWebp160 from './words/doctor-160.webp';
import wordStudentAvif from './words/student.avif';
import wordStudentWebp from './words/student.webp';
import wordStudentAvif160 from './words/student-160.avif';
import wordStudentWebp160 from './words/student-160.webp';
import wordComputerAvif from './words/computer.avif';
import wordComputerWebp from './words/computer.webp';
import wordComputerAvif160 from './words/computer-160.avif';
import wordComputerWebp160 from './words/computer-160.webp';
import wordNurseAvif from './words/nurse.avif';
import wordNurseWebp from './words/nurse.webp';
import wordNurseAvif160 from './words/nurse-160.avif';
import wordNurseWebp160 from './words/nurse-160.webp';
import wordAppleAvif from './words/apple.avif';
import wordAppleWebp from './words/apple.webp';
import wordAppleAvif160 from './words/apple-160.avif';
import wordAppleWebp160 from './words/apple-160.webp';
import wordMotherAvif from './words/mother.avif';
import wordMotherWebp from './words/mother.webp';
import wordMotherAvif160 from './words/mother-160.avif';
import wordMotherWebp160 from './words/mother-160.webp';
import wordFatherAvif from './words/father.avif';
import wordFatherWebp from './words/father.webp';
import wordFatherAvif160 from './words/father-160.avif';
import wordFatherWebp160 from './words/father-160.webp';
import wordBrotherAvif from './words/brother.avif';
import wordBrotherWebp from './words/brother.webp';
import wordBrotherAvif160 from './words/brother-160.avif';
import wordBrotherWebp160 from './words/brother-160.webp';
import wordSisterAvif from './words/sister.avif';
import wordSisterWebp from './words/sister.webp';
import wordSisterAvif160 from './words/sister-160.avif';
import wordSisterWebp160 from './words/sister-160.webp';
import wordHouseAvif from './words/house.avif';
import wordHouseWebp from './words/house.webp';
import wordHouseAvif160 from './words/house-160.avif';
import wordHouseWebp160 from './words/house-160.webp';
import wordDoorAvif from './words/door.avif';
import wordDoorWebp from './words/door.webp';
import wordDoorAvif160 from './words/door-160.avif';
import wordDoorWebp160 from './words/door-160.webp';
import wordChairAvif from './words/chair.avif';
import wordChairWebp from './words/chair.webp';
import wordChairAvif160 from './words/chair-160.avif';
import wordChairWebp160 from './words/chair-160.webp';
import wordBookAvif from './words/book.avif';
import wordBookWebp from './words/book.webp';
import wordBookAvif160 from './words/book-160.avif';
import wordBookWebp160 from './words/book-160.webp';
import wordWaterAvif from './words/water.avif';
import wordWaterWebp from './words/water.webp';
import wordWaterAvif160 from './words/water-160.avif';
import wordWaterWebp160 from './words/water-160.webp';
import wordBreadAvif from './words/bread.avif';
import wordBreadWebp from './words/bread.webp';
import wordBreadAvif160 from './words/bread-160.avif';
import wordBreadWebp160 from './words/bread-160.webp';
import wordMilkAvif from './words/milk.avif';
import wordMilkWebp from './words/milk.webp';
import wordMilkAvif160 from './words/milk-160.avif';
import wordMilkWebp160 from './words/milk-160.webp';
import wordTeaAvif from './words/tea.avif';
import wordTeaWebp from './words/tea.webp';
import wordTeaAvif160 from './words/tea-160.avif';
import wordTeaWebp160 from './words/tea-160.webp';
import wordCarAvif from './words/car.avif';
import wordCarWebp from './words/car.webp';
import wordCarAvif160 from './words/car-160.avif';
import wordCarWebp160 from './words/car-160.webp';
import wordCatAvif from './words/cat.avif';
import wordCatWebp from './words/cat.webp';
import wordCatAvif160 from './words/cat-160.avif';
import wordCatWebp160 from './words/cat-160.webp';
import wordBirdAvif from './words/bird.avif';
import wordBirdWebp from './words/bird.webp';
import wordBirdAvif160 from './words/bird-160.avif';
import wordBirdWebp160 from './words/bird-160.webp';
import wordTreeAvif from './words/tree.avif';
import wordTreeWebp from './words/tree.webp';
import wordTreeAvif160 from './words/tree-160.avif';
import wordTreeWebp160 from './words/tree-160.webp';
import wordSunAvif from './words/sun.avif';
import wordSunWebp from './words/sun.webp';
import wordSunAvif160 from './words/sun-160.avif';
import wordSunWebp160 from './words/sun-160.webp';
import wordMoonAvif from './words/moon.avif';
import wordMoonWebp from './words/moon.webp';
import wordMoonAvif160 from './words/moon-160.avif';
import wordMoonWebp160 from './words/moon-160.webp';
import wordCoffeeAvif from './words/coffee.avif';
import wordCoffeeWebp from './words/coffee.webp';
import wordCoffeeAvif160 from './words/coffee-160.avif';
import wordCoffeeWebp160 from './words/coffee-160.webp';
import wordRiceAvif from './words/rice.avif';
import wordRiceWebp from './words/rice.webp';
import wordRiceAvif160 from './words/rice-160.avif';
import wordRiceWebp160 from './words/rice-160.webp';
import wordMeatAvif from './words/meat.avif';
import wordMeatWebp from './words/meat.webp';
import wordMeatAvif160 from './words/meat-160.avif';
import wordMeatWebp160 from './words/meat-160.webp';
import wordChickenAvif from './words/chicken.avif';
import wordChickenWebp from './words/chicken.webp';
import wordChickenAvif160 from './words/chicken-160.avif';
import wordChickenWebp160 from './words/chicken-160.webp';
import wordFishAvif from './words/fish.avif';
import wordFishWebp from './words/fish.webp';
import wordFishAvif160 from './words/fish-160.avif';
import wordFishWebp160 from './words/fish-160.webp';
import wordEggAvif from './words/egg.avif';
import wordEggWebp from './words/egg.webp';
import wordEggAvif160 from './words/egg-160.avif';
import wordEggWebp160 from './words/egg-160.webp';
import wordCheeseAvif from './words/cheese.avif';
import wordCheeseWebp from './words/cheese.webp';
import wordCheeseAvif160 from './words/cheese-160.avif';
import wordCheeseWebp160 from './words/cheese-160.webp';
import wordSaltAvif from './words/salt.avif';
import wordSaltWebp from './words/salt.webp';
import wordSaltAvif160 from './words/salt-160.avif';
import wordSaltWebp160 from './words/salt-160.webp';
import wordRestaurantAvif from './words/restaurant.avif';
import wordRestaurantWebp from './words/restaurant.webp';
import wordRestaurantAvif160 from './words/restaurant-160.avif';
import wordRestaurantWebp160 from './words/restaurant-160.webp';
import wordOrangeAvif from './words/orange.avif';
import wordOrangeWebp from './words/orange.webp';
import wordOrangeAvif160 from './words/orange-160.avif';
import wordOrangeWebp160 from './words/orange-160.webp';
import wordWindowAvif from './words/window.avif';
import wordWindowWebp from './words/window.webp';
import wordWindowAvif160 from './words/window-160.avif';
import wordWindowWebp160 from './words/window-160.webp';
import wordBedAvif from './words/bed.avif';
import wordBedWebp from './words/bed.webp';
import wordBedAvif160 from './words/bed-160.avif';
import wordBedWebp160 from './words/bed-160.webp';
import wordKeyAvif from './words/key.avif';
import wordKeyWebp from './words/key.webp';
import wordKeyAvif160 from './words/key-160.avif';
import wordKeyWebp160 from './words/key-160.webp';
import wordMirrorAvif from './words/mirror.avif';
import wordMirrorWebp from './words/mirror.webp';
import wordMirrorAvif160 from './words/mirror-160.avif';
import wordMirrorWebp160 from './words/mirror-160.webp';
import wordBathroomAvif from './words/bathroom.avif';
import wordBathroomWebp from './words/bathroom.webp';
import wordBathroomAvif160 from './words/bathroom-160.avif';
import wordBathroomWebp160 from './words/bathroom-160.webp';
import wordManAvif from './words/man.avif';
import wordManWebp from './words/man.webp';
import wordManAvif160 from './words/man-160.avif';
import wordManWebp160 from './words/man-160.webp';
import wordWomanAvif from './words/woman.avif';
import wordWomanWebp from './words/woman.webp';
import wordWomanAvif160 from './words/woman-160.avif';
import wordWomanWebp160 from './words/woman-160.webp';
import wordPersonAvif from './words/person.avif';
import wordPersonWebp from './words/person.webp';
import wordPersonAvif160 from './words/person-160.avif';
import wordPersonWebp160 from './words/person-160.webp';
import wordQuestionAvif from './words/question.avif';
import wordQuestionWebp from './words/question.webp';
import wordQuestionAvif160 from './words/question-160.avif';
import wordQuestionWebp160 from './words/question-160.webp';
import wordYesAvif from './words/yes.avif';
import wordYesWebp from './words/yes.webp';
import wordYesAvif160 from './words/yes-160.avif';
import wordYesWebp160 from './words/yes-160.webp';
import wordNoAvif from './words/no.avif';
import wordNoWebp from './words/no.webp';
import wordNoAvif160 from './words/no-160.avif';
import wordNoWebp160 from './words/no-160.webp';
import wordNameAvif from './words/name.avif';
import wordNameWebp from './words/name.webp';
import wordNameAvif160 from './words/name-160.avif';
import wordNameWebp160 from './words/name-160.webp';
import wordLanguageAvif from './words/language.avif';
import wordLanguageWebp from './words/language.webp';
import wordLanguageAvif160 from './words/language-160.avif';
import wordLanguageWebp160 from './words/language-160.webp';
import wordSoapAvif from './words/soap.avif';
import wordSoapWebp from './words/soap.webp';
import wordSoapAvif160 from './words/soap-160.avif';
import wordSoapWebp160 from './words/soap-160.webp';
import wordAlarmClockAvif from './words/alarm-clock.avif';
import wordAlarmClockWebp from './words/alarm-clock.webp';
import wordAlarmClockAvif160 from './words/alarm-clock-160.avif';
import wordAlarmClockWebp160 from './words/alarm-clock-160.webp';
import wordShirtAvif from './words/shirt.avif';
import wordShirtWebp from './words/shirt.webp';
import wordShirtAvif160 from './words/shirt-160.avif';
import wordShirtWebp160 from './words/shirt-160.webp';
import wordToSleepAvif from './words/to-sleep.avif';
import wordToSleepWebp from './words/to-sleep.webp';
import wordToSleepAvif160 from './words/to-sleep-160.avif';
import wordToSleepWebp160 from './words/to-sleep-160.webp';
import wordToShowerAvif from './words/to-shower.avif';
import wordToShowerWebp from './words/to-shower.webp';
import wordToShowerAvif160 from './words/to-shower-160.avif';
import wordToShowerWebp160 from './words/to-shower-160.webp';
import wordToCookAvif from './words/to-cook.avif';
import wordToCookWebp from './words/to-cook.webp';
import wordToCookAvif160 from './words/to-cook-160.avif';
import wordToCookWebp160 from './words/to-cook-160.webp';
import wordToCleanAvif from './words/to-clean.avif';
import wordToCleanWebp from './words/to-clean.webp';
import wordToCleanAvif160 from './words/to-clean-160.avif';
import wordToCleanWebp160 from './words/to-clean-160.webp';
import wordAppointmentAvif from './words/appointment.avif';
import wordAppointmentWebp from './words/appointment.webp';
import wordAppointmentAvif160 from './words/appointment-160.avif';
import wordAppointmentWebp160 from './words/appointment-160.webp';
import wordChildAvif from './words/child.avif';
import wordChildWebp from './words/child.webp';
import wordChildAvif160 from './words/child-160.avif';
import wordChildWebp160 from './words/child-160.webp';
import wordBoyAvif from './words/boy.avif';
import wordBoyWebp from './words/boy.webp';
import wordBoyAvif160 from './words/boy-160.avif';
import wordBoyWebp160 from './words/boy-160.webp';
import wordGirlAvif from './words/girl.avif';
import wordGirlWebp from './words/girl.webp';
import wordGirlAvif160 from './words/girl-160.avif';
import wordGirlWebp160 from './words/girl-160.webp';
import wordGrandfatherAvif from './words/grandfather.avif';
import wordGrandfatherWebp from './words/grandfather.webp';
import wordGrandfatherAvif160 from './words/grandfather-160.avif';
import wordGrandfatherWebp160 from './words/grandfather-160.webp';
import wordGrandmotherAvif from './words/grandmother.avif';
import wordGrandmotherWebp from './words/grandmother.webp';
import wordGrandmotherAvif160 from './words/grandmother-160.avif';
import wordGrandmotherWebp160 from './words/grandmother-160.webp';
import wordEyeAvif from './words/eye.avif';
import wordEyeWebp from './words/eye.webp';
import wordEyeAvif160 from './words/eye-160.avif';
import wordEyeWebp160 from './words/eye-160.webp';
import wordLegAvif from './words/leg.avif';
import wordLegWebp from './words/leg.webp';
import wordLegAvif160 from './words/leg-160.avif';
import wordLegWebp160 from './words/leg-160.webp';
import wordMouthAvif from './words/mouth.avif';
import wordMouthWebp from './words/mouth.webp';
import wordMouthAvif160 from './words/mouth-160.avif';
import wordMouthWebp160 from './words/mouth-160.webp';
import wordEarAvif from './words/ear.avif';
import wordEarWebp from './words/ear.webp';
import wordEarAvif160 from './words/ear-160.avif';
import wordEarWebp160 from './words/ear-160.webp';
import wordNoseAvif from './words/nose.avif';
import wordNoseWebp from './words/nose.webp';
import wordNoseAvif160 from './words/nose-160.avif';
import wordNoseWebp160 from './words/nose-160.webp';
import wordToothAvif from './words/tooth.avif';
import wordToothWebp from './words/tooth.webp';
import wordToothAvif160 from './words/tooth-160.avif';
import wordToothWebp160 from './words/tooth-160.webp';
import wordHospitalAvif from './words/hospital.avif';
import wordHospitalWebp from './words/hospital.webp';
import wordHospitalAvif160 from './words/hospital-160.avif';
import wordHospitalWebp160 from './words/hospital-160.webp';
import wordHandAvif from './words/hand.avif';
import wordHandWebp from './words/hand.webp';
import wordHandAvif160 from './words/hand-160.avif';
import wordHandWebp160 from './words/hand-160.webp';
import wordHeartAvif from './words/heart.avif';
import wordHeartWebp from './words/heart.webp';
import wordHeartAvif160 from './words/heart-160.avif';
import wordHeartWebp160 from './words/heart-160.webp';
import wordMedicineAvif from './words/medicine.avif';
import wordMedicineWebp from './words/medicine.webp';
import wordMedicineAvif160 from './words/medicine-160.avif';
import wordMedicineWebp160 from './words/medicine-160.webp';
import wordBloodAvif from './words/blood.avif';
import wordBloodWebp from './words/blood.webp';
import wordBloodAvif160 from './words/blood-160.avif';
import wordBloodWebp160 from './words/blood-160.webp';
import wordMountainAvif from './words/mountain.avif';
import wordMountainWebp from './words/mountain.webp';
import wordMountainAvif160 from './words/mountain-160.avif';
import wordMountainWebp160 from './words/mountain-160.webp';
import wordLionAvif from './words/lion.avif';
import wordLionWebp from './words/lion.webp';
import wordLionAvif160 from './words/lion-160.avif';
import wordLionWebp160 from './words/lion-160.webp';
import wordDogAvif from './words/dog.avif';
import wordDogWebp from './words/dog.webp';
import wordDogAvif160 from './words/dog-160.avif';
import wordDogWebp160 from './words/dog-160.webp';
import wordHorseAvif from './words/horse.avif';
import wordHorseWebp from './words/horse.webp';
import wordHorseAvif160 from './words/horse-160.avif';
import wordHorseWebp160 from './words/horse-160.webp';
import wordCamelAvif from './words/camel.avif';
import wordCamelWebp from './words/camel.webp';
import wordCamelAvif160 from './words/camel-160.avif';
import wordCamelWebp160 from './words/camel-160.webp';
import wordDesertAvif from './words/desert.avif';
import wordDesertWebp from './words/desert.webp';
import wordDesertAvif160 from './words/desert-160.avif';
import wordDesertWebp160 from './words/desert-160.webp';
import wordSeaAvif from './words/sea.avif';
import wordSeaWebp from './words/sea.webp';
import wordSeaAvif160 from './words/sea-160.avif';
import wordSeaWebp160 from './words/sea-160.webp';
import wordFlowerAvif from './words/flower.avif';
import wordFlowerWebp from './words/flower.webp';
import wordFlowerAvif160 from './words/flower-160.avif';
import wordFlowerWebp160 from './words/flower-160.webp';
import wordRainAvif from './words/rain.avif';
import wordRainWebp from './words/rain.webp';
import wordRainAvif160 from './words/rain-160.avif';
import wordRainWebp160 from './words/rain-160.webp';
import wordWindAvif from './words/wind.avif';
import wordWindWebp from './words/wind.webp';
import wordWindAvif160 from './words/wind-160.avif';
import wordWindWebp160 from './words/wind-160.webp';
import wordOneAvif from './words/one.avif';
import wordOneWebp from './words/one.webp';
import wordOneAvif160 from './words/one-160.avif';
import wordOneWebp160 from './words/one-160.webp';
import wordTwoAvif from './words/two.avif';
import wordTwoWebp from './words/two.webp';
import wordTwoAvif160 from './words/two-160.avif';
import wordTwoWebp160 from './words/two-160.webp';
import wordThreeAvif from './words/three.avif';
import wordThreeWebp from './words/three.webp';
import wordThreeAvif160 from './words/three-160.avif';
import wordThreeWebp160 from './words/three-160.webp';
import wordFourAvif from './words/four.avif';
import wordFourWebp from './words/four.webp';
import wordFourAvif160 from './words/four-160.avif';
import wordFourWebp160 from './words/four-160.webp';
import wordFiveAvif from './words/five.avif';
import wordFiveWebp from './words/five.webp';
import wordFiveAvif160 from './words/five-160.avif';
import wordFiveWebp160 from './words/five-160.webp';
import wordTenAvif from './words/ten.avif';
import wordTenWebp from './words/ten.webp';
import wordTenAvif160 from './words/ten-160.avif';
import wordTenWebp160 from './words/ten-160.webp';
import wordMorningAvif from './words/morning.avif';
import wordMorningWebp from './words/morning.webp';
import wordMorningAvif160 from './words/morning-160.avif';
import wordMorningWebp160 from './words/morning-160.webp';
import wordSchoolAvif from './words/school.avif';
import wordSchoolWebp from './words/school.webp';
import wordSchoolAvif160 from './words/school-160.avif';
import wordSchoolWebp160 from './words/school-160.webp';
import wordNotebookAvif from './words/notebook.avif';
import wordNotebookWebp from './words/notebook.webp';
import wordNotebookAvif160 from './words/notebook-160.avif';
import wordNotebookWebp160 from './words/notebook-160.webp';
import wordPenAvif from './words/pen.avif';
import wordPenWebp from './words/pen.webp';
import wordPenAvif160 from './words/pen-160.avif';
import wordPenWebp160 from './words/pen-160.webp';
import wordUniversityAvif from './words/university.avif';
import wordUniversityWebp from './words/university.webp';
import wordUniversityAvif160 from './words/university-160.avif';
import wordUniversityWebp160 from './words/university-160.webp';
import wordLibraryAvif from './words/library.avif';
import wordLibraryWebp from './words/library.webp';
import wordLibraryAvif160 from './words/library-160.avif';
import wordLibraryWebp160 from './words/library-160.webp';
import wordDictionaryAvif from './words/dictionary.avif';
import wordDictionaryWebp from './words/dictionary.webp';
import wordDictionaryAvif160 from './words/dictionary-160.avif';
import wordDictionaryWebp160 from './words/dictionary-160.webp';
import wordPaperAvif from './words/paper.avif';
import wordPaperWebp from './words/paper.webp';
import wordPaperAvif160 from './words/paper-160.avif';
import wordPaperWebp160 from './words/paper-160.webp';
import wordBankAvif from './words/bank.avif';
import wordBankWebp from './words/bank.webp';
import wordBankAvif160 from './words/bank-160.avif';
import wordBankWebp160 from './words/bank-160.webp';
import wordShopAvif from './words/shop.avif';
import wordShopWebp from './words/shop.webp';
import wordShopAvif160 from './words/shop-160.avif';
import wordShopWebp160 from './words/shop-160.webp';
import wordMoneyAvif from './words/money.avif';
import wordMoneyWebp from './words/money.webp';
import wordMoneyAvif160 from './words/money-160.avif';
import wordMoneyWebp160 from './words/money-160.webp';
import wordBillAvif from './words/bill.avif';
import wordBillWebp from './words/bill.webp';
import wordBillAvif160 from './words/bill-160.avif';
import wordBillWebp160 from './words/bill-160.webp';
import wordGiftAvif from './words/gift.avif';
import wordGiftWebp from './words/gift.webp';
import wordGiftAvif160 from './words/gift-160.avif';
import wordGiftWebp160 from './words/gift-160.webp';
import wordBagAvif from './words/bag.avif';
import wordBagWebp from './words/bag.webp';
import wordBagAvif160 from './words/bag-160.avif';
import wordBagWebp160 from './words/bag-160.webp';
import wordKeyboardAvif from './words/keyboard.avif';
import wordKeyboardWebp from './words/keyboard.webp';
import wordKeyboardAvif160 from './words/keyboard-160.avif';
import wordKeyboardWebp160 from './words/keyboard-160.webp';
import wordTelevisionAvif from './words/television.avif';
import wordTelevisionWebp from './words/television.webp';
import wordTelevisionAvif160 from './words/television-160.avif';
import wordTelevisionWebp160 from './words/television-160.webp';
import wordRadioAvif from './words/radio.avif';
import wordRadioWebp from './words/radio.webp';
import wordRadioAvif160 from './words/radio-160.avif';
import wordRadioWebp160 from './words/radio-160.webp';
import wordNewspaperAvif from './words/newspaper.avif';
import wordNewspaperWebp from './words/newspaper.webp';
import wordNewspaperAvif160 from './words/newspaper-160.avif';
import wordNewspaperWebp160 from './words/newspaper-160.webp';
import wordCameraAvif from './words/camera.avif';
import wordCameraWebp from './words/camera.webp';
import wordCameraAvif160 from './words/camera-160.avif';
import wordCameraWebp160 from './words/camera-160.webp';
import wordPrinterAvif from './words/printer.avif';
import wordPrinterWebp from './words/printer.webp';
import wordPrinterAvif160 from './words/printer-160.avif';
import wordPrinterWebp160 from './words/printer-160.webp';
import wordPhoneAvif from './words/phone.avif';
import wordPhoneWebp from './words/phone.webp';
import wordPhoneAvif160 from './words/phone-160.avif';
import wordPhoneWebp160 from './words/phone-160.webp';
import wordEmailAvif from './words/email.avif';
import wordEmailWebp from './words/email.webp';
import wordEmailAvif160 from './words/email-160.avif';
import wordEmailWebp160 from './words/email-160.webp';
import wordFileAvif from './words/file.avif';
import wordFileWebp from './words/file.webp';
import wordFileAvif160 from './words/file-160.avif';
import wordFileWebp160 from './words/file-160.webp';
import wordBusAvif from './words/bus.avif';
import wordBusWebp from './words/bus.webp';
import wordBusAvif160 from './words/bus-160.avif';
import wordBusWebp160 from './words/bus-160.webp';
import wordTrainAvif from './words/train.avif';
import wordTrainWebp from './words/train.webp';
import wordTrainAvif160 from './words/train-160.avif';
import wordTrainWebp160 from './words/train-160.webp';
import wordStationAvif from './words/station.avif';
import wordStationWebp from './words/station.webp';
import wordStationAvif160 from './words/station-160.avif';
import wordStationWebp160 from './words/station-160.webp';
import wordTicketAvif from './words/ticket.avif';
import wordTicketWebp from './words/ticket.webp';
import wordTicketAvif160 from './words/ticket-160.avif';
import wordTicketWebp160 from './words/ticket-160.webp';
import wordHotelAvif from './words/hotel.avif';
import wordHotelWebp from './words/hotel.webp';
import wordHotelAvif160 from './words/hotel-160.avif';
import wordHotelWebp160 from './words/hotel-160.webp';
import wordLuggageAvif from './words/luggage.avif';
import wordLuggageWebp from './words/luggage.webp';
import wordLuggageAvif160 from './words/luggage-160.avif';
import wordLuggageWebp160 from './words/luggage-160.webp';
import wordPlaneAvif from './words/plane.avif';
import wordPlaneWebp from './words/plane.webp';
import wordPlaneAvif160 from './words/plane-160.avif';
import wordPlaneWebp160 from './words/plane-160.webp';
import wordRoadAvif from './words/road.avif';
import wordRoadWebp from './words/road.webp';
import wordRoadAvif160 from './words/road-160.avif';
import wordRoadWebp160 from './words/road-160.webp';
import wordCountrySvg from './words/country.svg';
import wordCityAvif from './words/city.avif';
import wordCityWebp from './words/city.webp';
import wordCityAvif160 from './words/city-160.avif';
import wordCityWebp160 from './words/city-160.webp';
import wordPassportAvif from './words/passport.avif';
import wordPassportWebp from './words/passport.webp';
import wordPassportAvif160 from './words/passport-160.avif';
import wordPassportWebp160 from './words/passport-160.webp';
import wordTripAvif from './words/trip.avif';
import wordTripWebp from './words/trip.webp';
import wordTripAvif160 from './words/trip-160.avif';
import wordTripWebp160 from './words/trip-160.webp';
import wordMapAvif from './words/map.avif';
import wordMapWebp from './words/map.webp';
import wordMapAvif160 from './words/map-160.avif';
import wordMapWebp160 from './words/map-160.webp';
import wordBeachAvif from './words/beach.avif';
import wordBeachWebp from './words/beach.webp';
import wordBeachAvif160 from './words/beach-160.avif';
import wordBeachWebp160 from './words/beach-160.webp';
import wordToWriteAvif from './words/to-write.avif';
import wordToWriteWebp from './words/to-write.webp';
import wordToWriteAvif160 from './words/to-write-160.avif';
import wordToWriteWebp160 from './words/to-write-160.webp';
import wordToReadAvif from './words/to-read.avif';
import wordToReadWebp from './words/to-read.webp';
import wordToReadAvif160 from './words/to-read-160.avif';
import wordToReadWebp160 from './words/to-read-160.webp';
import wordToSpeakAvif from './words/to-speak.avif';
import wordToSpeakWebp from './words/to-speak.webp';
import wordToSpeakAvif160 from './words/to-speak-160.avif';
import wordToSpeakWebp160 from './words/to-speak-160.webp';
import wordToDrinkAvif from './words/to-drink.avif';
import wordToDrinkWebp from './words/to-drink.webp';
import wordToDrinkAvif160 from './words/to-drink-160.avif';
import wordToDrinkWebp160 from './words/to-drink-160.webp';
import wordToEatAvif from './words/to-eat.avif';
import wordToEatWebp from './words/to-eat.webp';
import wordToEatAvif160 from './words/to-eat-160.avif';
import wordToEatWebp160 from './words/to-eat-160.webp';
import wordToPlayAvif from './words/to-play.avif';
import wordToPlayWebp from './words/to-play.webp';
import wordToPlayAvif160 from './words/to-play-160.avif';
import wordToPlayWebp160 from './words/to-play-160.webp';
import wordToHelpAvif from './words/to-help.avif';
import wordToHelpWebp from './words/to-help.webp';
import wordToHelpAvif160 from './words/to-help-160.avif';
import wordToHelpWebp160 from './words/to-help-160.webp';
import wordToWorkAvif from './words/to-work.avif';
import wordToWorkWebp from './words/to-work.webp';
import wordToWorkAvif160 from './words/to-work-160.avif';
import wordToWorkWebp160 from './words/to-work-160.webp';
import wordToSeeAvif from './words/to-see.avif';
import wordToSeeWebp from './words/to-see.webp';
import wordToSeeAvif160 from './words/to-see-160.avif';
import wordToSeeWebp160 from './words/to-see-160.webp';
import wordToOpenAvif from './words/to-open.avif';
import wordToOpenWebp from './words/to-open.webp';
import wordToOpenAvif160 from './words/to-open-160.avif';
import wordToOpenWebp160 from './words/to-open-160.webp';
import wordFarmerAvif from './words/farmer.avif';
import wordFarmerWebp from './words/farmer.webp';
import wordFarmerAvif160 from './words/farmer-160.avif';
import wordFarmerWebp160 from './words/farmer-160.webp';
import wordCookAvif from './words/cook.avif';
import wordCookWebp from './words/cook.webp';
import wordCookAvif160 from './words/cook-160.avif';
import wordCookWebp160 from './words/cook-160.webp';
import wordThankYouAvif from './words/thank-you.avif';
import wordThankYouWebp from './words/thank-you.webp';
import wordThankYouAvif160 from './words/thank-you-160.avif';
import wordThankYouWebp160 from './words/thank-you-160.webp';
import wordSorryAvif from './words/sorry.avif';
import wordSorryWebp from './words/sorry.webp';
import wordSorryAvif160 from './words/sorry-160.avif';
import wordSorryWebp160 from './words/sorry-160.webp';
import wordToWearAvif from './words/to-wear.avif';
import wordToWearWebp from './words/to-wear.webp';
import wordToWearAvif160 from './words/to-wear-160.avif';
import wordToWearWebp160 from './words/to-wear-160.webp';
import wordShoesAvif from './words/shoes.avif';
import wordShoesWebp from './words/shoes.webp';
import wordShoesAvif160 from './words/shoes-160.avif';
import wordShoesWebp160 from './words/shoes-160.webp';
import wordHolidayAvif from './words/holiday.avif';
import wordHolidayWebp from './words/holiday.webp';
import wordHolidayAvif160 from './words/holiday-160.avif';
import wordHolidayWebp160 from './words/holiday-160.webp';
import wordPainAvif from './words/pain.avif';
import wordPainWebp from './words/pain.webp';
import wordPainAvif160 from './words/pain-160.avif';
import wordPainWebp160 from './words/pain-160.webp';
import wordIllnessAvif from './words/illness.avif';
import wordIllnessWebp from './words/illness.webp';
import wordIllnessAvif160 from './words/illness-160.avif';
import wordIllnessWebp160 from './words/illness-160.webp';
import wordNumberAvif from './words/number.avif';
import wordNumberWebp from './words/number.webp';
import wordNumberAvif160 from './words/number-160.avif';
import wordNumberWebp160 from './words/number-160.webp';
import wordMonthAvif from './words/month.avif';
import wordMonthWebp from './words/month.webp';
import wordMonthAvif160 from './words/month-160.avif';
import wordMonthWebp160 from './words/month-160.webp';
import wordHourAvif from './words/hour.avif';
import wordHourWebp from './words/hour.webp';
import wordHourAvif160 from './words/hour-160.avif';
import wordHourWebp160 from './words/hour-160.webp';
import wordMinuteAvif from './words/minute.avif';
import wordMinuteWebp from './words/minute.webp';
import wordMinuteAvif160 from './words/minute-160.avif';
import wordMinuteWebp160 from './words/minute-160.webp';
import wordTimeAvif from './words/time.avif';
import wordTimeWebp from './words/time.webp';
import wordTimeAvif160 from './words/time-160.avif';
import wordTimeWebp160 from './words/time-160.webp';
import wordNightAvif from './words/night.avif';
import wordNightWebp from './words/night.webp';
import wordNightAvif160 from './words/night-160.avif';
import wordNightWebp160 from './words/night-160.webp';
import wordPupilAvif from './words/pupil.avif';
import wordPupilWebp from './words/pupil.webp';
import wordPupilAvif160 from './words/pupil-160.avif';
import wordPupilWebp160 from './words/pupil-160.webp';
import wordProfessorAvif from './words/professor.avif';
import wordProfessorWebp from './words/professor.webp';
import wordProfessorAvif160 from './words/professor-160.avif';
import wordProfessorWebp160 from './words/professor-160.webp';
import wordCertificateAvif from './words/certificate.avif';
import wordCertificateWebp from './words/certificate.webp';
import wordCertificateAvif160 from './words/certificate-160.avif';
import wordCertificateWebp160 from './words/certificate-160.webp';
import wordKnowledgeAvif from './words/knowledge.avif';
import wordKnowledgeWebp from './words/knowledge.webp';
import wordKnowledgeAvif160 from './words/knowledge-160.avif';
import wordKnowledgeWebp160 from './words/knowledge-160.webp';
import wordMarketAvif from './words/market.avif';
import wordMarketWebp from './words/market.webp';
import wordMarketAvif160 from './words/market-160.avif';
import wordMarketWebp160 from './words/market-160.webp';
import wordPriceAvif from './words/price.avif';
import wordPriceWebp from './words/price.webp';
import wordPriceAvif160 from './words/price-160.avif';
import wordPriceWebp160 from './words/price-160.webp';
import wordExpensiveAvif from './words/expensive.avif';
import wordExpensiveWebp from './words/expensive.webp';
import wordExpensiveAvif160 from './words/expensive-160.avif';
import wordExpensiveWebp160 from './words/expensive-160.webp';
import wordToBuyAvif from './words/to-buy.avif';
import wordToBuyWebp from './words/to-buy.webp';
import wordToBuyAvif160 from './words/to-buy-160.avif';
import wordToBuyWebp160 from './words/to-buy-160.webp';
import wordClothesAvif from './words/clothes.avif';
import wordClothesWebp from './words/clothes.webp';
import wordClothesAvif160 from './words/clothes-160.avif';
import wordClothesWebp160 from './words/clothes-160.webp';
import wordProgramAvif from './words/program.avif';
import wordProgramWebp from './words/program.webp';
import wordProgramAvif160 from './words/program-160.avif';
import wordProgramWebp160 from './words/program-160.webp';
import wordLawyerAvif from './words/lawyer.avif';
import wordLawyerWebp from './words/lawyer.webp';
import wordLawyerAvif160 from './words/lawyer-160.avif';
import wordLawyerWebp160 from './words/lawyer-160.webp';
import wordHappyAvif from './words/happy.avif';
import wordHappyWebp from './words/happy.webp';
import wordHappyAvif160 from './words/happy-160.avif';
import wordHappyWebp160 from './words/happy-160.webp';
import wordHotAvif from './words/hot.avif';
import wordHotWebp from './words/hot.webp';
import wordHotAvif160 from './words/hot-160.avif';
import wordHotWebp160 from './words/hot-160.webp';
import wordSadAvif from './words/sad.avif';
import wordSadWebp from './words/sad.webp';
import wordSadAvif160 from './words/sad-160.avif';
import wordSadWebp160 from './words/sad-160.webp';
import wordStrongAvif from './words/strong.avif';
import wordStrongWebp from './words/strong.webp';
import wordStrongAvif160 from './words/strong-160.avif';
import wordStrongWebp160 from './words/strong-160.webp';
import wordHairAvif from './words/hair.avif';
import wordHairWebp from './words/hair.webp';
import wordHairAvif160 from './words/hair-160.avif';
import wordHairWebp160 from './words/hair-160.webp';
import wordHeadAvif from './words/head.avif';
import wordHeadWebp from './words/head.webp';
import wordHeadAvif160 from './words/head-160.avif';
import wordHeadWebp160 from './words/head-160.webp';
import wordHealthAvif from './words/health.avif';
import wordHealthWebp from './words/health.webp';
import wordHealthAvif160 from './words/health-160.avif';
import wordHealthWebp160 from './words/health-160.webp';
import wordHelloAvif from './words/hello.avif';
import wordHelloWebp from './words/hello.webp';
import wordHelloAvif160 from './words/hello-160.avif';
import wordHelloWebp160 from './words/hello-160.webp';
import wordGoodEveningAvif from './words/good-evening.avif';
import wordGoodEveningWebp from './words/good-evening.webp';
import wordGoodEveningAvif160 from './words/good-evening-160.avif';
import wordGoodEveningWebp160 from './words/good-evening-160.webp';
import wordCongratulationsAvif from './words/congratulations.avif';
import wordCongratulationsWebp from './words/congratulations.webp';
import wordCongratulationsAvif160 from './words/congratulations-160.avif';
import wordCongratulationsWebp160 from './words/congratulations-160.webp';
import wordWeekAvif from './words/week.avif';
import wordWeekWebp from './words/week.webp';
import wordWeekAvif160 from './words/week-160.avif';
import wordWeekWebp160 from './words/week-160.webp';
import wordExamAvif from './words/exam.avif';
import wordExamWebp from './words/exam.webp';
import wordExamAvif160 from './words/exam-160.avif';
import wordExamWebp160 from './words/exam-160.webp';
import wordInternetAvif from './words/internet.avif';
import wordInternetWebp from './words/internet.webp';
import wordInternetAvif160 from './words/internet-160.avif';
import wordInternetWebp160 from './words/internet-160.webp';
import wordProjectAvif from './words/project.avif';
import wordProjectWebp from './words/project.webp';
import wordProjectAvif160 from './words/project-160.avif';
import wordProjectWebp160 from './words/project-160.webp';
import wordScreenAvif from './words/screen.avif';
import wordScreenWebp from './words/screen.webp';
import wordScreenAvif160 from './words/screen-160.avif';
import wordScreenWebp160 from './words/screen-160.webp';
import wordJournalistAvif from './words/journalist.avif';
import wordJournalistWebp from './words/journalist.webp';
import wordJournalistAvif160 from './words/journalist-160.avif';
import wordJournalistWebp160 from './words/journalist-160.webp';
import wordOfficeAvif from './words/office.avif';
import wordOfficeWebp from './words/office.webp';
import wordOfficeAvif160 from './words/office-160.avif';
import wordOfficeWebp160 from './words/office-160.webp';
import wordColdAvif from './words/cold.avif';
import wordColdWebp from './words/cold.webp';
import wordColdAvif160 from './words/cold-160.avif';
import wordColdWebp160 from './words/cold-160.webp';
import wordDeliciousAvif from './words/delicious.avif';
import wordDeliciousWebp from './words/delicious.webp';
import wordDeliciousAvif160 from './words/delicious-160.avif';
import wordDeliciousWebp160 from './words/delicious-160.webp';
import wordSlowAvif from './words/slow.avif';
import wordSlowWebp from './words/slow.webp';
import wordSlowAvif160 from './words/slow-160.avif';
import wordSlowWebp160 from './words/slow-160.webp';
import wordGardenAvif from './words/garden.avif';
import wordGardenWebp from './words/garden.webp';
import wordGardenAvif160 from './words/garden-160.avif';
import wordGardenWebp160 from './words/garden-160.webp';
import wordBreakfastAvif from './words/breakfast.avif';
import wordBreakfastWebp from './words/breakfast.webp';
import wordBreakfastAvif160 from './words/breakfast-160.avif';
import wordBreakfastWebp160 from './words/breakfast-160.webp';
import wordClassroomAvif from './words/classroom.avif';
import wordClassroomWebp from './words/classroom.webp';
import wordClassroomAvif160 from './words/classroom-160.avif';
import wordClassroomWebp160 from './words/classroom-160.webp';
import wordDaughterAvif from './words/daughter.avif';
import wordDaughterWebp from './words/daughter.webp';
import wordDaughterAvif160 from './words/daughter-160.avif';
import wordDaughterWebp160 from './words/daughter-160.webp';
import wordDriverAvif from './words/driver.avif';
import wordDriverWebp from './words/driver.webp';
import wordDriverAvif160 from './words/driver-160.avif';
import wordDriverWebp160 from './words/driver-160.webp';
import wordGoalAvif from './words/goal.avif';
import wordGoalWebp from './words/goal.webp';
import wordGoalAvif160 from './words/goal-160.avif';
import wordGoalWebp160 from './words/goal-160.webp';
import wordEmployeeAvif from './words/employee.avif';
import wordEmployeeWebp from './words/employee.webp';
import wordEmployeeAvif160 from './words/employee-160.avif';
import wordEmployeeWebp160 from './words/employee-160.webp';
import wordFriendAvif from './words/friend.avif';
import wordFriendWebp from './words/friend.webp';
import wordFriendAvif160 from './words/friend-160.avif';
import wordFriendWebp160 from './words/friend-160.webp';
import wordFoodAvif from './words/food.avif';
import wordFoodWebp from './words/food.webp';
import wordFoodAvif160 from './words/food-160.avif';
import wordFoodWebp160 from './words/food-160.webp';
import wordFruitAvif from './words/fruit.avif';
import wordFruitWebp from './words/fruit.webp';
import wordFruitAvif160 from './words/fruit-160.avif';
import wordFruitWebp160 from './words/fruit-160.webp';
import wordFastAvif from './words/fast.avif';
import wordFastWebp from './words/fast.webp';
import wordFastAvif160 from './words/fast-160.avif';
import wordFastWebp160 from './words/fast-160.webp';
import wordFamilyAvif from './words/family.avif';
import wordFamilyWebp from './words/family.webp';
import wordFamilyAvif160 from './words/family-160.avif';
import wordFamilyWebp160 from './words/family-160.webp';
import wordDiscountAvif from './words/discount.avif';
import wordDiscountWebp from './words/discount.webp';
import wordDiscountAvif160 from './words/discount-160.avif';
import wordDiscountWebp160 from './words/discount-160.webp';
import wordDevelopmentAvif from './words/development.avif';
import wordDevelopmentWebp from './words/development.webp';
import wordDevelopmentAvif160 from './words/development-160.avif';
import wordDevelopmentWebp160 from './words/development-160.webp';
import wordHomeworkAvif from './words/homework.avif';
import wordHomeworkWebp from './words/homework.webp';
import wordHomeworkAvif160 from './words/homework-160.avif';
import wordHomeworkWebp160 from './words/homework-160.webp';
import wordIdeaAvif from './words/idea.avif';
import wordIdeaWebp from './words/idea.webp';
import wordIdeaAvif160 from './words/idea-160.avif';
import wordIdeaWebp160 from './words/idea-160.webp';
import wordFreedomAvif from './words/freedom.avif';
import wordFreedomWebp from './words/freedom.webp';
import wordFreedomAvif160 from './words/freedom-160.avif';
import wordFreedomWebp160 from './words/freedom-160.webp';
import wordJusticeAvif from './words/justice.avif';
import wordJusticeWebp from './words/justice.webp';
import wordJusticeAvif160 from './words/justice-160.avif';
import wordJusticeWebp160 from './words/justice-160.webp';
import wordTruthAvif from './words/truth.avif';
import wordTruthWebp from './words/truth.webp';
import wordTruthAvif160 from './words/truth-160.avif';
import wordTruthWebp160 from './words/truth-160.webp';
import wordResearchAvif from './words/research.avif';
import wordResearchWebp from './words/research.webp';
import wordResearchAvif160 from './words/research-160.avif';
import wordResearchWebp160 from './words/research-160.webp';
import wordSocietyAvif from './words/society.avif';
import wordSocietyWebp from './words/society.webp';
import wordSocietyAvif160 from './words/society-160.avif';
import wordSocietyWebp160 from './words/society-160.webp';
import wordCultureAvif from './words/culture.avif';
import wordCultureWebp from './words/culture.webp';
import wordCultureAvif160 from './words/culture-160.avif';
import wordCultureWebp160 from './words/culture-160.webp';
import wordHistoryAvif from './words/history.avif';
import wordHistoryWebp from './words/history.webp';
import wordHistoryAvif160 from './words/history-160.avif';
import wordHistoryWebp160 from './words/history-160.webp';
import wordPhilosophyAvif from './words/philosophy.avif';
import wordPhilosophyWebp from './words/philosophy.webp';
import wordPhilosophyAvif160 from './words/philosophy-160.avif';
import wordPhilosophyWebp160 from './words/philosophy-160.webp';
import wordTheoryAvif from './words/theory.avif';
import wordTheoryWebp from './words/theory.webp';
import wordTheoryAvif160 from './words/theory-160.avif';
import wordTheoryWebp160 from './words/theory-160.webp';
import wordExperienceAvif from './words/experience.avif';
import wordExperienceWebp from './words/experience.webp';
import wordExperienceAvif160 from './words/experience-160.avif';
import wordExperienceWebp160 from './words/experience-160.webp';
import wordResponsibilityAvif from './words/responsibility.avif';
import wordResponsibilityWebp from './words/responsibility.webp';
import wordResponsibilityAvif160 from './words/responsibility-160.avif';
import wordResponsibilityWebp160 from './words/responsibility-160.webp';
import wordMeaningAvif from './words/meaning.avif';
import wordMeaningWebp from './words/meaning.webp';
import wordMeaningAvif160 from './words/meaning-160.avif';
import wordMeaningWebp160 from './words/meaning-160.webp';
import wordAnalysisAvif from './words/analysis.avif';
import wordAnalysisWebp from './words/analysis.webp';
import wordAnalysisAvif160 from './words/analysis-160.avif';
import wordAnalysisWebp160 from './words/analysis-160.webp';
import wordBeautifulAvif from './words/beautiful.avif';
import wordBeautifulWebp from './words/beautiful.webp';
import wordBeautifulAvif160 from './words/beautiful-160.avif';
import wordBeautifulWebp160 from './words/beautiful-160.webp';
import wordCleanAvif from './words/clean.avif';
import wordCleanWebp from './words/clean.webp';
import wordCleanAvif160 from './words/clean-160.avif';
import wordCleanWebp160 from './words/clean-160.webp';
import wordGoodbyeAvif from './words/goodbye.avif';
import wordGoodbyeWebp from './words/goodbye.webp';
import wordGoodbyeAvif160 from './words/goodbye-160.avif';
import wordGoodbyeWebp160 from './words/goodbye-160.webp';
import wordPleaseAvif from './words/please.avif';
import wordPleaseWebp from './words/please.webp';
import wordPleaseAvif160 from './words/please-160.avif';
import wordPleaseWebp160 from './words/please-160.webp';
import wordWordAvif from './words/word.avif';
import wordWordWebp from './words/word.webp';
import wordWordAvif160 from './words/word-160.avif';
import wordWordWebp160 from './words/word-160.webp';
import wordAnswerAvif from './words/answer.avif';
import wordAnswerWebp from './words/answer.webp';
import wordAnswerAvif160 from './words/answer-160.avif';
import wordAnswerWebp160 from './words/answer-160.webp';
import wordToWakeUpAvif from './words/to-wake-up.avif';
import wordToWakeUpWebp from './words/to-wake-up.webp';
import wordToWakeUpAvif160 from './words/to-wake-up-160.avif';
import wordToWakeUpWebp160 from './words/to-wake-up-160.webp';
import wordHabitAvif from './words/habit.avif';
import wordHabitWebp from './words/habit.webp';
import wordHabitAvif160 from './words/habit-160.avif';
import wordHabitWebp160 from './words/habit-160.webp';
import wordToGoOutAvif from './words/to-go-out.avif';
import wordToGoOutWebp from './words/to-go-out.webp';
import wordToGoOutAvif160 from './words/to-go-out-160.avif';
import wordToGoOutWebp160 from './words/to-go-out-160.webp';
import wordToReturnAvif from './words/to-return.avif';
import wordToReturnWebp from './words/to-return.webp';
import wordToReturnAvif160 from './words/to-return-160.avif';
import wordToReturnWebp160 from './words/to-return-160.webp';
import wordWelcomeAvif from './words/welcome.avif';
import wordWelcomeWebp from './words/welcome.webp';
import wordWelcomeAvif160 from './words/welcome-160.avif';
import wordWelcomeWebp160 from './words/welcome-160.webp';
import wordExcuseMeAvif from './words/excuse-me.avif';
import wordExcuseMeWebp from './words/excuse-me.webp';
import wordExcuseMeAvif160 from './words/excuse-me-160.avif';
import wordExcuseMeWebp160 from './words/excuse-me-160.webp';
import wordGoodMorningAvif from './words/good-morning.avif';
import wordGoodMorningWebp from './words/good-morning.webp';
import wordGoodMorningAvif160 from './words/good-morning-160.avif';
import wordGoodMorningWebp160 from './words/good-morning-160.webp';
import wordHowAreYouAvif from './words/how-are-you.avif';
import wordHowAreYouWebp from './words/how-are-you.webp';
import wordHowAreYouAvif160 from './words/how-are-you-160.avif';
import wordHowAreYouWebp160 from './words/how-are-you-160.webp';
import wordNoProblemAvif from './words/no-problem.avif';
import wordNoProblemWebp from './words/no-problem.webp';
import wordNoProblemAvif160 from './words/no-problem-160.avif';
import wordNoProblemWebp160 from './words/no-problem-160.webp';
import wordOfCourseAvif from './words/of-course.avif';
import wordOfCourseWebp from './words/of-course.webp';
import wordOfCourseAvif160 from './words/of-course-160.avif';
import wordOfCourseWebp160 from './words/of-course-160.webp';
import wordLittleByLittleAvif from './words/little-by-little.avif';
import wordLittleByLittleWebp from './words/little-by-little.webp';
import wordLittleByLittleAvif160 from './words/little-by-little-160.avif';
import wordLittleByLittleWebp160 from './words/little-by-little-160.webp';
import wordPatienceIsTheKeyAvif from './words/patience-is-the-key.avif';
import wordPatienceIsTheKeyWebp from './words/patience-is-the-key.webp';
import wordPatienceIsTheKeyAvif160 from './words/patience-is-the-key-160.avif';
import wordPatienceIsTheKeyWebp160 from './words/patience-is-the-key-160.webp';
import wordWhoeverStrivesFindsAvif from './words/whoever-strives-finds.avif';
import wordWhoeverStrivesFindsWebp from './words/whoever-strives-finds.webp';
import wordWhoeverStrivesFindsAvif160 from './words/whoever-strives-finds-160.avif';
import wordWhoeverStrivesFindsWebp160 from './words/whoever-strives-finds-160.webp';
import wordTimeIsGoldAvif from './words/time-is-gold.avif';
import wordTimeIsGoldWebp from './words/time-is-gold.webp';
import wordTimeIsGoldAvif160 from './words/time-is-gold-160.avif';
import wordTimeIsGoldWebp160 from './words/time-is-gold-160.webp';
import wordAsYouSowSoYouReapAvif from './words/as-you-sow-so-you-reap.avif';
import wordAsYouSowSoYouReapWebp from './words/as-you-sow-so-you-reap.webp';
import wordAsYouSowSoYouReapAvif160 from './words/as-you-sow-so-you-reap-160.avif';
import wordAsYouSowSoYouReapWebp160 from './words/as-you-sow-so-you-reap-160.webp';
import wordSonAvif from './words/son.avif';
import wordSonWebp from './words/son.webp';
import wordSonAvif160 from './words/son-160.avif';
import wordSonWebp160 from './words/son-160.webp';
import wordHusbandAvif from './words/husband.avif';
import wordHusbandWebp from './words/husband.webp';
import wordHusbandAvif160 from './words/husband-160.avif';
import wordHusbandWebp160 from './words/husband-160.webp';
import wordWifeAvif from './words/wife.avif';
import wordWifeWebp from './words/wife.webp';
import wordWifeAvif160 from './words/wife-160.avif';
import wordWifeWebp160 from './words/wife-160.webp';
import wordNeighborAvif from './words/neighbor.avif';
import wordNeighborWebp from './words/neighbor.webp';
import wordNeighborAvif160 from './words/neighbor-160.avif';
import wordNeighborWebp160 from './words/neighbor-160.webp';
import wordVegetablesAvif from './words/vegetables.avif';
import wordVegetablesWebp from './words/vegetables.webp';
import wordVegetablesAvif160 from './words/vegetables-160.avif';
import wordVegetablesWebp160 from './words/vegetables-160.webp';
import wordKitchenAvif from './words/kitchen.avif';
import wordKitchenWebp from './words/kitchen.webp';
import wordKitchenAvif160 from './words/kitchen-160.avif';
import wordKitchenWebp160 from './words/kitchen-160.webp';
import wordTableAvif from './words/table.avif';
import wordTableWebp from './words/table.webp';
import wordTableAvif160 from './words/table-160.avif';
import wordTableWebp160 from './words/table-160.webp';
import wordApartmentAvif from './words/apartment.avif';
import wordApartmentWebp from './words/apartment.webp';
import wordApartmentAvif160 from './words/apartment-160.avif';
import wordApartmentWebp160 from './words/apartment-160.webp';
import wordLampAvif from './words/lamp.avif';
import wordLampWebp from './words/lamp.webp';
import wordLampAvif160 from './words/lamp-160.avif';
import wordLampWebp160 from './words/lamp-160.webp';
import wordSkyAvif from './words/sky.avif';
import wordSkyWebp from './words/sky.webp';
import wordSkyAvif160 from './words/sky-160.avif';
import wordSkyWebp160 from './words/sky-160.webp';
import wordRiverAvif from './words/river.avif';
import wordRiverWebp from './words/river.webp';
import wordRiverAvif160 from './words/river-160.avif';
import wordRiverWebp160 from './words/river-160.webp';
import wordDayAvif from './words/day.avif';
import wordDayWebp from './words/day.webp';
import wordDayAvif160 from './words/day-160.avif';
import wordDayWebp160 from './words/day-160.webp';
import wordYearAvif from './words/year.avif';
import wordYearWebp from './words/year.webp';
import wordYearAvif160 from './words/year-160.avif';
import wordYearWebp160 from './words/year-160.webp';
import wordLessonAvif from './words/lesson.avif';
import wordLessonWebp from './words/lesson.webp';
import wordLessonAvif160 from './words/lesson-160.avif';
import wordLessonWebp160 from './words/lesson-160.webp';
import wordBlackboardAvif from './words/blackboard.avif';
import wordBlackboardWebp from './words/blackboard.webp';
import wordBlackboardAvif160 from './words/blackboard-160.avif';
import wordBlackboardWebp160 from './words/blackboard-160.webp';
import wordToSellAvif from './words/to-sell.avif';
import wordToSellWebp from './words/to-sell.webp';
import wordToSellAvif160 from './words/to-sell-160.avif';
import wordToSellWebp160 from './words/to-sell-160.webp';
import wordCustomerAvif from './words/customer.avif';
import wordCustomerWebp from './words/customer.webp';
import wordCustomerAvif160 from './words/customer-160.avif';
import wordCustomerWebp160 from './words/customer-160.webp';
import wordWebsiteAvif from './words/website.avif';
import wordWebsiteWebp from './words/website.webp';
import wordWebsiteAvif160 from './words/website-160.avif';
import wordWebsiteWebp160 from './words/website-160.webp';
import wordNetworkAvif from './words/network.avif';
import wordNetworkWebp from './words/network.webp';
import wordNetworkAvif160 from './words/network-160.avif';
import wordNetworkWebp160 from './words/network-160.webp';
import wordApplicationAvif from './words/application.avif';
import wordApplicationWebp from './words/application.webp';
import wordApplicationAvif160 from './words/application-160.avif';
import wordApplicationWebp160 from './words/application-160.webp';
import wordNewsAvif from './words/news.avif';
import wordNewsWebp from './words/news.webp';
import wordNewsAvif160 from './words/news-160.avif';
import wordNewsWebp160 from './words/news-160.webp';
import wordAirportAvif from './words/airport.avif';
import wordAirportWebp from './words/airport.webp';
import wordAirportAvif160 from './words/airport-160.avif';
import wordAirportWebp160 from './words/airport-160.webp';
import wordToListenAvif from './words/to-listen.avif';
import wordToListenWebp from './words/to-listen.webp';
import wordToListenAvif160 from './words/to-listen-160.avif';
import wordToListenWebp160 from './words/to-listen-160.webp';
import wordToGoAvif from './words/to-go.avif';
import wordToGoWebp from './words/to-go.webp';
import wordToGoAvif160 from './words/to-go-160.avif';
import wordToGoWebp160 from './words/to-go-160.webp';
import wordToLearnAvif from './words/to-learn.avif';
import wordToLearnWebp from './words/to-learn.webp';
import wordToLearnAvif160 from './words/to-learn-160.avif';
import wordToLearnWebp160 from './words/to-learn-160.webp';
import wordToTeachAvif from './words/to-teach.avif';
import wordToTeachWebp from './words/to-teach.webp';
import wordToTeachAvif160 from './words/to-teach-160.avif';
import wordToTeachWebp160 from './words/to-teach-160.webp';
import wordToTravelAvif from './words/to-travel.avif';
import wordToTravelWebp from './words/to-travel.webp';
import wordToTravelAvif160 from './words/to-travel-160.avif';
import wordToTravelWebp160 from './words/to-travel-160.webp';
import wordToAskAvif from './words/to-ask.avif';
import wordToAskWebp from './words/to-ask.webp';
import wordToAskAvif160 from './words/to-ask-160.avif';
import wordToAskWebp160 from './words/to-ask-160.webp';
import wordMerchantAvif from './words/merchant.avif';
import wordMerchantWebp from './words/merchant.webp';
import wordMerchantAvif160 from './words/merchant-160.avif';
import wordMerchantWebp160 from './words/merchant-160.webp';
import wordManagerAvif from './words/manager.avif';
import wordManagerWebp from './words/manager.webp';
import wordManagerAvif160 from './words/manager-160.avif';
import wordManagerWebp160 from './words/manager-160.webp';
import wordWorkAvif from './words/work.avif';
import wordWorkWebp from './words/work.webp';
import wordWorkAvif160 from './words/work-160.avif';
import wordWorkWebp160 from './words/work-160.webp';
import wordSalaryAvif from './words/salary.avif';
import wordSalaryWebp from './words/salary.webp';
import wordSalaryAvif160 from './words/salary-160.avif';
import wordSalaryWebp160 from './words/salary-160.webp';
import wordBigAvif from './words/big.avif';
import wordBigWebp from './words/big.webp';
import wordBigAvif160 from './words/big-160.avif';
import wordBigWebp160 from './words/big-160.webp';
import wordRoomAvif from './words/room.avif';
import wordRoomWebp from './words/room.webp';
import wordRoomAvif160 from './words/room-160.avif';
import wordRoomWebp160 from './words/room-160.webp';
import wordSugarAvif from './words/sugar.avif';
import wordSugarWebp from './words/sugar.webp';
import wordSugarAvif160 from './words/sugar-160.avif';
import wordSugarWebp160 from './words/sugar-160.webp';
import wordUncleAvif from './words/uncle.avif';
import wordUncleWebp from './words/uncle.webp';
import wordUncleAvif160 from './words/uncle-160.avif';
import wordUncleWebp160 from './words/uncle-160.webp';
import wordWallAvif from './words/wall.avif';
import wordWallWebp from './words/wall.webp';
import wordWallAvif160 from './words/wall-160.avif';
import wordWallWebp160 from './words/wall-160.webp';
import wordTallAvif from './words/tall.avif';
import wordTallWebp from './words/tall.webp';
import wordTallAvif160 from './words/tall-160.avif';
import wordTallWebp160 from './words/tall-160.webp';
import wordSixAvif from './words/six.avif';
import wordSixWebp from './words/six.webp';
import wordSixAvif160 from './words/six-160.avif';
import wordSixWebp160 from './words/six-160.webp';
import wordSevenAvif from './words/seven.avif';
import wordSevenWebp from './words/seven.webp';
import wordSevenAvif160 from './words/seven-160.avif';
import wordSevenWebp160 from './words/seven-160.webp';
import wordEightAvif from './words/eight.avif';
import wordEightWebp from './words/eight.webp';
import wordEightAvif160 from './words/eight-160.avif';
import wordEightWebp160 from './words/eight-160.webp';
import wordNineAvif from './words/nine.avif';
import wordNineWebp from './words/nine.webp';
import wordNineAvif160 from './words/nine-160.avif';
import wordNineWebp160 from './words/nine-160.webp';
import wordElevenAvif from './words/eleven.avif';
import wordElevenWebp from './words/eleven.webp';
import wordElevenAvif160 from './words/eleven-160.avif';
import wordElevenWebp160 from './words/eleven-160.webp';
import wordTwelveAvif from './words/twelve.avif';
import wordTwelveWebp from './words/twelve.webp';
import wordTwelveAvif160 from './words/twelve-160.avif';
import wordTwelveWebp160 from './words/twelve-160.webp';
import wordThirteenAvif from './words/thirteen.avif';
import wordThirteenWebp from './words/thirteen.webp';
import wordThirteenAvif160 from './words/thirteen-160.avif';
import wordThirteenWebp160 from './words/thirteen-160.webp';
import wordFourteenAvif from './words/fourteen.avif';
import wordFourteenWebp from './words/fourteen.webp';
import wordFourteenAvif160 from './words/fourteen-160.avif';
import wordFourteenWebp160 from './words/fourteen-160.webp';
import wordFifteenAvif from './words/fifteen.avif';
import wordFifteenWebp from './words/fifteen.webp';
import wordFifteenAvif160 from './words/fifteen-160.avif';
import wordFifteenWebp160 from './words/fifteen-160.webp';
import wordSixteenAvif from './words/sixteen.avif';
import wordSixteenWebp from './words/sixteen.webp';
import wordSixteenAvif160 from './words/sixteen-160.avif';
import wordSixteenWebp160 from './words/sixteen-160.webp';
import wordSeventeenAvif from './words/seventeen.avif';
import wordSeventeenWebp from './words/seventeen.webp';
import wordSeventeenAvif160 from './words/seventeen-160.avif';
import wordSeventeenWebp160 from './words/seventeen-160.webp';
import wordEighteenAvif from './words/eighteen.avif';
import wordEighteenWebp from './words/eighteen.webp';
import wordEighteenAvif160 from './words/eighteen-160.avif';
import wordEighteenWebp160 from './words/eighteen-160.webp';
import wordNineteenAvif from './words/nineteen.avif';
import wordNineteenWebp from './words/nineteen.webp';
import wordNineteenAvif160 from './words/nineteen-160.avif';
import wordNineteenWebp160 from './words/nineteen-160.webp';
import wordTwentyAvif from './words/twenty.avif';
import wordTwentyWebp from './words/twenty.webp';
import wordTwentyAvif160 from './words/twenty-160.avif';
import wordTwentyWebp160 from './words/twenty-160.webp';
import wordThirtyAvif from './words/thirty.avif';
import wordThirtyWebp from './words/thirty.webp';
import wordThirtyAvif160 from './words/thirty-160.avif';
import wordThirtyWebp160 from './words/thirty-160.webp';
import wordFortyAvif from './words/forty.avif';
import wordFortyWebp from './words/forty.webp';
import wordFortyAvif160 from './words/forty-160.avif';
import wordFortyWebp160 from './words/forty-160.webp';
import wordFiftyAvif from './words/fifty.avif';
import wordFiftyWebp from './words/fifty.webp';
import wordFiftyAvif160 from './words/fifty-160.avif';
import wordFiftyWebp160 from './words/fifty-160.webp';
import wordSixtyAvif from './words/sixty.avif';
import wordSixtyWebp from './words/sixty.webp';
import wordSixtyAvif160 from './words/sixty-160.avif';
import wordSixtyWebp160 from './words/sixty-160.webp';
import wordSeventyAvif from './words/seventy.avif';
import wordSeventyWebp from './words/seventy.webp';
import wordSeventyAvif160 from './words/seventy-160.avif';
import wordSeventyWebp160 from './words/seventy-160.webp';
import wordEightyAvif from './words/eighty.avif';
import wordEightyWebp from './words/eighty.webp';
import wordEightyAvif160 from './words/eighty-160.avif';
import wordEightyWebp160 from './words/eighty-160.webp';
import wordNinetyAvif from './words/ninety.avif';
import wordNinetyWebp from './words/ninety.webp';
import wordNinetyAvif160 from './words/ninety-160.avif';
import wordNinetyWebp160 from './words/ninety-160.webp';
import wordHundredAvif from './words/hundred.avif';
import wordHundredWebp from './words/hundred.webp';
import wordHundredAvif160 from './words/hundred-160.avif';
import wordHundredWebp160 from './words/hundred-160.webp';
import wordPotatoAvif from './words/potato.avif';
import wordPotatoWebp from './words/potato.webp';
import wordPotatoAvif160 from './words/potato-160.avif';
import wordPotatoWebp160 from './words/potato-160.webp';
import wordTomatoAvif from './words/tomato.avif';
import wordTomatoWebp from './words/tomato.webp';
import wordTomatoAvif160 from './words/tomato-160.avif';
import wordTomatoWebp160 from './words/tomato-160.webp';
import wordOnionAvif from './words/onion.avif';
import wordOnionWebp from './words/onion.webp';
import wordOnionAvif160 from './words/onion-160.avif';
import wordOnionWebp160 from './words/onion-160.webp';
import wordGarlicAvif from './words/garlic.avif';
import wordGarlicWebp from './words/garlic.webp';
import wordGarlicAvif160 from './words/garlic-160.avif';
import wordGarlicWebp160 from './words/garlic-160.webp';
import wordCarrotAvif from './words/carrot.avif';
import wordCarrotWebp from './words/carrot.webp';
import wordCarrotAvif160 from './words/carrot-160.avif';
import wordCarrotWebp160 from './words/carrot-160.webp';
import wordCucumberAvif from './words/cucumber.avif';
import wordCucumberWebp from './words/cucumber.webp';
import wordCucumberAvif160 from './words/cucumber-160.avif';
import wordCucumberWebp160 from './words/cucumber-160.webp';
import wordCabbageAvif from './words/cabbage.avif';
import wordCabbageWebp from './words/cabbage.webp';
import wordCabbageAvif160 from './words/cabbage-160.avif';
import wordCabbageWebp160 from './words/cabbage-160.webp';
import wordCauliflowerAvif from './words/cauliflower.avif';
import wordCauliflowerWebp from './words/cauliflower.webp';
import wordCauliflowerAvif160 from './words/cauliflower-160.avif';
import wordCauliflowerWebp160 from './words/cauliflower-160.webp';
import wordBroccoliAvif from './words/broccoli.avif';
import wordBroccoliWebp from './words/broccoli.webp';
import wordBroccoliAvif160 from './words/broccoli-160.avif';
import wordBroccoliWebp160 from './words/broccoli-160.webp';
import wordSpinachAvif from './words/spinach.avif';
import wordSpinachWebp from './words/spinach.webp';
import wordSpinachAvif160 from './words/spinach-160.avif';
import wordSpinachWebp160 from './words/spinach-160.webp';
import wordMushroomAvif from './words/mushroom.avif';
import wordMushroomWebp from './words/mushroom.webp';
import wordMushroomAvif160 from './words/mushroom-160.avif';
import wordMushroomWebp160 from './words/mushroom-160.webp';
import wordRadishAvif from './words/radish.avif';
import wordRadishWebp from './words/radish.webp';
import wordRadishAvif160 from './words/radish-160.avif';
import wordRadishWebp160 from './words/radish-160.webp';
import wordBeetrootAvif from './words/beetroot.avif';
import wordBeetrootWebp from './words/beetroot.webp';
import wordBeetrootAvif160 from './words/beetroot-160.avif';
import wordBeetrootWebp160 from './words/beetroot-160.webp';
import wordPeasAvif from './words/peas.avif';
import wordPeasWebp from './words/peas.webp';
import wordPeasAvif160 from './words/peas-160.avif';
import wordPeasWebp160 from './words/peas-160.webp';
import wordGreenBeansAvif from './words/green-beans.avif';
import wordGreenBeansWebp from './words/green-beans.webp';
import wordGreenBeansAvif160 from './words/green-beans-160.avif';
import wordGreenBeansWebp160 from './words/green-beans-160.webp';
import wordChilliAvif from './words/chilli.avif';
import wordChilliWebp from './words/chilli.webp';
import wordChilliAvif160 from './words/chilli-160.avif';
import wordChilliWebp160 from './words/chilli-160.webp';
import wordRedPepperAvif from './words/red-pepper.avif';
import wordRedPepperWebp from './words/red-pepper.webp';
import wordRedPepperAvif160 from './words/red-pepper-160.avif';
import wordRedPepperWebp160 from './words/red-pepper-160.webp';
import wordBananaAvif from './words/banana.avif';
import wordBananaWebp from './words/banana.webp';
import wordBananaAvif160 from './words/banana-160.avif';
import wordBananaWebp160 from './words/banana-160.webp';
import wordGrapeAvif from './words/grape.avif';
import wordGrapeWebp from './words/grape.webp';
import wordGrapeAvif160 from './words/grape-160.avif';
import wordGrapeWebp160 from './words/grape-160.webp';
import wordMangoAvif from './words/mango.avif';
import wordMangoWebp from './words/mango.webp';
import wordMangoAvif160 from './words/mango-160.avif';
import wordMangoWebp160 from './words/mango-160.webp';
import wordLemonAvif from './words/lemon.avif';
import wordLemonWebp from './words/lemon.webp';
import wordLemonAvif160 from './words/lemon-160.avif';
import wordLemonWebp160 from './words/lemon-160.webp';
import wordWatermelonAvif from './words/watermelon.avif';
import wordWatermelonWebp from './words/watermelon.webp';
import wordWatermelonAvif160 from './words/watermelon-160.avif';
import wordWatermelonWebp160 from './words/watermelon-160.webp';
import wordMelonAvif from './words/melon.avif';
import wordMelonWebp from './words/melon.webp';
import wordMelonAvif160 from './words/melon-160.avif';
import wordMelonWebp160 from './words/melon-160.webp';
import wordPineappleAvif from './words/pineapple.avif';
import wordPineappleWebp from './words/pineapple.webp';
import wordPineappleAvif160 from './words/pineapple-160.avif';
import wordPineappleWebp160 from './words/pineapple-160.webp';
import wordPomegranateAvif from './words/pomegranate.avif';
import wordPomegranateWebp from './words/pomegranate.webp';
import wordPomegranateAvif160 from './words/pomegranate-160.avif';
import wordPomegranateWebp160 from './words/pomegranate-160.webp';
import wordFigAvif from './words/fig.avif';
import wordFigWebp from './words/fig.webp';
import wordFigAvif160 from './words/fig-160.avif';
import wordFigWebp160 from './words/fig-160.webp';
import wordFreshDatesAvif from './words/fresh-dates.avif';
import wordFreshDatesWebp from './words/fresh-dates.webp';
import wordFreshDatesAvif160 from './words/fresh-dates-160.avif';
import wordFreshDatesWebp160 from './words/fresh-dates-160.webp';
import wordPearAvif from './words/pear.avif';
import wordPearWebp from './words/pear.webp';
import wordPearAvif160 from './words/pear-160.avif';
import wordPearWebp160 from './words/pear-160.webp';
import wordCherryAvif from './words/cherry.avif';
import wordCherryWebp from './words/cherry.webp';
import wordCherryAvif160 from './words/cherry-160.avif';
import wordCherryWebp160 from './words/cherry-160.webp';
import wordStrawberryAvif from './words/strawberry.avif';
import wordStrawberryWebp from './words/strawberry.webp';
import wordStrawberryAvif160 from './words/strawberry-160.avif';
import wordStrawberryWebp160 from './words/strawberry-160.webp';
import wordBlueberryAvif from './words/blueberry.avif';
import wordBlueberryWebp from './words/blueberry.webp';
import wordBlueberryAvif160 from './words/blueberry-160.avif';
import wordBlueberryWebp160 from './words/blueberry-160.webp';
import wordBlackberryAvif from './words/blackberry.avif';
import wordBlackberryWebp from './words/blackberry.webp';
import wordBlackberryAvif160 from './words/blackberry-160.avif';
import wordBlackberryWebp160 from './words/blackberry-160.webp';
import wordRaspberryAvif from './words/raspberry.avif';
import wordRaspberryWebp from './words/raspberry.webp';
import wordRaspberryAvif160 from './words/raspberry-160.avif';
import wordRaspberryWebp160 from './words/raspberry-160.webp';
import wordKiwiFruitAvif from './words/kiwi-fruit.avif';
import wordKiwiFruitWebp from './words/kiwi-fruit.webp';
import wordKiwiFruitAvif160 from './words/kiwi-fruit-160.avif';
import wordKiwiFruitWebp160 from './words/kiwi-fruit-160.webp';
import wordGuavaAvif from './words/guava.avif';
import wordGuavaWebp from './words/guava.webp';
import wordGuavaAvif160 from './words/guava-160.avif';
import wordGuavaWebp160 from './words/guava-160.webp';

// UI state illustrations — flat SVG, themeable through CSS custom properties.
import emptySearchSrc from './illustrations/empty-search.svg';
import emptyBookmarksSrc from './illustrations/empty-bookmarks.svg';
import emptyProgressSrc from './illustrations/empty-progress.svg';
import errorGenericSrc from './illustrations/error-generic.svg';
import offlineSrc from './illustrations/offline.svg';
import notFoundSrc from './illustrations/not-found-404.svg';
import quizCompleteSrc from './illustrations/quiz-complete.svg';

// Decorative flourishes — purely presentational.
import leafFlourishSrc from './decorative/leaf-flourish.svg';
import quoteBlobSrc from './decorative/quote-blob.svg';
import heroGradientOverlaySrc from './decorative/hero-gradient-overlay.svg';
import patternTileSrc from './decorative/pattern-tile.svg';

// Quiz feedback cues — 16-bit mono WAV, generated by ./sounds/generate-sounds.mjs.
import correctSrc from './sounds/correct.wav';
import incorrectSrc from './sounds/incorrect.wav';
import completeSrc from './sounds/complete.wav';

/** A `srcset`-ready set of candidate strings, one per source type. */
export interface ResponsiveSources {
  readonly avif?: string;
  readonly webp: string;
  readonly fallback?: string;
}

/** A raster image with its modern and fallback encodings plus display metadata. */
export interface ImageAsset {
  /** AVIF URL — smallest, offer first in a `<picture>`. */
  readonly avif?: string;
  /** WebP URL — universally supported baseline. */
  readonly webp: string;
  /** JPEG/PNG URL for very old clients. */
  readonly fallback?: string;
  readonly width: number;
  readonly height: number;
  /** Base64 `data:` URI of a 8-16px blurred copy, for instant paint. */
  readonly lqip?: string;
  readonly alt: string;
  /** Present when the asset ships at more than one width. */
  readonly srcSet?: ResponsiveSources;
  /** `true` when the image adds no information and `alt` is intentionally empty. */
  readonly decorative?: boolean;
}

/** A vector asset. `width`/`height` are the intrinsic viewBox dimensions. */
export interface VectorAsset {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
  readonly decorative?: boolean;
}

/** A short interaction cue. */
export interface SoundAsset {
  readonly src: string;
  /** Accessible description, for announcing the cue in a live region. */
  readonly label: string;
  readonly durationMs: number;
}

/* -------------------------------------------------------------- brand --- */

export const brand = {
  logoMark: { src: logoMarkSrc, width: 48, height: 48, alt: 'Lisan' },
  logoLockup: {
    src: logoLockupSrc,
    width: 203,
    height: 48,
    alt: 'Lisan — Learn Arabic, Grow Closer',
  },
  logoMono: { src: logoMonoSrc, width: 48, height: 48, alt: 'Lisan' },
} as const satisfies Record<string, VectorAsset>;

/**
 * Files served verbatim from `public/brand/`. These deliberately bypass Vite
 * hashing: `index.html`, the web app manifest and social scrapers need URLs
 * that never change.
 */
export const brandUrls = {
  faviconSvg: '/brand/favicon.svg',
  faviconIco: '/brand/favicon.ico',
  favicon32: '/brand/favicon-32.png',
  favicon16: '/brand/favicon-16.png',
  appleTouchIcon: '/brand/apple-touch-icon.png',
  pwa192: '/brand/pwa-192.png',
  pwa512: '/brand/pwa-512.png',
  pwaMaskable512: '/brand/pwa-maskable-512.png',
  ogImage: '/brand/og-image.png',
} as const;

/* --------------------------------------------------------------- hero --- */

export const hero: ImageAsset = {
  avif: heroAvif1600,
  webp: heroWebp1600,
  fallback: heroJpg1600,
  width: 1600,
  height: 900,
  lqip: 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAACwAQCdASoQAAkABABsJbACdAENRdygAP7niA+6/enSQUFAar3ZB4hN3sM+mhHynY58jl7powAAAA==',
  alt: 'A grand mosque with blue domes and minarets at golden hour, framed by palm trees above a calm bay with a distant city skyline',
  srcSet: {
    avif: `${heroAvif960} 960w, ${heroAvif1600} 1600w`,
    webp: `${heroWebp960} 960w, ${heroWebp1600} 1600w`,
    fallback: `${heroJpg1600} 1600w`,
  },
};

/* ----------------------------------------------------------- category --- */

/** Category ids that have real artwork. Anything absent falls back in code. */
export const categoryArtIds = [
  'basics',
  'numbers',
  'time',
  'family-people',
  'food-dining',
  'home-rooms',
  'shopping-money',
  'transport-travel',
  'daily-life',
  'verbs',
  'adjectives',
  'school-education',
  'work-professions',
  'nature-animals',
  'health-body',
  'technology-media',
  'abstract-academic',
  'expressions-idioms',
  'vegetables',
  'fruit',
] as const;

export type CategoryArtId = (typeof categoryArtIds)[number];

export const categoryArt: Partial<Record<string, ImageAsset>> = {
  basics: {
    avif: catBasicsAvif,
    webp: catBasicsWebp,
    width: 256,
    height: 256,
    lqip: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADQAQCdASoIAAgABABsJagCdAD0ebhVAAD+7d3UyWlpLCwqEMEqZeBkn6ms6AAA',
    alt: 'An open waving hand beside a speech bubble',
    srcSet: {
      avif: `${catBasicsAvif128} 128w, ${catBasicsAvif} 256w`,
      webp: `${catBasicsWebp128} 128w, ${catBasicsWebp} 256w`,
    },
  },
  numbers: {
    avif: catNumbersAvif,
    webp: catNumbersWebp,
    width: 256,
    height: 256,
    lqip: 'data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAAAwAgCdASoQABAAA4BaJbACdGaAAwB6fK51AAD+9NwB5G3lfqCwsZ04xvXHLcq2yOFuRABUlmjrpDRubbKTxz254ND3iu2/C0kzp3ihaaWdqRdbRDmBAAAA',
    alt: 'A tile with the digits one, two, three and four',
    srcSet: {
      avif: `${catNumbersAvif128} 128w, ${catNumbersAvif} 256w`,
      webp: `${catNumbersWebp128} 128w, ${catNumbersWebp} 256w`,
    },
  },
  time: {
    avif: catTimeAvif,
    webp: catTimeWebp,
    width: 256,
    height: 256,
    lqip: 'data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAAAwAgCdASoQABAAA4BaJbACdAYqNvtF+m3coAD+9wRpnC5HqnbkbtdkY/RFle+oHuFUf0M7hd20KnKVXmlvkkf050WDhynph7J8NS1BCKbNRJQPVqA/xaaIAAA=',
    alt: 'A round red alarm clock',
    srcSet: {
      avif: `${catTimeAvif128} 128w, ${catTimeAvif} 256w`,
      webp: `${catTimeWebp128} 128w, ${catTimeWebp} 256w`,
    },
  },
  'family-people': {
    avif: catFamilyPeopleAvif,
    webp: catFamilyPeopleWebp,
    width: 256,
    height: 256,
    lqip: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACwAQCdASoIAAgABABsJagCdAD0bn6gAP7n7AKqKjrucySzMomPRpqVorKxQAAA',
    alt: 'A family of three standing together',
    srcSet: {
      avif: `${catFamilyPeopleAvif128} 128w, ${catFamilyPeopleAvif} 256w`,
      webp: `${catFamilyPeopleWebp128} 128w, ${catFamilyPeopleWebp} 256w`,
    },
  },
  'food-dining': {
    avif: catFoodDiningAvif,
    webp: catFoodDiningWebp,
    width: 256,
    height: 256,
    lqip: 'data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADQAQCdASoIAAgABABsJbACdADze8J1AAD+15N3GJqLgLJGhnBKlbnr6dn39m/dE0wNftZgAAA=',
    alt: 'A bowl of fresh vegetables beside flatbread',
    srcSet: {
      avif: `${catFoodDiningAvif128} 128w, ${catFoodDiningAvif} 256w`,
      webp: `${catFoodDiningWebp128} 128w, ${catFoodDiningWebp} 256w`,
    },
  },
  'home-rooms': {
    avif: catHomeRoomsAvif,
    webp: catHomeRoomsWebp,
    width: 256,
    height: 256,
    lqip: 'data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAABwAQCdASoIAAgABABsJZACdAFAAAD+7mv5eBt7lvsiC6jhNDjCMNWwAAA=',
    alt: 'A house with a blue roof and garden shrubs',
    srcSet: {
      avif: `${catHomeRoomsAvif128} 128w, ${catHomeRoomsAvif} 256w`,
      webp: `${catHomeRoomsWebp128} 128w, ${catHomeRoomsWebp} 256w`,
    },
  },
  'shopping-money': {
    avif: catShoppingMoneyAvif,
    webp: catShoppingMoneyWebp,
    width: 256,
    height: 256,
    lqip: 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAACwAQCdASoIAAgABABsJZgCdAD0ebYEAP7iUkJnE2aR1j73zxjoADSkR172R6B9m4cWNiRXqAAAAA==',
    alt: 'A shopping bag beside stacked coins and a banknote',
    srcSet: {
      avif: `${catShoppingMoneyAvif128} 128w, ${catShoppingMoneyAvif} 256w`,
      webp: `${catShoppingMoneyWebp128} 128w, ${catShoppingMoneyWebp} 256w`,
    },
  },
  'transport-travel': {
    avif: catTransportTravelAvif,
    webp: catTransportTravelWebp,
    width: 256,
    height: 256,
    lqip: 'data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAADwAQCdASoIAAgABABsJagCdH8AGAdpXQAA/ucTWXOVFqI1HFtqNmVTteHDSB9qkxAAAA==',
    alt: 'A suitcase with an aeroplane flying overhead',
    srcSet: {
      avif: `${catTransportTravelAvif128} 128w, ${catTransportTravelAvif} 256w`,
      webp: `${catTransportTravelWebp128} 128w, ${catTransportTravelWebp} 256w`,
    },
  },
  'daily-life': {
    avif: catDailyLifeAvif,
    webp: catDailyLifeWebp,
    width: 256,
    height: 256,
    lqip: 'data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADwAQCdASoIAAgABABsJbACdAD0uMHBGAAA/u1hbh5qBcFBKU6P+2EMEQQCL5TgAAA=',
    alt: 'A steaming mug beside a toothbrush in a cup',
    srcSet: {
      avif: `${catDailyLifeAvif128} 128w, ${catDailyLifeAvif} 256w`,
      webp: `${catDailyLifeWebp128} 128w, ${catDailyLifeWebp} 256w`,
    },
  },
  verbs: {
    avif: catVerbsAvif,
    webp: catVerbsWebp,
    width: 256,
    height: 256,
    lqip: 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAABwAQCdASoIAAgABABsJbACdAFAAAD+7vkY7Bqn/63CxtCcdE3qFwiWxtj2fxPchaiT5QAA',
    alt: 'A person running, with motion lines behind them',
    srcSet: {
      avif: `${catVerbsAvif128} 128w, ${catVerbsAvif} 256w`,
      webp: `${catVerbsWebp128} 128w, ${catVerbsWebp} 256w`,
    },
  },
  adjectives: {
    avif: catAdjectivesAvif,
    webp: catAdjectivesWebp,
    width: 256,
    height: 256,
    lqip: 'data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAACwAQCdASoIAAgABABsJQBOgCHe8Uv4AP7gnl59dJHXATQY/qGwhVec0YAAAA==',
    alt: 'An artist’s palette with a brush and blobs of paint',
    srcSet: {
      avif: `${catAdjectivesAvif128} 128w, ${catAdjectivesAvif} 256w`,
      webp: `${catAdjectivesWebp128} 128w, ${catAdjectivesWebp} 256w`,
    },
  },
  'school-education': {
    avif: catSchoolEducationAvif,
    webp: catSchoolEducationWebp,
    width: 256,
    height: 256,
    lqip: 'data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAACwAQCdASoIAAgABABsJYgCdADyfvaAAP6breKuzIeKJalMS/+MwdkYli50OJHuT9EYAA==',
    alt: 'A graduation cap resting on a stack of books with a pencil',
    srcSet: {
      avif: `${catSchoolEducationAvif128} 128w, ${catSchoolEducationAvif} 256w`,
      webp: `${catSchoolEducationWebp128} 128w, ${catSchoolEducationWebp} 256w`,
    },
  },
  'work-professions': {
    avif: catWorkProfessionsAvif,
    webp: catWorkProfessionsWebp,
    width: 256,
    height: 256,
    lqip: 'data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADQAQCdASoIAAgABABsJbACdAD0sRa7gAD+tCqb3P4SR7TQJXnov195cEbVzysgwOIpWrMIAAA=',
    alt: 'A leather briefcase beside a hard hat',
    srcSet: {
      avif: `${catWorkProfessionsAvif128} 128w, ${catWorkProfessionsAvif} 256w`,
      webp: `${catWorkProfessionsWebp128} 128w, ${catWorkProfessionsWebp} 256w`,
    },
  },
  'nature-animals': {
    avif: catNatureAnimalsAvif,
    webp: catNatureAnimalsWebp,
    width: 256,
    height: 256,
    lqip: 'data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAABwAQCdASoIAAgABABsJYgCdAFAAAD+70vmT4vHXSPL5G6LWi+IglZQCf9pGroAAAA=',
    alt: 'A mountain lake landscape with trees and a clear sky',
    srcSet: {
      avif: `${catNatureAnimalsAvif128} 128w, ${catNatureAnimalsAvif} 256w`,
      webp: `${catNatureAnimalsWebp128} 128w, ${catNatureAnimalsWebp} 256w`,
    },
  },
  'health-body': {
    avif: catHealthBodyAvif,
    webp: catHealthBodyWebp,
    width: 256,
    height: 256,
    lqip: 'data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAACwAQCdASoIAAgABABsJZgCdAEO/gLsAP7gyzpmhSyVsf4g9dPuKRaTKoAAAA==',
    alt: 'A heart wrapped in a stethoscope',
    srcSet: {
      avif: `${catHealthBodyAvif128} 128w, ${catHealthBodyAvif} 256w`,
      webp: `${catHealthBodyWebp128} 128w, ${catHealthBodyWebp} 256w`,
    },
  },
  'technology-media': {
    avif: catTechnologyMediaAvif,
    webp: catTechnologyMediaWebp,
    width: 256,
    height: 256,
    lqip: 'data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADQAQCdASoIAAgABABsJQBOgCB/QsY3QAD+aLj3u2udD4G9FwaxzSBxWTvR65OAAAA=',
    alt: 'A laptop and phone with a wireless signal',
    srcSet: {
      avif: `${catTechnologyMediaAvif128} 128w, ${catTechnologyMediaAvif} 256w`,
      webp: `${catTechnologyMediaWebp128} 128w, ${catTechnologyMediaWebp} 256w`,
    },
  },
  'abstract-academic': {
    avif: catAbstractAcademicAvif,
    webp: catAbstractAcademicWebp,
    width: 256,
    height: 256,
    lqip: 'data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAABQAQCdASoIAAgABABsJQBOgC6gAP7v9s9VN7QrtRUQFV3uJo2IAA==',
    alt: 'A glowing lightbulb surrounded by floating geometric shapes',
    srcSet: {
      avif: `${catAbstractAcademicAvif128} 128w, ${catAbstractAcademicAvif} 256w`,
      webp: `${catAbstractAcademicWebp128} 128w, ${catAbstractAcademicWebp} 256w`,
    },
  },
  'expressions-idioms': {
    avif: catExpressionsIdiomsAvif,
    webp: catExpressionsIdiomsWebp,
    width: 256,
    height: 256,
    lqip: 'data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAAAQAgCdASoIAAgABABsJZgCdEf/gbhk6PYAAP7h64PnyTMZJWoc/EZLJyPS6EI3B5Vhqs0rkI/mrSwA',
    alt: 'Two overlapping speech bubbles',
    srcSet: {
      avif: `${catExpressionsIdiomsAvif128} 128w, ${catExpressionsIdiomsAvif} 256w`,
      webp: `${catExpressionsIdiomsWebp128} 128w, ${catExpressionsIdiomsWebp} 256w`,
    },
  },
  vegetables: {
    avif: catVegetablesAvif,
    webp: catVegetablesWebp,
    width: 256,
    height: 256,
    lqip: 'data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAAAwAgCdASoQABAAA4BaJbACdAEPAFsmp9rlQAD+9gL+7XjNAOMH1jwt4egOPsddZYxrPl98mHyknQiVB3CpUYWrzTBlOuXh9puVe2yvZBCmNYv1sBzZCi94x7z3M5A6zAAAAA==',
    alt: 'A carrot and a tomato side by side',
    srcSet: {
      avif: `${catVegetablesAvif128} 128w, ${catVegetablesAvif} 256w`,
      webp: `${catVegetablesWebp128} 128w, ${catVegetablesWebp} 256w`,
    },
  },
  fruit: {
    avif: catFruitAvif,
    webp: catFruitWebp,
    width: 256,
    height: 256,
    lqip: 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAwAgCdASoQABAAA4BaJbACdAEO+53Hku3RCAD+9gT1sIrwWw439PE5aTsn/y9xmChoXPj6zw14onVahjZnh3oIb5WCWcrpes1kTf4JFt9DsoWwwAA=',
    alt: 'A banana and a strawberry side by side',
    srcSet: {
      avif: `${catFruitAvif128} 128w, ${catFruitAvif} 256w`,
      webp: `${catFruitWebp128} 128w, ${catFruitWebp} 256w`,
    },
  },
};

/* --------------------------------------------------------------- word --- */

/** Word ids that have real artwork. Anything absent falls back in code. */
export const wordArtIds = [
  'country',
  'engineer',
  'teacher',
  'doctor',
  'student',
  'computer',
  'nurse',
  'apple',
  'mother',
  'father',
  'brother',
  'sister',
  'house',
  'door',
  'chair',
  'book',
  'water',
  'bread',
  'milk',
  'tea',
  'car',
  'cat',
  'bird',
  'tree',
  'sun',
  'moon',
  'coffee',
  'rice',
  'meat',
  'chicken',
  'fish',
  'egg',
  'cheese',
  'salt',
  'restaurant',
  'orange',
  'window',
  'bed',
  'key',
  'mirror',
  'bathroom',
  'man',
  'woman',
  'person',
  'question',
  'yes',
  'no',
  'name',
  'language',
  'soap',
  'alarm-clock',
  'shirt',
  'to-sleep',
  'to-shower',
  'to-cook',
  'to-clean',
  'appointment',
  'child',
  'boy',
  'girl',
  'grandfather',
  'grandmother',
  'eye',
  'leg',
  'mouth',
  'ear',
  'nose',
  'tooth',
  'hospital',
  'hand',
  'heart',
  'medicine',
  'blood',
  'mountain',
  'lion',
  'dog',
  'horse',
  'camel',
  'desert',
  'sea',
  'flower',
  'rain',
  'wind',
  'one',
  'two',
  'three',
  'four',
  'five',
  'ten',
  'morning',
  'school',
  'notebook',
  'pen',
  'university',
  'library',
  'dictionary',
  'paper',
  'bank',
  'shop',
  'money',
  'bill',
  'gift',
  'bag',
  'keyboard',
  'television',
  'radio',
  'newspaper',
  'camera',
  'printer',
  'phone',
  'email',
  'file',
  'bus',
  'train',
  'station',
  'ticket',
  'hotel',
  'luggage',
  'plane',
  'road',
  'city',
  'passport',
  'trip',
  'map',
  'beach',
  'to-write',
  'to-read',
  'to-speak',
  'to-drink',
  'to-eat',
  'to-play',
  'to-help',
  'to-work',
  'to-see',
  'to-open',
  'farmer',
  'cook',
  'thank-you',
  'sorry',
  'to-wear',
  'shoes',
  'holiday',
  'pain',
  'illness',
  'number',
  'month',
  'hour',
  'minute',
  'time',
  'night',
  'pupil',
  'professor',
  'certificate',
  'knowledge',
  'market',
  'price',
  'expensive',
  'to-buy',
  'clothes',
  'program',
  'lawyer',
  'happy',
  'hot',
  'sad',
  'strong',
  'hair',
  'head',
  'health',
  'hello',
  'good-evening',
  'congratulations',
  'week',
  'exam',
  'internet',
  'project',
  'screen',
  'journalist',
  'office',
  'cold',
  'delicious',
  'slow',
  'garden',
  'breakfast',
  'classroom',
  'daughter',
  'driver',
  'goal',
  'employee',
  'friend',
  'food',
  'fruit',
  'fast',
  'family',
  'discount',
  'development',
  'homework',
  'idea',
  'freedom',
  'justice',
  'truth',
  'research',
  'society',
  'culture',
  'history',
  'philosophy',
  'theory',
  'experience',
  'responsibility',
  'meaning',
  'analysis',
  'beautiful',
  'clean',
  'goodbye',
  'please',
  'word',
  'answer',
  'to-wake-up',
  'habit',
  'to-go-out',
  'to-return',
  'welcome',
  'excuse-me',
  'good-morning',
  'how-are-you',
  'no-problem',
  'of-course',
  'little-by-little',
  'patience-is-the-key',
  'whoever-strives-finds',
  'time-is-gold',
  'as-you-sow-so-you-reap',
  'son',
  'husband',
  'wife',
  'neighbor',
  'vegetables',
  'kitchen',
  'table',
  'apartment',
  'lamp',
  'sky',
  'river',
  'day',
  'year',
  'lesson',
  'blackboard',
  'to-sell',
  'customer',
  'website',
  'network',
  'application',
  'news',
  'airport',
  'to-listen',
  'to-go',
  'to-learn',
  'to-teach',
  'to-travel',
  'to-ask',
  'merchant',
  'manager',
  'work',
  'salary',
  'big',
  'room',
  'sugar',
  'uncle',
  'wall',
  'tall',
  'six',
  'seven',
  'eight',
  'nine',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
  'hundred',
  'potato',
  'tomato',
  'onion',
  'garlic',
  'carrot',
  'cucumber',
  'cabbage',
  'cauliflower',
  'broccoli',
  'spinach',
  'mushroom',
  'radish',
  'beetroot',
  'peas',
  'green-beans',
  'chilli',
  'red-pepper',
  'banana',
  'grape',
  'mango',
  'lemon',
  'watermelon',
  'melon',
  'pineapple',
  'pomegranate',
  'fig',
  'fresh-dates',
  'pear',
  'cherry',
  'strawberry',
  'blueberry',
  'blackberry',
  'raspberry',
  'kiwi-fruit',
  'guava',
] as const;

export type WordArtId = (typeof wordArtIds)[number];

export const wordArt: Partial<Record<string, ImageAsset>> = {
  engineer: {
    avif: wordEngineerAvif,
    webp: wordEngineerWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAADwAQCdASoIAAYABABsJZgCdIExGA7pnAAA/uHN2Bv7yjhoofWSRgyTRFe/ZldOPQAAAA==',
    alt: 'An engineer in a hard hat and hi-vis vest holding rolled blueprints at a construction site',
    srcSet: {
      avif: `${wordEngineerAvif160} 160w, ${wordEngineerAvif} 320w`,
      webp: `${wordEngineerWebp160} 160w, ${wordEngineerWebp} 320w`,
    },
  },
  teacher: {
    avif: wordTeacherAvif,
    webp: wordTeacherWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAACwAQCdASoIAAYABABsJbACdAD52ZqAAP54lf7qxjdtBS8veCnNDy4YMpoDgczL1ahjTAAA',
    alt: 'A teacher standing at a green chalkboard holding a pointer',
    srcSet: {
      avif: `${wordTeacherAvif160} 160w, ${wordTeacherAvif} 320w`,
      webp: `${wordTeacherWebp160} 160w, ${wordTeacherWebp} 320w`,
    },
  },
  doctor: {
    avif: wordDoctorAvif,
    webp: wordDoctorWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADQAQCdASoIAAYABABsJZACdAD0bhXGAAD+11WCG8mfixn0YYjogHStuKiCL98tQAA=',
    alt: 'A doctor in a white coat wearing a stethoscope',
    srcSet: {
      avif: `${wordDoctorAvif160} 160w, ${wordDoctorAvif} 320w`,
      webp: `${wordDoctorWebp160} 160w, ${wordDoctorWebp} 320w`,
    },
  },
  student: {
    avif: wordStudentAvif,
    webp: wordStudentWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADQAQCdASoIAAYABABsJagCdAD0QoEnIAD+ynbN7Emsp63cmWQ2ToGfg8OWuV0AAAA=',
    alt: 'A student carrying a backpack and books outside a school',
    srcSet: {
      avif: `${wordStudentAvif160} 160w, ${wordStudentAvif} 320w`,
      webp: `${wordStudentWebp160} 160w, ${wordStudentWebp} 320w`,
    },
  },
  computer: {
    avif: wordComputerAvif,
    webp: wordComputerWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAADQAQCdASoIAAYABABsJZgCdAD0SRcpAAD2u+QDgviceHEzrm2Sr9NlqDAkQdpEXzYgAA==',
    alt: 'A desktop computer monitor on a stand',
    srcSet: {
      avif: `${wordComputerAvif160} 160w, ${wordComputerAvif} 320w`,
      webp: `${wordComputerWebp160} 160w, ${wordComputerWebp} 320w`,
    },
  },
  nurse: {
    avif: wordNurseAvif,
    webp: wordNurseWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADQAQCdASoIAAYABABsJagCdADdIye/AAD+12sVcC4Ixw8tBYxlr0L0AdKSO44vQAA=',
    alt: 'A nurse in scrubs and a nurse’s cap holding a clipboard',
    srcSet: {
      avif: `${wordNurseAvif160} 160w, ${wordNurseAvif} 320w`,
      webp: `${wordNurseWebp160} 160w, ${wordNurseWebp} 320w`,
    },
  },
  apple: {
    avif: wordAppleAvif,
    webp: wordAppleWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADQAQCdASoIAAYABABsJbACdADdL/VwqAD+4lJha5dhA297Tpo31hx85bDCcjEdbfSNRbt1ruAAAA==',
    alt: 'A single red apple with a green leaf',
    srcSet: {
      avif: `${wordAppleAvif160} 160w, ${wordAppleAvif} 320w`,
      webp: `${wordAppleWebp160} 160w, ${wordAppleWebp} 320w`,
    },
  },
  mother: {
    avif: wordMotherAvif,
    webp: wordMotherWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADwAQCdASoIAAYABABsJYwCdEf/gbTusoAA/rgGpmMQlIn+f0J1IngNF8RizE5YRCFSuAAA',
    alt: 'A mother holding her young child',
    srcSet: {
      avif: `${wordMotherAvif160} 160w, ${wordMotherAvif} 320w`,
      webp: `${wordMotherWebp160} 160w, ${wordMotherWebp} 320w`,
    },
  },
  father: {
    avif: wordFatherAvif,
    webp: wordFatherWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADQAQCdASoIAAYABABsJQBdgB6XdNTEAAD+4ku/sPwRgpnle6n6vpFggMmCMsCCAAA=',
    alt: 'A smiling father in a navy shirt',
    srcSet: {
      avif: `${wordFatherAvif160} 160w, ${wordFatherAvif} 320w`,
      webp: `${wordFatherWebp160} 160w, ${wordFatherWebp} 320w`,
    },
  },
  brother: {
    avif: wordBrotherAvif,
    webp: wordBrotherWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADQAQCdASoIAAYABABsJYgCdAEf/uZOEAD+64A03MnmECsNcvmDxhJXjrKIaXSCKAA=',
    alt: 'A young boy in a blue t-shirt waving',
    srcSet: {
      avif: `${wordBrotherAvif160} 160w, ${wordBrotherAvif} 320w`,
      webp: `${wordBrotherWebp160} 160w, ${wordBrotherWebp} 320w`,
    },
  },
  sister: {
    avif: wordSisterAvif,
    webp: wordSisterWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADwAQCdASoIAAYABABsJYgCdIExFco5GoAA/uiMoboRaya7J6GjBudjSTnNAAAA',
    alt: 'A young girl with a ponytail hugging a book',
    srcSet: {
      avif: `${wordSisterAvif160} 160w, ${wordSisterAvif} 320w`,
      webp: `${wordSisterWebp160} 160w, ${wordSisterWebp} 320w`,
    },
  },
  house: {
    avif: wordHouseAvif,
    webp: wordHouseWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAACwAQCdASoIAAYABABsJagAAucXyeTQAP7t1c2B1HHLXX9/Co6MUPSnuAA=',
    alt: 'A house with a terracotta roof, blue front door and a garden path',
    srcSet: {
      avif: `${wordHouseAvif160} 160w, ${wordHouseAvif} 320w`,
      webp: `${wordHouseWebp160} 160w, ${wordHouseWebp} 320w`,
    },
  },
  door: {
    avif: wordDoorAvif,
    webp: wordDoorWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACwAQCdASoIAAYABABsJQBOgB6R/nrwAP7rgDTzP02wxRjw6IbfAdYsWtAngAAA',
    alt: 'A blue arched panel door in a cream frame',
    srcSet: {
      avif: `${wordDoorAvif160} 160w, ${wordDoorAvif} 320w`,
      webp: `${wordDoorWebp160} 160w, ${wordDoorWebp} 320w`,
    },
  },
  chair: {
    avif: wordChairAvif,
    webp: wordChairWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAACQAQCdASoIAAYABABsJQBOgB4/EIgA/u3WATXXy1hJrlbYkGpee74YAAA=',
    alt: 'A wooden chair with a blue upholstered seat',
    srcSet: {
      avif: `${wordChairAvif160} 160w, ${wordChairAvif} 320w`,
      webp: `${wordChairWebp160} 160w, ${wordChairWebp} 320w`,
    },
  },
  book: {
    avif: wordBookAvif,
    webp: wordBookWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRi4AAABXRUJQVlA4ICIAAABwAQCdASoIAAYABABsJYwC7AFAAAD+8K0Os1ENlIBegAAA',
    alt: 'An open book with a blue cover and a ribbon bookmark',
    srcSet: {
      avif: `${wordBookAvif160} 160w, ${wordBookAvif} 320w`,
      webp: `${wordBookWebp160} 160w, ${wordBookWebp} 320w`,
    },
  },
  water: {
    avif: wordWaterAvif,
    webp: wordWaterWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjAAAABXRUJQVlA4ICQAAAAwAQCdASoIAAYABABsJYwAA3AA/vDmSiZWwU3wqA54QH54AAA=',
    alt: 'A glass of clear water with a droplet beside it',
    srcSet: {
      avif: `${wordWaterAvif160} 160w, ${wordWaterAvif} 320w`,
      webp: `${wordWaterWebp160} 160w, ${wordWaterWebp} 320w`,
    },
  },
  bread: {
    avif: wordBreadAvif,
    webp: wordBreadWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAQCdASoIAAYABABsJZACdAD0U4W0AAD+64VX6K7xOQiY6OxJyMpDAlfDoYYg6aeFzAAA',
    alt: 'A golden loaf of bread with a cut slice and wheat grains',
    srcSet: {
      avif: `${wordBreadAvif160} 160w, ${wordBreadAvif} 320w`,
      webp: `${wordBreadWebp160} 160w, ${wordBreadWebp} 320w`,
    },
  },
  milk: {
    avif: wordMilkAvif,
    webp: wordMilkWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAAAwAQCdASoIAAYABABsJQAAbgAA/vCYgiDsnMuagHh97S7kMEotSHWQOAA=',
    alt: 'A glass of milk beside a milk bottle',
    srcSet: {
      avif: `${wordMilkAvif160} 160w, ${wordMilkAvif} 320w`,
      webp: `${wordMilkWebp160} 160w, ${wordMilkWebp} 320w`,
    },
  },
  tea: {
    avif: wordTeaAvif,
    webp: wordTeaWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAADQAQCdASoIAAYABABsJYgCdAEPAKlUgAD+7WvZ9kRSfeN3U99uyCBFqAA=',
    alt: 'A glass of amber tea on a saucer with fresh mint',
    srcSet: {
      avif: `${wordTeaAvif160} 160w, ${wordTeaAvif} 320w`,
      webp: `${wordTeaWebp160} 160w, ${wordTeaWebp} 320w`,
    },
  },
  car: {
    avif: wordCarAvif,
    webp: wordCarWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAADwAQCdASoIAAYABABsJYwCdIExGBqPToAA/u3rZU0mCQO2qQETfwRyIMpAAA==',
    alt: 'A small blue car on a road',
    srcSet: {
      avif: `${wordCarAvif160} 160w, ${wordCarAvif} 320w`,
      webp: `${wordCarWebp160} 160w, ${wordCarWebp} 320w`,
    },
  },
  cat: {
    avif: wordCatAvif,
    webp: wordCatWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAADQAQCdASoIAAYABABsJQBOgB6WiKoMAAD+8AqQuBpGifXOSNLp0V82AAA=',
    alt: 'A ginger and cream cat sitting with its tail curled',
    srcSet: {
      avif: `${wordCatAvif160} 160w, ${wordCatAvif} 320w`,
      webp: `${wordCatWebp160} 160w, ${wordCatWebp} 320w`,
    },
  },
  bird: {
    avif: wordBirdAvif,
    webp: wordBirdWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAADQAQCdASoIAAYABABsJQBOgCPtrMJDuAD+7dXw34c+XSdLYGkZMhwA',
    alt: 'A small blue songbird perched on a leafy twig',
    srcSet: {
      avif: `${wordBirdAvif160} 160w, ${wordBirdAvif} 320w`,
      webp: `${wordBirdWebp160} 160w, ${wordBirdWebp} 320w`,
    },
  },
  tree: {
    avif: wordTreeAvif,
    webp: wordTreeWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADQAQCdASoIAAYABABsJQBOgCP7k+JjgAD+6I/JtdmUU33KpT6lCjmodjS6v1e0oAA=',
    alt: 'A broad green tree on a grassy mound',
    srcSet: {
      avif: `${wordTreeAvif160} 160w, ${wordTreeAvif} 320w`,
      webp: `${wordTreeWebp160} 160w, ${wordTreeWebp} 320w`,
    },
  },
  sun: {
    avif: wordSunAvif,
    webp: wordSunWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAABQAQCdASoIAAYABABsJQBOgCgAAP7wvZIuP6C/C4saPxH/ElygAA==',
    alt: 'A golden sun with rays behind a small white cloud',
    srcSet: {
      avif: `${wordSunAvif160} 160w, ${wordSunAvif} 320w`,
      webp: `${wordSunWebp160} 160w, ${wordSunWebp} 320w`,
    },
  },
  moon: {
    avif: wordMoonAvif,
    webp: wordMoonWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjAAAABXRUJQVlA4ICQAAACwAQCdASoIAAYABABsJQBOgCHfwHkAAP7v/WLTum1l9aA0AAA=',
    alt: 'A crescent moon with small stars and a cloud',
    srcSet: {
      avif: `${wordMoonAvif160} 160w, ${wordMoonAvif} 320w`,
      webp: `${wordMoonWebp160} 160w, ${wordMoonWebp} 320w`,
    },
  },
  coffee: {
    avif: wordCoffeeAvif,
    webp: wordCoffeeWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADQAQCdASoQAAwAA4BaJbACdADF69GvgAD+9N/Z8PxfvsHeR/djHG/VDfZI5aRfbW7NQxx4/i7mvNGO/EhN9JaAAAA=',
    alt: 'A cup of coffee on a saucer',
    srcSet: {
      avif: `${wordCoffeeAvif160} 160w, ${wordCoffeeAvif} 320w`,
      webp: `${wordCoffeeWebp160} 160w, ${wordCoffeeWebp} 320w`,
    },
  },
  rice: {
    avif: wordRiceAvif,
    webp: wordRiceWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADwAQCdASoQAAwAA4BaJQBdgCFr++BkrgAA/vYQ2FSW6x0FQQRm50fKlPVrY/KMeLri1y3CMiGwwo2lpmt/zjWGEBd2Pj9Zkn+Z+VEFIVYgAA==',
    alt: 'A bowl of cooked white rice',
    srcSet: {
      avif: `${wordRiceAvif160} 160w, ${wordRiceAvif} 320w`,
      webp: `${wordRiceWebp160} 160w, ${wordRiceWebp} 320w`,
    },
  },
  meat: {
    avif: wordMeatAvif,
    webp: wordMeatWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAAAQAgCdASoQAAwAA4BaJZACdAEPAmAS6vwAAP700ZTzfanPdJLpm3pFi4AR4YUZOWnlHuq9bUwXxwP26rBwAA==',
    alt: 'A cut of raw red meat',
    srcSet: {
      avif: `${wordMeatAvif160} 160w, ${wordMeatAvif} 320w`,
      webp: `${wordMeatWebp160} 160w, ${wordMeatWebp} 320w`,
    },
  },
  chicken: {
    avif: wordChickenAvif,
    webp: wordChickenWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADwAQCdASoQAAwAA4BaJbACdAEPAFOqdMAA/vYKEziFZPrfL4Qi7yKp7oGODY4/YYjGG+CtL0PlAAAA',
    alt: 'A roasted chicken drumstick',
    srcSet: {
      avif: `${wordChickenAvif160} 160w, ${wordChickenAvif} 320w`,
      webp: `${wordChickenWebp160} 160w, ${wordChickenWebp} 320w`,
    },
  },
  fish: {
    avif: wordFishAvif,
    webp: wordFishWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAAAwAgCdASoQAAwAA4BaJbACdFQAA5HW6H9AAAD+9gmC/7rhmwvbEJuL9J6RagRfjs8NAib4vYlvYcujPDSp8PrYaW/S6LWNCx8ZrgAA',
    alt: 'A single blue fish',
    srcSet: {
      avif: `${wordFishAvif160} 160w, ${wordFishAvif} 320w`,
      webp: `${wordFishWebp160} 160w, ${wordFishWebp} 320w`,
    },
  },
  egg: {
    avif: wordEggAvif,
    webp: wordEggWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADwAQCdASoQAAwAA4BaJagCdAEO/HoXsAAA/vcO84MTPIPqHTOlFWCYeo40yyuRRcncE6j+8gk8tc6VxhrgAA==',
    alt: 'A single brown egg',
    srcSet: {
      avif: `${wordEggAvif160} 160w, ${wordEggAvif} 320w`,
      webp: `${wordEggWebp160} 160w, ${wordEggWebp} 320w`,
    },
  },
  cheese: {
    avif: wordCheeseAvif,
    webp: wordCheeseWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAABwAQCdASoQAAwAA4BaJbACdAGIQAD+8PReqofrSYT57X0nykfpoSQ/Gw3r7SjQT1aTSJAAAAA=',
    alt: 'A wedge of yellow cheese',
    srcSet: {
      avif: `${wordCheeseAvif160} 160w, ${wordCheeseAvif} 320w`,
      webp: `${wordCheeseWebp160} 160w, ${wordCheeseWebp} 320w`,
    },
  },
  salt: {
    avif: wordSaltAvif,
    webp: wordSaltWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAADwAQCdASoQAAwAA4BaJZQCdAEPAigeggAA/vYS3+u5Y9SIjV15++z7SS4AAA==',
    alt: 'A glass salt shaker',
    srcSet: {
      avif: `${wordSaltAvif160} 160w, ${wordSaltAvif} 320w`,
      webp: `${wordSaltWebp160} 160w, ${wordSaltWebp} 320w`,
    },
  },
  restaurant: {
    avif: wordRestaurantAvif,
    webp: wordRestaurantWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAADwAQCdASoQAAwAA4BaJYwC7AEPAFOREsAA/vYQqVBknu87Mdao4VTu2AAAAA==',
    alt: 'A fork and knife beside a plate',
    srcSet: {
      avif: `${wordRestaurantAvif160} 160w, ${wordRestaurantAvif} 320w`,
      webp: `${wordRestaurantWebp160} 160w, ${wordRestaurantWebp} 320w`,
    },
  },
  orange: {
    avif: wordOrangeAvif,
    webp: wordOrangeWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoQAAwAA4BaJbACdAELXlpIEgAA/vYSsI0/RZx8cUOox0CIv5ym9eh3tX27rE+wr+L4i7OlqCDy6mORjAA=',
    alt: 'A single orange with a green leaf',
    srcSet: {
      avif: `${wordOrangeAvif160} 160w, ${wordOrangeAvif} 320w`,
      webp: `${wordOrangeWebp160} 160w, ${wordOrangeWebp} 320w`,
    },
  },
  window: {
    avif: wordWindowAvif,
    webp: wordWindowWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADwAQCdASoQAAwAA4BaJYgCdAEN4pIhQAAA/vYSiu28zhkkPeU0Vh0jYRqK3bir0K31dPgA',
    alt: 'A window with four panes',
    srcSet: {
      avif: `${wordWindowAvif160} 160w, ${wordWindowAvif} 320w`,
      webp: `${wordWindowWebp160} 160w, ${wordWindowWebp} 320w`,
    },
  },
  bed: {
    avif: wordBedAvif,
    webp: wordBedWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADQAQCdASoQAAwAA4BaJZAC7AEO/D7b/AD+9MufuonHIedldXg/MTQ0OuP5QmY6xg3x66ZA5NV83sKfLQ0h65ah7AAAAA==',
    alt: 'A single bed with a headboard and pillow',
    srcSet: {
      avif: `${wordBedAvif160} 160w, ${wordBedAvif} 320w`,
      webp: `${wordBedWebp160} 160w, ${wordBedWebp} 320w`,
    },
  },
  key: {
    avif: wordKeyAvif,
    webp: wordKeyWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADQAQCdASoQAAwAA4BaJbACdAEN5Pt4wAD+9glUD8vHzDrZ2Frf08MHw73Jv95J3Oz/7TjT4AA=',
    alt: 'A gold door key',
    srcSet: {
      avif: `${wordKeyAvif160} 160w, ${wordKeyAvif} 320w`,
      webp: `${wordKeyWebp160} 160w, ${wordKeyWebp} 320w`,
    },
  },
  mirror: {
    avif: wordMirrorAvif,
    webp: wordMirrorWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAABwAQCdASoQAAwAA4BaJZQCdAF1AAD+8X1aqh4XTodgcnRrCxmzApEEAKO9gHmR924AxFAA',
    alt: 'A framed hand mirror',
    srcSet: {
      avif: `${wordMirrorAvif160} 160w, ${wordMirrorAvif} 320w`,
      webp: `${wordMirrorWebp160} 160w, ${wordMirrorWebp} 320w`,
    },
  },
  bathroom: {
    avif: wordBathroomAvif,
    webp: wordBathroomWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADwAQCdASoQAAwAA4BaJZACdAEN1lq8EAAA/vYJc7+TRmJw2AGqW5p9VsUAFDHL6q0i12n+UBqRAAAA',
    alt: 'A showerhead with water droplets',
    srcSet: {
      avif: `${wordBathroomAvif160} 160w, ${wordBathroomAvif} 320w`,
      webp: `${wordBathroomWebp160} 160w, ${wordBathroomWebp} 320w`,
    },
  },
  man: {
    avif: wordManAvif,
    webp: wordManWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAABQAgCdASoQAAwAA4BaJbACdH8G6AA4lFQrW8AA/vYSsIuY+CrbvXlMNIn15071vLdpKZ+ftUz5SxGrXJMFKgLbwAci/+514JlxDfLvAAA=',
    alt: 'A man',
    srcSet: {
      avif: `${wordManAvif160} 160w, ${wordManAvif} 320w`,
      webp: `${wordManWebp160} 160w, ${wordManWebp} 320w`,
    },
  },
  woman: {
    avif: wordWomanAvif,
    webp: wordWomanWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADwAQCdASoQAAwAA4BaJbACdAELYLrWtwAA/vYRI0qtUSNqf4h7csQNbAH8YcpMQ8+qud2pna4A95fXm5p/6Ud3HQQajlIX6ZmjSgSzfeJ809bmlMAAAA==',
    alt: 'A woman',
    srcSet: {
      avif: `${wordWomanAvif160} 160w, ${wordWomanAvif} 320w`,
      webp: `${wordWomanWebp160} 160w, ${wordWomanWebp} 320w`,
    },
  },
  person: {
    avif: wordPersonAvif,
    webp: wordPersonWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAABQAgCdASoQAAwAA4BaJbACdH8G6AA5Wyhn8MAA/vYRI0tMi8TmClrAx/CZhn5XOBLees+f6KOXMfDXJVBTwp8NseRMaRMMmzKIAA==',
    alt: 'A person',
    srcSet: {
      avif: `${wordPersonAvif160} 160w, ${wordPersonAvif} 320w`,
      webp: `${wordPersonWebp160} 160w, ${wordPersonWebp} 320w`,
    },
  },
  question: {
    avif: wordQuestionAvif,
    webp: wordQuestionWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADwAQCdASoQAAwAA4BaJZgCdADc+DJ0FAAA/vYT4EZA2TW7m9bSfdMhTqer9j+nKhMxaRVH2wvKLbfFmuGFfssOYnKAAA==',
    alt: 'A red question mark',
    srcSet: {
      avif: `${wordQuestionAvif160} 160w, ${wordQuestionAvif} 320w`,
      webp: `${wordQuestionWebp160} 160w, ${wordQuestionWebp} 320w`,
    },
  },
  yes: {
    avif: wordYesAvif,
    webp: wordYesWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoQAAwAA4BaJbACdADw2SL7lQAA/vYTyJo2bZGWsqycW8DIWILuUvpilVMbo7BpCo0NIoNHBTcGJ2ku9tR1qcAA',
    alt: 'A green check mark',
    srcSet: {
      avif: `${wordYesAvif160} 160w, ${wordYesAvif} 320w`,
      webp: `${wordYesWebp160} 160w, ${wordYesWebp} 320w`,
    },
  },
  no: {
    avif: wordNoAvif,
    webp: wordNoWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAAAwAgCdASoQAAwAA4BaJagCdAYoBvPGvMzcAAD+9hLUBktnmXxFdickwoH6CkhxnTpiiy5XZQnr31Tipw7V2QYOE9Ahawej8MGAAA==',
    alt: 'A red cross mark',
    srcSet: {
      avif: `${wordNoAvif160} 160w, ${wordNoAvif} 320w`,
      webp: `${wordNoWebp160} 160w, ${wordNoWebp} 320w`,
    },
  },
  name: {
    avif: wordNameAvif,
    webp: wordNameWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADwAQCdASoQAAwAA4BaJbACdAEO/HoX2AAA/vYKI4nUcBIXtVMLUkRzkK0LtB7xar6BzJxlaaiHM/kQ4R9DIcjj+q07m+QO6rHBoRmYsMGd9to5cFUAAA==',
    alt: 'A name badge',
    srcSet: {
      avif: `${wordNameAvif160} 160w, ${wordNameAvif} 320w`,
      webp: `${wordNameWebp160} 160w, ${wordNameWebp} 320w`,
    },
  },
  language: {
    avif: wordLanguageAvif,
    webp: wordLanguageWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjAAAABXRUJQVlA4ICQAAADQAQCdASoQAAwAA4BaJYwCdAEO/DfIAAD+9gTlgXEB3DFkAAA=',
    alt: 'A speech balloon',
    srcSet: {
      avif: `${wordLanguageAvif160} 160w, ${wordLanguageAvif} 320w`,
      webp: `${wordLanguageWebp160} 160w, ${wordLanguageWebp} 320w`,
    },
  },
  soap: {
    avif: wordSoapAvif,
    webp: wordSoapWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAAAQAgCdASoQAAwAA4BaJbACdAEO+Xx3MCAAAP72CtJn7Mb/NIvUmyOtXVhSPzNF3lqmLvVIyfPolwPP8PaP+Z+sTjYQAA==',
    alt: 'A bar of soap on a soap dish',
    srcSet: {
      avif: `${wordSoapAvif160} 160w, ${wordSoapAvif} 320w`,
      webp: `${wordSoapWebp160} 160w, ${wordSoapWebp} 320w`,
    },
  },
  'alarm-clock': {
    avif: wordAlarmClockAvif,
    webp: wordAlarmClockWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADwAQCdASoQAAwAA4BaJbACdAERHuEIPoAA/vYQ2FViM+Ed0lPQeYKp53vfsWLYRepalq7uw06W6V0E5HVOkglYM/ASBtQAAAA=',
    alt: 'An alarm clock',
    srcSet: {
      avif: `${wordAlarmClockAvif160} 160w, ${wordAlarmClockAvif} 320w`,
      webp: `${wordAlarmClockWebp160} 160w, ${wordAlarmClockWebp} 320w`,
    },
  },
  shirt: {
    avif: wordShirtAvif,
    webp: wordShirtWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADwAQCdASoQAAwAA4BaJaACdAEPAFOneVAA/vYE/zcSu33aCfvg+EZ7gKoNNom3HEBynXlT4AA=',
    alt: 'A folded t-shirt',
    srcSet: {
      avif: `${wordShirtAvif160} 160w, ${wordShirtAvif} 320w`,
      webp: `${wordShirtWebp160} 160w, ${wordShirtWebp} 320w`,
    },
  },
  'to-sleep': {
    avif: wordToSleepAvif,
    webp: wordToSleepWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAABQAgCdASoQAAwAA4BaJbACdH8G6AA5Gzqq+vAA/vTckkj9YcvNl5hWbJmcfd7dKVFM5BrLbL2P1O7g5+1UdsGQMN07fcHjTloMQrX0mNPm1ZiaUmAAAA==',
    alt: 'A sleeping face with a Zzz',
    srcSet: {
      avif: `${wordToSleepAvif160} 160w, ${wordToSleepAvif} 320w`,
      webp: `${wordToSleepWebp160} 160w, ${wordToSleepWebp} 320w`,
    },
  },
  'to-shower': {
    avif: wordToShowerAvif,
    webp: wordToShowerWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADwAQCdASoQAAwAA4BaJZACdAEN1lq8EAAA/vYJc7+TRmJw2AGqW5p9VsUAFDHL6q0i12n+UBqRAAAA',
    alt: 'A showerhead with water droplets',
    srcSet: {
      avif: `${wordToShowerAvif160} 160w, ${wordToShowerAvif} 320w`,
      webp: `${wordToShowerWebp160} 160w, ${wordToShowerWebp} 320w`,
    },
  },
  'to-cook': {
    avif: wordToCookAvif,
    webp: wordToCookWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAAAQAgCdASoQAAwAA4BaJaACdADp9Q4mQqgAAP72E+BNS5Vw/sfzw+z1+AUJ9Q3JyAMo+Y4yKRhMuou03OaZqPEVi3RDTK30cTAxYAAA',
    alt: 'A frying egg in a pan',
    srcSet: {
      avif: `${wordToCookAvif160} 160w, ${wordToCookAvif} 320w`,
      webp: `${wordToCookWebp160} 160w, ${wordToCookWebp} 320w`,
    },
  },
  'to-clean': {
    avif: wordToCleanAvif,
    webp: wordToCleanWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAAAQAgCdASoQAAwAA4BaJagCdAEPAmckqNwAAP72Ci+DC1L3hlVE8c3fi95kNcW8PMT4niGE7RBpAnQmWHaOYAAA',
    alt: 'A cleaning sponge',
    srcSet: {
      avif: `${wordToCleanAvif160} 160w, ${wordToCleanAvif} 320w`,
      webp: `${wordToCleanWebp160} 160w, ${wordToCleanWebp} 320w`,
    },
  },
  appointment: {
    avif: wordAppointmentAvif,
    webp: wordAppointmentWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAABQAgCdASoQAAwAA4BaJZgCdEf/2SACx0YbTgAA/vYRzvfgBbLQqp1hu0avPBKZYQR8msucSnXSSlAHdlDYSahPNAAAAA==',
    alt: 'A calendar page',
    srcSet: {
      avif: `${wordAppointmentAvif160} 160w, ${wordAppointmentAvif} 320w`,
      webp: `${wordAppointmentWebp160} 160w, ${wordAppointmentWebp} 320w`,
    },
  },
  child: {
    avif: wordChildAvif,
    webp: wordChildWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADwAQCdASoQAAwAA4BaJbACdAEO/H08wAAA/vYSsIsqIvXdyzkQVUU4k21/xH70GNWPqBjOhLfTSx4Pvrr1sXZLUEIpTv5xwAA=',
    alt: 'A young child',
    srcSet: {
      avif: `${wordChildAvif160} 160w, ${wordChildAvif} 320w`,
      webp: `${wordChildWebp160} 160w, ${wordChildWebp} 320w`,
    },
  },
  boy: {
    avif: wordBoyAvif,
    webp: wordBoyWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAABQAgCdASoQAAwAA4BaJbACdH8G6AA4lCRRA4AA/vYSsIuY+CrlIRUSIkkEuKue0QnedOftUz86hSCb81nKGyNRL2b8e4nyoU0VQAAA',
    alt: 'A young boy',
    srcSet: {
      avif: `${wordBoyAvif160} 160w, ${wordBoyAvif} 320w`,
      webp: `${wordBoyWebp160} 160w, ${wordBoyWebp} 320w`,
    },
  },
  girl: {
    avif: wordGirlAvif,
    webp: wordGirlWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAAAwAgCdASoQAAwAA4BaJbACdFQgA4lFaARoAAD+9hEjTIreLWebKzxONTmYM8eNush7ukk1zIcE40EkaWWpSGGaqR4oc2rJLgu71ZcQWn8AAA==',
    alt: 'A young girl',
    srcSet: {
      avif: `${wordGirlAvif160} 160w, ${wordGirlAvif} 320w`,
      webp: `${wordGirlWebp160} 160w, ${wordGirlWebp} 320w`,
    },
  },
  grandfather: {
    avif: wordGrandfatherAvif,
    webp: wordGrandfatherWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAAAwAgCdASoQAAwAA4BaJbACdFQAA4lCRVLAAAD+9go51DL0un2vyxnR8oz7pbXSYP0ZVqQLm7xmYNKW16ALDZfNoI+ybMogAAA=',
    alt: 'An elderly man',
    srcSet: {
      avif: `${wordGrandfatherAvif160} 160w, ${wordGrandfatherAvif} 320w`,
      webp: `${wordGrandfatherWebp160} 160w, ${wordGrandfatherWebp} 320w`,
    },
  },
  grandmother: {
    avif: wordGrandmotherAvif,
    webp: wordGrandmotherWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADwAQCdASoQAAwAA4BaJaACdAELYLrWtwAA/vYRI1RVvdpchRj82Swucagib9QjPu2qxFAxXgjVjy1Cx6HhaFTwzemoqV/JMAAAAA==',
    alt: 'An elderly woman',
    srcSet: {
      avif: `${wordGrandmotherAvif160} 160w, ${wordGrandmotherAvif} 320w`,
      webp: `${wordGrandmotherWebp160} 160w, ${wordGrandmotherWebp} 320w`,
    },
  },
  eye: {
    avif: wordEyeAvif,
    webp: wordEyeWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADQAQCdASoQAAwAA4BaJQBOgCFry0+woAD+9hEXuXdgmwId0gGvuzl2Xjw2tMfEr+FKGeScyn+guy6+dU9yYAAA',
    alt: 'A single eye',
    srcSet: {
      avif: `${wordEyeAvif160} 160w, ${wordEyeAvif} 320w`,
      webp: `${wordEyeWebp160} 160w, ${wordEyeWebp} 320w`,
    },
  },
  leg: {
    avif: wordLegAvif,
    webp: wordLegWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAABwAQCdASoQAAwAA4BaJZgCdAFAAAD+8QUX/iVBnh0KD8gKt8W+4wBdMZhn51BJiamx9jtJvo7wAA==',
    alt: 'A leg and foot',
    srcSet: {
      avif: `${wordLegAvif160} 160w, ${wordLegAvif} 320w`,
      webp: `${wordLegWebp160} 160w, ${wordLegWebp} 320w`,
    },
  },
  mouth: {
    avif: wordMouthAvif,
    webp: wordMouthWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADQAQCdASoQAAwAA4BaJbAAAudf/1NDJAD+9Mufy0GmeEPM/O5Coeg0DTZgbOLUAhTd/4ZERmeREMlYp7mzAMAA',
    alt: 'An open mouth',
    srcSet: {
      avif: `${wordMouthAvif160} 160w, ${wordMouthAvif} 320w`,
      webp: `${wordMouthWebp160} 160w, ${wordMouthWebp} 320w`,
    },
  },
  ear: {
    avif: wordEarAvif,
    webp: wordEarWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAACwAQCdASoQAAwAA4BaJbACdAEO9qIgAP72ERe5ZEz8p3sM6gg1m4vy2zo/CsnH1fuP9ZQYIFAlmgtUHIAAAA==',
    alt: 'A human ear',
    srcSet: {
      avif: `${wordEarAvif160} 160w, ${wordEarAvif} 320w`,
      webp: `${wordEarWebp160} 160w, ${wordEarWebp} 320w`,
    },
  },
  nose: {
    avif: wordNoseAvif,
    webp: wordNoseWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADwAQCdASoQAAwAA4BaJZgCdAEO+ooivAAA/vYE/BQIikz0bPvpThFCZGZXHpJKNgc1ptwAAAA=',
    alt: 'A human nose',
    srcSet: {
      avif: `${wordNoseAvif160} 160w, ${wordNoseAvif} 320w`,
      webp: `${wordNoseWebp160} 160w, ${wordNoseWebp} 320w`,
    },
  },
  tooth: {
    avif: wordToothAvif,
    webp: wordToothWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADQAQCdASoQAAwAA4BaJZQCdAEO+lBkgAD+9wjWHvIvd6/caGn5Aq2r1nG58YAA',
    alt: 'A white tooth',
    srcSet: {
      avif: `${wordToothAvif160} 160w, ${wordToothAvif} 320w`,
      webp: `${wordToothWebp160} 160w, ${wordToothWebp} 320w`,
    },
  },
  hospital: {
    avif: wordHospitalAvif,
    webp: wordHospitalWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoQAAwAA4BaJZACdAD0h5psgAD+9hPekO4tGsUjrPERVd4Y3qh15ULVGxNvIp6t6XuJN9HeAAA=',
    alt: 'A hospital building with a red cross',
    srcSet: {
      avif: `${wordHospitalAvif160} 160w, ${wordHospitalAvif} 320w`,
      webp: `${wordHospitalWebp160} 160w, ${wordHospitalWebp} 320w`,
    },
  },
  hand: {
    avif: wordHandAvif,
    webp: wordHandWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoQAAwAA4BaJbACdAEN4Ax6kIAA/vYRF7lw7nsgc1+jrAQiZfnbEVV098taVew0MvWl8ZyyzfeJ80d4AAA=',
    alt: 'A raised open hand',
    srcSet: {
      avif: `${wordHandAvif160} 160w, ${wordHandAvif} 320w`,
      webp: `${wordHandWebp160} 160w, ${wordHandWebp} 320w`,
    },
  },
  heart: {
    avif: wordHeartAvif,
    webp: wordHeartWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADwAQCdASoQAAwAA4BaJbACw7EO/HoX2AAA/vTcAi8go9GP8zl4OgFynTuWWJMBW0rego+7MhuWZBAP8yiKd4uzNmle5EW8yZck1kbYYAA=',
    alt: 'A red heart',
    srcSet: {
      avif: `${wordHeartAvif160} 160w, ${wordHeartAvif} 320w`,
      webp: `${wordHeartWebp160} 160w, ${wordHeartWebp} 320w`,
    },
  },
  medicine: {
    avif: wordMedicineAvif,
    webp: wordMedicineWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADwAQCdASoQAAwAA4BaJbACdAEKpp6aGAAA/vYJ1hRPMzPuDdYQs4IC6f6ihwMFI1VmRYyF/w7kJutyQGOSub2ANUVw59qtO4JBpUU/AAA=',
    alt: 'A capsule pill',
    srcSet: {
      avif: `${wordMedicineAvif160} 160w, ${wordMedicineAvif} 320w`,
      webp: `${wordMedicineWebp160} 160w, ${wordMedicineWebp} 320w`,
    },
  },
  blood: {
    avif: wordBloodAvif,
    webp: wordBloodWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAQAgCdASoQAAwAA4BaJbACdAEKp8jeXcwAAP72Et/sQFVZrzRmc8YR3rXGjTvPHMBdB8iZIQUMqUZ/Z+iDhAQtz8RyKiVKJ/ovP8z+OQdVr3AA',
    alt: 'A drop of blood',
    srcSet: {
      avif: `${wordBloodAvif160} 160w, ${wordBloodAvif} 320w`,
      webp: `${wordBloodWebp160} 160w, ${wordBloodWebp} 320w`,
    },
  },
  mountain: {
    avif: wordMountainAvif,
    webp: wordMountainWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADwAQCdASoQAAwAA4BaJZgCdAEPAFK9yWAA/vYE//Er5kYKwl36KHJ5IlN86kG/mWCtIk7oBonlWLigv38AAA==',
    alt: 'A snow-capped mountain',
    srcSet: {
      avif: `${wordMountainAvif160} 160w, ${wordMountainAvif} 320w`,
      webp: `${wordMountainWebp160} 160w, ${wordMountainWebp} 320w`,
    },
  },
  lion: {
    avif: wordLionAvif,
    webp: wordLionWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAwAgCdASoQAAwAA4BaJbACdAYsZjQ1WCfQAAD+9hOdWxUxJ/XCLpiXTvDm6u9ejWbpwfbKaET2ShUvAYbLAodYsugvJb5bVYhy/X0VOE8xfJQcgAA=',
    alt: 'A lion face',
    srcSet: {
      avif: `${wordLionAvif160} 160w, ${wordLionAvif} 320w`,
      webp: `${wordLionWebp160} 160w, ${wordLionWebp} 320w`,
    },
  },
  dog: {
    avif: wordDogAvif,
    webp: wordDogWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAAAQAgCdASoQAAwAA4BaJZACdAEPAFOkvmMAAP72B8bw1qeHCVhjKjmqL+5Xmg2UGvqrm+S38ETMp4wIAAA=',
    alt: 'A dog face',
    srcSet: {
      avif: `${wordDogAvif160} 160w, ${wordDogAvif} 320w`,
      webp: `${wordDogWebp160} 160w, ${wordDogWebp} 320w`,
    },
  },
  horse: {
    avif: wordHorseAvif,
    webp: wordHorseWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAQCdASoQAAwAA4BaJYwCdADFHPUAAP72Eyo6FYJFLtr5dMX7XUKqBjEnMOqW0Tl/0SH+bDfgZQGN74ipxidECFpwgAAA',
    alt: 'A horse face',
    srcSet: {
      avif: `${wordHorseAvif160} 160w, ${wordHorseAvif} 320w`,
      webp: `${wordHorseWebp160} 160w, ${wordHorseWebp} 320w`,
    },
  },
  camel: {
    avif: wordCamelAvif,
    webp: wordCamelWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoQAAwAA4BaJagCdAELXP75dwAA/vYQqouHysTnVeYFBou9FQRNMdzcVTxQ95ZzXYYjGHdZWnDDFNuAAAA=',
    alt: 'A camel',
    srcSet: {
      avif: `${wordCamelAvif160} 160w, ${wordCamelAvif} 320w`,
      webp: `${wordCamelWebp160} 160w, ${wordCamelWebp} 320w`,
    },
  },
  desert: {
    avif: wordDesertAvif,
    webp: wordDesertWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADQAQCdASoQAAwAA4BaJbACdADwv5gXAAD+9hMqOfMjdwv0ItsHVX1qZ0plXOHCFh51nEqEV9L/go14Nz2fUOjr1qBl9NCVG1hjrOPRGhZiAAAA',
    alt: 'A desert with dunes and a cactus',
    srcSet: {
      avif: `${wordDesertAvif160} 160w, ${wordDesertAvif} 320w`,
      webp: `${wordDesertWebp160} 160w, ${wordDesertWebp} 320w`,
    },
  },
  sea: {
    avif: wordSeaAvif,
    webp: wordSeaWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADwAQCdASoQAAwAA4BaJbACdAEO+oVQP0AA/vTckk0jpK6t3exh4H7PAafN7bkfOZi/ijtzi2HdwnoPjXFbKb/Vndf/CTULbIA1IgAA',
    alt: 'A blue ocean wave',
    srcSet: {
      avif: `${wordSeaAvif160} 160w, ${wordSeaAvif} 320w`,
      webp: `${wordSeaWebp160} 160w, ${wordSeaWebp} 320w`,
    },
  },
  flower: {
    avif: wordFlowerAvif,
    webp: wordFlowerWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAACwAQCdASoQAAwAA4BaJQAAXOwIp+CwAP72Cs/EuMTxw/Z0BuRL1PeoOXGA1qyWuy1YQAAA',
    alt: 'A pink flower blossom',
    srcSet: {
      avif: `${wordFlowerAvif160} 160w, ${wordFlowerAvif} 320w`,
      webp: `${wordFlowerWebp160} 160w, ${wordFlowerWebp} 320w`,
    },
  },
  rain: {
    avif: wordRainAvif,
    webp: wordRainWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADwAQCdASoQAAwAA4BaJQBOgCFrtry48agA/vYQq0zifPIMV+552kPtwvG/O278vXqNsjuWQ7bMwz3sQAAAAA==',
    alt: 'A cloud with rain falling',
    srcSet: {
      avif: `${wordRainAvif160} 160w, ${wordRainAvif} 320w`,
      webp: `${wordRainWebp160} 160w, ${wordRainWebp} 320w`,
    },
  },
  wind: {
    avif: wordWindAvif,
    webp: wordWindWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADwAQCdASoQAAwAA4BaJbACdADc+aBNZAAA/vYTHPlU7Pzl3WPI+CFl8TRu0tZaQGyQXCPjBGR+tHaR2EidJvbRkiZk6ay0HUAAAA==',
    alt: 'A gust of wind',
    srcSet: {
      avif: `${wordWindAvif160} 160w, ${wordWindAvif} 320w`,
      webp: `${wordWindWebp160} 160w, ${wordWindWebp} 320w`,
    },
  },
  one: {
    avif: wordOneAvif,
    webp: wordOneWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAAAQAgCdASoQAAwAA4BaJbACdFQAAy7ITlYQAP72E5g51m0wd2h5IN7YdKkQIAPS25P3Fz9mKd54ibkKtXJHMOZzfk/D+W8pg6V9S1JoS2EAAA==',
    alt: 'The number 1 on a keycap',
    srcSet: {
      avif: `${wordOneAvif160} 160w, ${wordOneAvif} 320w`,
      webp: `${wordOneWebp160} 160w, ${wordOneWebp} 320w`,
    },
  },
  two: {
    avif: wordTwoAvif,
    webp: wordTwoWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAQAgCdASoQAAwAA4BaJbACdFQAAy6oR91AAP72E5g51m0wd2jQ6DYP796yK8HXrVQkEw/r7/waPryPzLLcvFBW2q1goAgowJNQp2vmIkBsQvhAAAA=',
    alt: 'The number 2 on a keycap',
    srcSet: {
      avif: `${wordTwoAvif160} 160w, ${wordTwoAvif} 320w`,
      webp: `${wordTwoWebp160} 160w, ${wordTwoWebp} 320w`,
    },
  },
  three: {
    avif: wordThreeAvif,
    webp: wordThreeWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAwAgCdASoQAAwAA4BaJbACdFQAAy7IiKI9AAD+9hOYOdZtMHdovC36Yu+JjAOdRThSCwLgsmYf54ibkKT5332cHM5vyfh/LeUu9vEm8ZOo//fyAAA=',
    alt: 'The number 3 on a keycap',
    srcSet: {
      avif: `${wordThreeAvif160} 160w, ${wordThreeAvif} 320w`,
      webp: `${wordThreeWebp160} 160w, ${wordThreeWebp} 320w`,
    },
  },
  four: {
    avif: wordFourAvif,
    webp: wordFourWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAQAgCdASoQAAwAA4BaJbACdFQAAy6oR91AAP72E5g51m0wd2jQ/6d5cnI+MFd65iF2BWkWVeePwKN7hnx99AKfFyizY+/X75n76DY7qy5dioAA',
    alt: 'The number 4 on a keycap',
    srcSet: {
      avif: `${wordFourAvif160} 160w, ${wordFourAvif} 320w`,
      webp: `${wordFourWebp160} 160w, ${wordFourWebp} 320w`,
    },
  },
  five: {
    avif: wordFiveAvif,
    webp: wordFiveWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADwAQCdASoQAAwAA4BaJbACdFQAAy7DgbgA/vYTmDKZkQq6JsneXv/np6UuZeuQtyrPYPA5pH/8sc7h9AG2UKfFyizY+/X4n7yMhLQlsIAAAA==',
    alt: 'The number 5 on a keycap',
    srcSet: {
      avif: `${wordFiveAvif160} 160w, ${wordFiveAvif} 320w`,
      webp: `${wordFiveWebp160} 160w, ${wordFiveWebp} 320w`,
    },
  },
  ten: {
    avif: wordTenAvif,
    webp: wordTenWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADwAQCdASoQAAwAA4BaJbACdADwoSa5yAAA/vYTmDnWbTB3Z5uIqpaWqniGVDmB2ddqeRCm7GQ7/1XmlosMobPuFPobpfYsrkWHR7sZx7Qfi7u4nLwAAA==',
    alt: 'The number 10 on a keycap',
    srcSet: {
      avif: `${wordTenAvif160} 160w, ${wordTenAvif} 320w`,
      webp: `${wordTenWebp160} 160w, ${wordTenWebp} 320w`,
    },
  },
  morning: {
    avif: wordMorningAvif,
    webp: wordMorningWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAABwAgCdASoQAAwAA4BaJbACdGaA2wAGlubuPvAAAP72Exz5F76xjnkSBTLdyS4/Pbi6rJYhdgeA5kkh7PcDnbzHGhKX5l1ZOUfio8ITisuY2Ex09QPBQSIhK2AAAA==',
    alt: 'A sunrise over hills',
    srcSet: {
      avif: `${wordMorningAvif160} 160w, ${wordMorningAvif} 320w`,
      webp: `${wordMorningWebp160} 160w, ${wordMorningWebp} 320w`,
    },
  },
  school: {
    avif: wordSchoolAvif,
    webp: wordSchoolWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADQAQCdASoQAAwAA4BaJZACdAEO/H1mwAD+9gnh2XYq9VrkQ12pUDMkwYl6ZF2QvJV+H0gLAq4eWCboJtj2+4op8rgAAA==',
    alt: 'A school building',
    srcSet: {
      avif: `${wordSchoolAvif160} 160w, ${wordSchoolAvif} 320w`,
      webp: `${wordSchoolWebp160} 160w, ${wordSchoolWebp} 320w`,
    },
  },
  notebook: {
    avif: wordNotebookAvif,
    webp: wordNotebookWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoQAAwAA4BaJQBOgMXIyt1Cl3AA/vYSItmPwlNSVf/xaw5HlkPlnFPXy5Qm5pzOF2ajlqB6sjxQeV+x7e2cAAAA',
    alt: 'A spiral notebook',
    srcSet: {
      avif: `${wordNotebookAvif160} 160w, ${wordNotebookAvif} 320w`,
      webp: `${wordNotebookWebp160} 160w, ${wordNotebookWebp} 320w`,
    },
  },
  pen: {
    avif: wordPenAvif,
    webp: wordPenWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADQAQCdASoQAAwAA4BaJQBOgCIAWBn2gAD+9gl01obnpmx4C7j7cJy7baJ7NHsjFbonpmInENG/QJszxLCmdcmgAAA=',
    alt: 'A ballpoint pen',
    srcSet: {
      avif: `${wordPenAvif160} 160w, ${wordPenAvif} 320w`,
      webp: `${wordPenWebp160} 160w, ${wordPenWebp} 320w`,
    },
  },
  university: {
    avif: wordUniversityAvif,
    webp: wordUniversityWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoQAAwAA4BaJZwAAvqAre8UzoAA/vYOEobGM7JBqYhHP31rwIAV3T3Xq5eL5k8AlXgUGu8oh3lWTmiXgAA=',
    alt: 'A graduation cap',
    srcSet: {
      avif: `${wordUniversityAvif160} 160w, ${wordUniversityAvif} 320w`,
      webp: `${wordUniversityWebp160} 160w, ${wordUniversityWebp} 320w`,
    },
  },
  library: {
    avif: wordLibraryAvif,
    webp: wordLibraryWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAQAgCdASoQAAwAA4BaJbACdAELYAQ7jkMAAP72EotRidg++5nzRgy1HI4TFoFBbbYXMd9HMwzo123HAruAgHlz3tBE15td3mD0/gPAAAA=',
    alt: 'A stack of books',
    srcSet: {
      avif: `${wordLibraryAvif160} 160w, ${wordLibraryAvif} 320w`,
      webp: `${wordLibraryWebp160} 160w, ${wordLibraryWebp} 320w`,
    },
  },
  dictionary: {
    avif: wordDictionaryAvif,
    webp: wordDictionaryWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAQCdASoQAAwAA4BaJbAAAq4KPSdwAP72EzwWLWlHG0P1iXiSFHP+AwDJx+aawGbG6cCot4/4jByK63OrH3rZzoaGGt4gUQAAAA==',
    alt: 'A closed book',
    srcSet: {
      avif: `${wordDictionaryAvif160} 160w, ${wordDictionaryAvif} 320w`,
      webp: `${wordDictionaryWebp160} 160w, ${wordDictionaryWebp} 320w`,
    },
  },
  paper: {
    avif: wordPaperAvif,
    webp: wordPaperWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjAAAABXRUJQVlA4ICQAAAAwAQCdASoQAAwAA4BaJaQAA3AA/vHCE7JnxDhsyR/Vd4z1HAA=',
    alt: 'A blank sheet of paper',
    srcSet: {
      avif: `${wordPaperAvif160} 160w, ${wordPaperAvif} 320w`,
      webp: `${wordPaperWebp160} 160w, ${wordPaperWebp} 320w`,
    },
  },
  bank: {
    avif: wordBankAvif,
    webp: wordBankWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADQAQCdASoQAAwAA4BaJYwCdAEKj14egAD+9hEXuYb+825q1refINSNc1wTKOZ/JKkB0vHPcVJtjKDuGAAAAA==',
    alt: 'A bank building with columns',
    srcSet: {
      avif: `${wordBankAvif160} 160w, ${wordBankAvif} 320w`,
      webp: `${wordBankWebp160} 160w, ${wordBankWebp} 320w`,
    },
  },
  shop: {
    avif: wordShopAvif,
    webp: wordShopWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAAAQAgCdASoQAAwAA4BaJZAC7AEQUKQowRMUAP72ErCLoV0ey8bmTeUddABlvPccYPjvcyuiAnItbJ8wJNc6Ccb8eNMF+CTQAAA=',
    alt: 'A storefront',
    srcSet: {
      avif: `${wordShopAvif160} 160w, ${wordShopAvif} 320w`,
      webp: `${wordShopWebp160} 160w, ${wordShopWebp} 320w`,
    },
  },
  money: {
    avif: wordMoneyAvif,
    webp: wordMoneyWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAABQAgCdASoQAAwAA4BaJbACdFQAA4lJ5qsadgAA/vYK0mfuYRcFZ8TnBp3jd3phgY+2MxYpW3ONWNt6uAVx4F3FDaZmXyEWz3JRqGWQAAA=',
    alt: 'A bag of money',
    srcSet: {
      avif: `${wordMoneyAvif160} 160w, ${wordMoneyAvif} 320w`,
      webp: `${wordMoneyWebp160} 160w, ${wordMoneyWebp} 320w`,
    },
  },
  bill: {
    avif: wordBillAvif,
    webp: wordBillWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAACwAQCdASoQAAwAA4BaJZwAAuddMngAAP73DvOBoVSzMDapVH9rN00FAAA=',
    alt: 'A paper receipt',
    srcSet: {
      avif: `${wordBillAvif160} 160w, ${wordBillAvif} 320w`,
      webp: `${wordBillWebp160} 160w, ${wordBillWebp} 320w`,
    },
  },
  gift: {
    avif: wordGiftAvif,
    webp: wordGiftWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAAAwAgCdASoQAAwAA4BaJbACdFQAA1Ap3nvxMAD+9hOkQoRu/WUyYuyVazCMczEyv4tI9mGh1oWlXHodYXYW71lQ/Nax569oXUll5kfmS6I0SRSWphGgeAAA',
    alt: 'A wrapped gift box',
    srcSet: {
      avif: `${wordGiftAvif160} 160w, ${wordGiftAvif} 320w`,
      webp: `${wordGiftWebp160} 160w, ${wordGiftWebp} 320w`,
    },
  },
  bag: {
    avif: wordBagAvif,
    webp: wordBagWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAQAgCdASoQAAwAA4BaJbACdH8AGBp9knAAAP72EJQQ7gUPtlOKsCeBEt2LBF5mXpvbY97ue2h9Jru8yOCBa7UzA3tADuq1+s9+++aSQZyWfcAA',
    alt: 'Two shopping bags',
    srcSet: {
      avif: `${wordBagAvif160} 160w, ${wordBagAvif} 320w`,
      webp: `${wordBagWebp160} 160w, ${wordBagWebp} 320w`,
    },
  },
  keyboard: {
    avif: wordKeyboardAvif,
    webp: wordKeyboardWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAACwAQCdASoQAAwAA4BaJZwAAudf/L9QAP72BP6vT+zv3V6iSI+Nky8d8YAAAA==',
    alt: 'A computer keyboard',
    srcSet: {
      avif: `${wordKeyboardAvif160} 160w, ${wordKeyboardAvif} 320w`,
      webp: `${wordKeyboardWebp160} 160w, ${wordKeyboardWebp} 320w`,
    },
  },
  television: {
    avif: wordTelevisionAvif,
    webp: wordTelevisionWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoQAAwAA4BaJYwCdAEN1liVvQAA/vTchGptOezEhlc8SPvXKziyVF8ABerAZQqudMFUaPxH5eQdVFlZMVHIaOAA',
    alt: 'A television set',
    srcSet: {
      avif: `${wordTelevisionAvif160} 160w, ${wordTelevisionAvif} 320w`,
      webp: `${wordTelevisionWebp160} 160w, ${wordTelevisionWebp} 320w`,
    },
  },
  radio: {
    avif: wordRadioAvif,
    webp: wordRadioWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADwAQCdASoQAAwAA4BaJagCdAEO+ou064AA/vYHxvDXyT/huA8Mm/HxKFFXjdsD3qp6CHgbrMSVXQmM0YSsl1027AAAAA==',
    alt: 'A portable radio',
    srcSet: {
      avif: `${wordRadioAvif160} 160w, ${wordRadioAvif} 320w`,
      webp: `${wordRadioWebp160} 160w, ${wordRadioWebp} 320w`,
    },
  },
  newspaper: {
    avif: wordNewspaperAvif,
    webp: wordNewspaperWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACQAQCdASoQAAwAA4BaJZwAAudPjMAA/vcG1fcaZoupSFugxXKP+bDUXI7xwAAA',
    alt: 'A folded newspaper',
    srcSet: {
      avif: `${wordNewspaperAvif160} 160w, ${wordNewspaperAvif} 320w`,
      webp: `${wordNewspaperWebp160} 160w, ${wordNewspaperWebp} 320w`,
    },
  },
  camera: {
    avif: wordCameraAvif,
    webp: wordCameraWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADQAQCdASoQAAwAA4BaJZwAAudVjYxAAAD+9gT/xc+k71Pk41f9dy5SIto7089oZgaku8XOhQAAAA==',
    alt: 'A camera',
    srcSet: {
      avif: `${wordCameraAvif160} 160w, ${wordCameraAvif} 320w`,
      webp: `${wordCameraWebp160} 160w, ${wordCameraWebp} 320w`,
    },
  },
  printer: {
    avif: wordPrinterAvif,
    webp: wordPrinterWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADQAQCdASoQAAwAA4BaJZQAAu19w7gXkAD+9hCePjaOc/9euTKNbOJYbjKhXsvipPQlvviFEw54VNxLuLAU7jZUAAA=',
    alt: 'A desktop printer',
    srcSet: {
      avif: `${wordPrinterAvif160} 160w, ${wordPrinterAvif} 320w`,
      webp: `${wordPrinterWebp160} 160w, ${wordPrinterWebp} 320w`,
    },
  },
  phone: {
    avif: wordPhoneAvif,
    webp: wordPhoneWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADwAQCdASoQAAwAA4BaJYgCdAEDH44DmgAA/vYTQm/vIZe1aCgCn/hu9iXw8943v9ekm0trF6n83HXXXWGCbsMa0QAAAA==',
    alt: 'A mobile phone',
    srcSet: {
      avif: `${wordPhoneAvif160} 160w, ${wordPhoneAvif} 320w`,
      webp: `${wordPhoneWebp160} 160w, ${wordPhoneWebp} 320w`,
    },
  },
  email: {
    avif: wordEmailAvif,
    webp: wordEmailWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADQAQCdASoQAAwAA4BaJQBOgCHfj8f+AAD+9gL/mB3OyE7o26+E4ipN+xDkc3/sn+jSxSmqgAA=',
    alt: 'An envelope with an at symbol',
    srcSet: {
      avif: `${wordEmailAvif160} 160w, ${wordEmailAvif} 320w`,
      webp: `${wordEmailWebp160} 160w, ${wordEmailWebp} 320w`,
    },
  },
  file: {
    avif: wordFileAvif,
    webp: wordFileWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAABwAQCdASoQAAwAA4BaJbACdAGgAAD+8TKH8ruHVQ/MJa63szv+zoh7wkiqbhHcL0ZIlzzjMECWaC7wsEAAAA==',
    alt: 'A file folder',
    srcSet: {
      avif: `${wordFileAvif160} 160w, ${wordFileAvif} 320w`,
      webp: `${wordFileWebp160} 160w, ${wordFileWebp} 320w`,
    },
  },
  bus: {
    avif: wordBusAvif,
    webp: wordBusWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAQCdASoQAAwAA4BaJbACdAEO/FXcAAD+9gL/vOQVujq9bkZdlXY+QvGIlRj6Qv2FbeduwoRYqLHEh0NF89GkMsuIDtP/+eAAAA==',
    alt: 'A bus',
    srcSet: {
      avif: `${wordBusAvif160} 160w, ${wordBusAvif} 320w`,
      webp: `${wordBusWebp160} 160w, ${wordBusWebp} 320w`,
    },
  },
  train: {
    avif: wordTrainAvif,
    webp: wordTrainWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAQAgCdASoQAAwAA4BaJYgCdAYr7tylnBwAAP72ErCOGEKLd0HMrrOzR5faDk5fOsvt2ovElLKctIAgkm6UwTIKtHuwt3RnouVUr5eAAAA=',
    alt: 'A train',
    srcSet: {
      avif: `${wordTrainAvif160} 160w, ${wordTrainAvif} 320w`,
      webp: `${wordTrainWebp160} 160w, ${wordTrainWebp} 320w`,
    },
  },
  station: {
    avif: wordStationAvif,
    webp: wordStationWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADwAQCdASoQAAwAA4BaJYwCdAERHuFIgAAA/vYQ2Em4ziaLkLWqvlbVNypl1z5018AQ/kcg8ftxOlew0e2QAA==',
    alt: 'A train station',
    srcSet: {
      avif: `${wordStationAvif160} 160w, ${wordStationAvif} 320w`,
      webp: `${wordStationWebp160} 160w, ${wordStationWebp} 320w`,
    },
  },
  ticket: {
    avif: wordTicketAvif,
    webp: wordTicketWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADQAQCdASoQAAwAA4BaJQBOgCHfkAFMgAD+9gT/GXAO7u8DP0Mi/a/VIPBS73dhgv83CeVtsXAAAA==',
    alt: 'An admission ticket',
    srcSet: {
      avif: `${wordTicketAvif160} 160w, ${wordTicketAvif} 320w`,
      webp: `${wordTicketWebp160} 160w, ${wordTicketWebp} 320w`,
    },
  },
  hotel: {
    avif: wordHotelAvif,
    webp: wordHotelWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADwAQCdASoQAAwAA4BaJZgCdAEe1H2+J5AA/vYSL6IVs47ADQC33zjSQGTted5bGGpO0GIZgCGMENxlvB49HE7z4cvPnnboAAA=',
    alt: 'A hotel building',
    srcSet: {
      avif: `${wordHotelAvif160} 160w, ${wordHotelAvif} 320w`,
      webp: `${wordHotelWebp160} 160w, ${wordHotelWebp} 320w`,
    },
  },
  luggage: {
    avif: wordLuggageAvif,
    webp: wordLuggageWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAABwAgCdASoQAAwAA4BaJbACdFQAuwAFFj4qs/AAAP72EXNnDSl2QrJqGOMbuyYQW3YbneYRIK3RQDpemdd126bJbHRyHLTO+ZByHwe/o1HflZrkAAA=',
    alt: 'A rolling suitcase',
    srcSet: {
      avif: `${wordLuggageAvif160} 160w, ${wordLuggageAvif} 320w`,
      webp: `${wordLuggageWebp160} 160w, ${wordLuggageWebp} 320w`,
    },
  },
  plane: {
    avif: wordPlaneAvif,
    webp: wordPlaneWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADQAQCdASoQAAwAA4BaJYgCdAD5PHmRAAD+9N/X44Kreg832LVuNLopdcbHUkuJEZYrUzIPXeFRP25oA1KQBxDkYatgAA==',
    alt: 'An airplane',
    srcSet: {
      avif: `${wordPlaneAvif160} 160w, ${wordPlaneAvif} 320w`,
      webp: `${wordPlaneWebp160} 160w, ${wordPlaneWebp} 320w`,
    },
  },
  road: {
    avif: wordRoadAvif,
    webp: wordRoadWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAABwAgCdASoQAAwAA4BaJQBOiP/7I3Bmq1njA+nIAP72Eo6FnHVL4E1v6hO/HGwkYKv+fmSjUm5sfkj7zU2AH6Qt1bo9sEKt65bej1YrF3bMKE9HwAA=',
    alt: 'A motorway',
    srcSet: {
      avif: `${wordRoadAvif160} 160w, ${wordRoadAvif} 320w`,
      webp: `${wordRoadWebp160} 160w, ${wordRoadWebp} 320w`,
    },
  },
  country: {
    // Vector, not the photo pipeline the rest of `wordArt` uses — a flag reads better as flat
    // colour than a raster photo, and it's the same crisp asset at any width, so there's no
    // avif/srcSet pair to offer.
    webp: wordCountrySvg,
    width: 320,
    height: 240,
    alt: 'The flag of India',
  },
  city: {
    avif: wordCityAvif,
    webp: wordCityWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADQAQCdASoQAAwAA4BaJbACdAD5O0vWAAD+9N+9bF4rTHBdYcDI2pH0QaqUOtQUL/eauCvXBxYD8aGWb7QDGGpg0piuA33cAEXhD8fAAAA=',
    alt: 'A city skyline',
    srcSet: {
      avif: `${wordCityAvif160} 160w, ${wordCityAvif} 320w`,
      webp: `${wordCityWebp160} 160w, ${wordCityWebp} 320w`,
    },
  },
  passport: {
    avif: wordPassportAvif,
    webp: wordPassportWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAAAQAgCdASoQAAwAA4BaJbACdAYr7jNOSvxAAP72E5g5109cvuey7BOlYJydy92veCTvzBF0XY2zeEOWWq88f4W022dnDXvs4OdcXKLQWcn5pfMPyf47uJy8AAA=',
    alt: 'A passport control sign',
    srcSet: {
      avif: `${wordPassportAvif160} 160w, ${wordPassportAvif} 320w`,
      webp: `${wordPassportWebp160} 160w, ${wordPassportWebp} 320w`,
    },
  },
  trip: {
    avif: wordTripAvif,
    webp: wordTripWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADQAQCdASoQAAwAA4BaJYgCdAELXOnwAAD+9NUE6jE+6VJPLqt/ls8nXlhuasffE3NLNr/0n5xRBBpcGNoAAA==',
    alt: 'An airplane departing',
    srcSet: {
      avif: `${wordTripAvif160} 160w, ${wordTripAvif} 320w`,
      webp: `${wordTripWebp160} 160w, ${wordTripWebp} 320w`,
    },
  },
  map: {
    avif: wordMapAvif,
    webp: wordMapWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAAAwAgCdASoQAAwAA4BaJbACdFQAA5WjDb5wAAD+9goStF7R73FAyq927//mulOGPeRkungymDoWdUHRV4+/X7FmejHqYAAA',
    alt: 'A world map',
    srcSet: {
      avif: `${wordMapAvif160} 160w, ${wordMapAvif} 320w`,
      webp: `${wordMapWebp160} 160w, ${wordMapWebp} 320w`,
    },
  },
  beach: {
    avif: wordBeachAvif,
    webp: wordBeachWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAAAQAgCdASoQAAwAA4BaJbACdAELYGLvSMgAAP72ESNLYL+69RKDEc7b4tekAVZuwLlA/1ImI3iRj3eoFbfssdd20DTgJkRYln67WAAA',
    alt: 'A beach with an umbrella',
    srcSet: {
      avif: `${wordBeachAvif160} 160w, ${wordBeachAvif} 320w`,
      webp: `${wordBeachWebp160} 160w, ${wordBeachWebp} 320w`,
    },
  },
  'to-write': {
    avif: wordToWriteAvif,
    webp: wordToWriteWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoQAAwAA4BaJbACdAEO/00DzAAA/vYJhgdXeh+7tYKIDIAZEEKZx8MLUiJhDr7fjN57RvN630c4NIE6DpTIfAAA',
    alt: 'A hand writing with a pen',
    srcSet: {
      avif: `${wordToWriteAvif160} 160w, ${wordToWriteAvif} 320w`,
      webp: `${wordToWriteWebp160} 160w, ${wordToWriteWebp} 320w`,
    },
  },
  'to-read': {
    avif: wordToReadAvif,
    webp: wordToReadWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACwAQCdASoQAAwAA4BaJQBOgCHfSdugAP72BLveyiMnkLbxVS2ZrdxXimXVRiAA',
    alt: 'An open book',
    srcSet: {
      avif: `${wordToReadAvif160} 160w, ${wordToReadAvif} 320w`,
      webp: `${wordToReadWebp160} 160w, ${wordToReadWebp} 320w`,
    },
  },
  'to-speak': {
    avif: wordToSpeakAvif,
    webp: wordToSpeakWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADwAQCdASoQAAwAA4BaJZQCdADp9BPJ4EAA/vYSIvWWYKOe0Xsdd0zcoDGkTRur1qcBEYXcof39Q/WaU9BoRe1bNTM/+YFhqydcAAAA',
    alt: 'A speaking head with sound waves',
    srcSet: {
      avif: `${wordToSpeakAvif160} 160w, ${wordToSpeakAvif} 320w`,
      webp: `${wordToSpeakWebp160} 160w, ${wordToSpeakWebp} 320w`,
    },
  },
  'to-drink': {
    avif: wordToDrinkAvif,
    webp: wordToDrinkWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADwAQCdASoQAAwAA4BaJZgCdAEO+oru6gAA/vTRwXN3JQ/hGXRpJLBeWiCVfSEY7xxNORhxaEgAAA==',
    alt: 'A glass of water',
    srcSet: {
      avif: `${wordToDrinkAvif160} 160w, ${wordToDrinkAvif} 320w`,
      webp: `${wordToDrinkWebp160} 160w, ${wordToDrinkWebp} 320w`,
    },
  },
  'to-eat': {
    avif: wordToEatAvif,
    webp: wordToEatWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAADQAQCdASoQAAwAA4BaJQBOgCHfj2CQAAD+9hCqiydTePpQ42oHlFG0/TCdyB0tY4AAAA==',
    alt: 'A fork and knife',
    srcSet: {
      avif: `${wordToEatAvif160} 160w, ${wordToEatAvif} 320w`,
      webp: `${wordToEatWebp160} 160w, ${wordToEatWebp} 320w`,
    },
  },
  'to-play': {
    avif: wordToPlayAvif,
    webp: wordToPlayWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoQAAwAA4BaJQAB8S4OAKV7ksAA/vTWI/ZC0qmoy6jYilv+uqeyaZtZWordZcxyDrKwYXc/DYHQ+1VcwAA=',
    alt: 'A video game controller',
    srcSet: {
      avif: `${wordToPlayAvif160} 160w, ${wordToPlayAvif} 320w`,
      webp: `${wordToPlayWebp160} 160w, ${wordToPlayWebp} 320w`,
    },
  },
  'to-help': {
    avif: wordToHelpAvif,
    webp: wordToHelpWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADwAQCdASoQAAwAA4BaJbACdAEO9tt3MRAA/vYKDxeylPeORhzbyL/bleoVJbdbfiQA3LRoNIE6EywwIAA=',
    alt: 'Two hands shaking',
    srcSet: {
      avif: `${wordToHelpAvif160} 160w, ${wordToHelpAvif} 320w`,
      webp: `${wordToHelpWebp160} 160w, ${wordToHelpWebp} 320w`,
    },
  },
  'to-work': {
    avif: wordToWorkAvif,
    webp: wordToWorkWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADQAQCdASoQAAwAA4BaJZQAAu18dDpBQAD+9grP+xyoPKRH73d/oax6rhyPH7i/zopz8Fj0C2aXocTha/Wgmvuk1ZTpmwAA',
    alt: 'A briefcase',
    srcSet: {
      avif: `${wordToWorkAvif160} 160w, ${wordToWorkAvif} 320w`,
      webp: `${wordToWorkWebp160} 160w, ${wordToWorkWebp} 320w`,
    },
  },
  'to-see': {
    avif: wordToSeeAvif,
    webp: wordToSeeWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoQAAwAA4BaJYwCdAEO/D7ZYAD+9gL/1HnP2eV1yl/3194dkmdOOKxMtHKy9UseyeqPtoQAAAA=',
    alt: 'A pair of eyes looking to the side',
    srcSet: {
      avif: `${wordToSeeAvif160} 160w, ${wordToSeeAvif} 320w`,
      webp: `${wordToSeeWebp160} 160w, ${wordToSeeWebp} 320w`,
    },
  },
  'to-open': {
    avif: wordToOpenAvif,
    webp: wordToOpenWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADQAQCdASoQAAwAA4BaJbACdAEO/DfIAAD+9goTLuEhjxyOfiZDbuaxw5WUpZH+K+w3CeVt0o0AAA==',
    alt: 'An open file folder',
    srcSet: {
      avif: `${wordToOpenAvif160} 160w, ${wordToOpenAvif} 320w`,
      webp: `${wordToOpenWebp160} 160w, ${wordToOpenWebp} 320w`,
    },
  },
  farmer: {
    avif: wordFarmerAvif,
    webp: wordFarmerWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAABQAgCdASoQAAwAA4BaJbACdH8AFwx3uTGKFAAA/vYTzoi6AQPGxwx2ddX78u2Ie2JNDC63jkdMSV0E1ygYMvvDRy3QPwHmKmZA9ewx7dVkKDYSLmeuNmHDOHYAAA==',
    alt: 'A farmer holding a pitchfork',
    srcSet: {
      avif: `${wordFarmerAvif160} 160w, ${wordFarmerAvif} 320w`,
      webp: `${wordFarmerWebp160} 160w, ${wordFarmerWebp} 320w`,
    },
  },
  cook: {
    avif: wordCookAvif,
    webp: wordCookWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADQAQCdASoQAAwAA4BaJaACdAELXijMAAD+9hEjS0/vLahxegu4RoywyyrUSajea/WEuAIgNIeAA1VfK6BbYBLWD5VGgAAA',
    alt: 'A cook in a chef hat',
    srcSet: {
      avif: `${wordCookAvif160} 160w, ${wordCookAvif} 320w`,
      webp: `${wordCookWebp160} 160w, ${wordCookWebp} 320w`,
    },
  },
  'thank-you': {
    avif: wordThankYouAvif,
    webp: wordThankYouWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAwAgCdASoQAAwAA4BaJbACdAYqDvt6TaQyCAD+9grP9Jv4VgX1ic+PhYrPM2HB67r74Hc6qc3Q8nmPLkXOGWpzokU6cmb/VrGtnBz27blfQAAA',
    alt: 'Two folded hands',
    srcSet: {
      avif: `${wordThankYouAvif160} 160w, ${wordThankYouAvif} 320w`,
      webp: `${wordThankYouWebp160} 160w, ${wordThankYouWebp} 320w`,
    },
  },
  sorry: {
    avif: wordSorryAvif,
    webp: wordSorryWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAABQAgCdASoQAAwAA4BaJbACdH8G6AA5WpZ1kMgA/vTckkuz+M/FaOtkg9RwzVquFS3tNSUCwtLdXFe2FlMdnZFybSfAVJ3NuU0J5RvFw0nWBZIAAAA=',
    alt: 'A pleading face with large eyes',
    srcSet: {
      avif: `${wordSorryAvif160} 160w, ${wordSorryAvif} 320w`,
      webp: `${wordSorryWebp160} 160w, ${wordSorryWebp} 320w`,
    },
  },
  'to-wear': {
    avif: wordToWearAvif,
    webp: wordToWearWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoQAAwAA4BaJYgCdAEN5TqDQAAA/vYK0luJDMNljf3OzatmhZ1u+MTCtmXS/TMzZfRy1tL0g06gMXgAAAA=',
    alt: 'A coat on a hanger',
    srcSet: {
      avif: `${wordToWearAvif160} 160w, ${wordToWearAvif} 320w`,
      webp: `${wordToWearWebp160} 160w, ${wordToWearWebp} 320w`,
    },
  },
  shoes: {
    avif: wordShoesAvif,
    webp: wordShoesWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADQAQCdASoQAAwAA4BaJQBOgCHfM5iWjAD+9hKyOtrxlQPXhwNa/7ekbZh/MQ3ZwaCSIuoN095AAA==',
    alt: 'A running shoe',
    srcSet: {
      avif: `${wordShoesAvif160} 160w, ${wordShoesAvif} 320w`,
      webp: `${wordShoesWebp160} 160w, ${wordShoesWebp} 320w`,
    },
  },
  holiday: {
    avif: wordHolidayAvif,
    webp: wordHolidayWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoQAAwAA4BaJbACdAEPAYEL8AAA/vYSsjq0QyvHi+a1cvhIJ9D08RwhDY3lzUu91iV8sdOSWxnyzOHYlcxTagAA',
    alt: 'A palm tree',
    srcSet: {
      avif: `${wordHolidayAvif160} 160w, ${wordHolidayAvif} 320w`,
      webp: `${wordHolidayWebp160} 160w, ${wordHolidayWebp} 320w`,
    },
  },
  pain: {
    avif: wordPainAvif,
    webp: wordPainWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADwAQCdASoQAAwAA4BaJbACdAEPAG3weNgA/vYQlBU+A0IxTKgdyyG2NypHrO5h4dxt+aVWTzekOAWUFzCaYGv9AoAAAA==',
    alt: 'A face with a head bandage',
    srcSet: {
      avif: `${wordPainAvif160} 160w, ${wordPainAvif} 320w`,
      webp: `${wordPainWebp160} 160w, ${wordPainWebp} 320w`,
    },
  },
  illness: {
    avif: wordIllnessAvif,
    webp: wordIllnessWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAABQAgCdASoQAAwAA4BaJbACdH8G6AA4lCRVLAAA/vYRF7g68DXvk2UXG3LLoFsXjEblJ/AERBgHQl8SoglxFyp3o73AX2a7Svkcm8MlVwCuSAAA',
    alt: 'A face with a thermometer',
    srcSet: {
      avif: `${wordIllnessAvif160} 160w, ${wordIllnessAvif} 320w`,
      webp: `${wordIllnessWebp160} 160w, ${wordIllnessWebp} 320w`,
    },
  },
  number: {
    avif: wordNumberAvif,
    webp: wordNumberWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAAAQAgCdASoQAAwAA4BaJbACdFQAAy7uOdQAAP72E5gynRj1bT9NtLlTrr6KKCZlsk2xscHaW1f7oTQZVGVcf3dbAJ226jaLuS9notaqx2LFiZpeXgAAAA==',
    alt: 'An input field with numbers',
    srcSet: {
      avif: `${wordNumberAvif160} 160w, ${wordNumberAvif} 320w`,
      webp: `${wordNumberWebp160} 160w, ${wordNumberWebp} 320w`,
    },
  },
  month: {
    avif: wordMonthAvif,
    webp: wordMonthWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoQAAwAA4BaJZACdADwqivWoAD+9hOdVUQC+bp/1MqVy8csd7YIrDH6aciiGZIr8NOvidWxIAA=',
    alt: 'A spiral-bound calendar',
    srcSet: {
      avif: `${wordMonthAvif160} 160w, ${wordMonthAvif} 320w`,
      webp: `${wordMonthWebp160} 160w, ${wordMonthWebp} 320w`,
    },
  },
  hour: {
    avif: wordHourAvif,
    webp: wordHourWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAQAgCdASoQAAwAA4BaJYgC7AYsZR8xYf4QAP72E+BGO0eFH8pouYTzYWFbJCYs0Q8/KWV0BqxbG7zSL0zhRmcMM5a98abZR2Yo0iSgAAA=',
    alt: 'A wristwatch',
    srcSet: {
      avif: `${wordHourAvif160} 160w, ${wordHourAvif} 320w`,
      webp: `${wordHourWebp160} 160w, ${wordHourWebp} 320w`,
    },
  },
  minute: {
    avif: wordMinuteAvif,
    webp: wordMinuteWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAABQAgCdASoQAAwAA4BaJZwC7AYqrwfIqql4iAAA/vYS8tfr+GN/6jwlYMUEV/lLNcKYWhvURKsQlhjMer5uMTUaNeo5ZzKjgAA=',
    alt: 'A stopwatch',
    srcSet: {
      avif: `${wordMinuteAvif160} 160w, ${wordMinuteAvif} 320w`,
      webp: `${wordMinuteWebp160} 160w, ${wordMinuteWebp} 320w`,
    },
  },
  time: {
    avif: wordTimeAvif,
    webp: wordTimeWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAAAwAgCdASoQAAwAA4BaJaACdAYt9vtvXVjgAAD+9hKwh8ALABk9elzpfpIUGz3zdgvn2cfMae8FNyN8VQkdAisM1t0TctEUU+VwAA==',
    alt: 'A mantelpiece clock',
    srcSet: {
      avif: `${wordTimeAvif160} 160w, ${wordTimeAvif} 320w`,
      webp: `${wordTimeWebp160} 160w, ${wordTimeWebp} 320w`,
    },
  },
  night: {
    avif: wordNightAvif,
    webp: wordNightWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADQAQCdASoQAAwAA4BaJQAAVUf9Xi/uAAD+9NUf9uI+W7ZpFxHRsMRnwpxZ7YnszTkRTx6t9TqZGXKj7V2ITQqNq3+Y9uYAAAA=',
    alt: 'A night sky with stars',
    srcSet: {
      avif: `${wordNightAvif160} 160w, ${wordNightAvif} 320w`,
      webp: `${wordNightWebp160} 160w, ${wordNightWebp} 320w`,
    },
  },
  pupil: {
    avif: wordPupilAvif,
    webp: wordPupilWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADwAQCdASoQAAwAA4BaJZACdADdI2IRZkAA/vYTp6dD76cp92Wx2LvxC3YWIhNPRsOms0D4o2g1K3d4QEo8nhshTIBse709RDL6OoG7G5W3AAAA',
    alt: 'A student',
    srcSet: {
      avif: `${wordPupilAvif160} 160w, ${wordPupilAvif} 320w`,
      webp: `${wordPupilWebp160} 160w, ${wordPupilWebp} 320w`,
    },
  },
  professor: {
    avif: wordProfessorAvif,
    webp: wordProfessorWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADQAQCdASoQAAwAA4BaJbACdAEefoY1QAD+9hIvrHHs35Wky7A7Y2MU+OjYq1MnCx8VBMn4CCq9hgPFkKNbzVLu1r6MKc+tMTxiT3xUOruBVigA',
    alt: 'A teacher',
    srcSet: {
      avif: `${wordProfessorAvif160} 160w, ${wordProfessorAvif} 320w`,
      webp: `${wordProfessorWebp160} 160w, ${wordProfessorWebp} 320w`,
    },
  },
  certificate: {
    avif: wordCertificateAvif,
    webp: wordCertificateWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADwAQCdASoQAAwAA4BaJbACdAEVz0FdzAAA/vYQ4NFRnuPzo2G7upTaZZ26r0P6VPqSc3SKAAA=',
    alt: 'A rolled scroll',
    srcSet: {
      avif: `${wordCertificateAvif160} 160w, ${wordCertificateAvif} 320w`,
      webp: `${wordCertificateWebp160} 160w, ${wordCertificateWebp} 320w`,
    },
  },
  knowledge: {
    avif: wordKnowledgeAvif,
    webp: wordKnowledgeWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADQAQCdASoQAAwAA4BaJQBOgCFryjNoAAD+9hEV8uAkdgqS6WI5ml3v+jTMX+PpbVefA4DeJS4AAA==',
    alt: 'A glowing light bulb',
    srcSet: {
      avif: `${wordKnowledgeAvif160} 160w, ${wordKnowledgeAvif} 320w`,
      webp: `${wordKnowledgeWebp160} 160w, ${wordKnowledgeWebp} 320w`,
    },
  },
  market: {
    avif: wordMarketAvif,
    webp: wordMarketWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADQAQCdASoQAAwAA4BaJQBOgB7Hiv9MAAD+9hPImjZtPLQgBjPtBgAkc4M94rlITsPqvK8k8c5Mm7DuSTE1wAAA',
    alt: 'A department store building',
    srcSet: {
      avif: `${wordMarketAvif160} 160w, ${wordMarketAvif} 320w`,
      webp: `${wordMarketWebp160} 160w, ${wordMarketWebp} 320w`,
    },
  },
  price: {
    avif: wordPriceAvif,
    webp: wordPriceWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAAAQAgCdASoQAAwAA4BaJZACdH8AGBqsclIgAP73BtX3GKFFcIy0N2HOotpCMF+sviho6gZULLD64sbioAA=',
    alt: 'A price label',
    srcSet: {
      avif: `${wordPriceAvif160} 160w, ${wordPriceAvif} 320w`,
      webp: `${wordPriceWebp160} 160w, ${wordPriceWebp} 320w`,
    },
  },
  expensive: {
    avif: wordExpensiveAvif,
    webp: wordExpensiveWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADwAQCdASoQAAwAA4BaJagCdAEO/Hnz8gAA/vYE/9j/KSYEHahEvIGiX+4JMLN94n7LUuA5nMW8cWwUZrgAAA==',
    alt: 'A blue gem stone',
    srcSet: {
      avif: `${wordExpensiveAvif160} 160w, ${wordExpensiveAvif} 320w`,
      webp: `${wordExpensiveWebp160} 160w, ${wordExpensiveWebp} 320w`,
    },
  },
  'to-buy': {
    avif: wordToBuyAvif,
    webp: wordToBuyWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAACQAQCdASoQAAwAA4BaJQAAXIGlUgAA/vYKOF4I1HT7hT2mzYmNnSer9gd0fj6obgAAAA==',
    alt: 'A shopping cart',
    srcSet: {
      avif: `${wordToBuyAvif160} 160w, ${wordToBuyAvif} 320w`,
      webp: `${wordToBuyWebp160} 160w, ${wordToBuyWebp} 320w`,
    },
  },
  clothes: {
    avif: wordClothesAvif,
    webp: wordClothesWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADQAQCdASoQAAwAA4BaJbACdADdF7yGAAD+9hPgRkLtCPiMdRYaXsG5ZplArcKmVe1MwKEz/kFgZw35dH9BLUMa99snkYk14DvbhiAA',
    alt: 'A pair of folded jeans',
    srcSet: {
      avif: `${wordClothesAvif160} 160w, ${wordClothesAvif} 320w`,
      webp: `${wordClothesWebp160} 160w, ${wordClothesWebp} 320w`,
    },
  },
  program: {
    avif: wordProgramAvif,
    webp: wordProgramWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAADQAQCdASoQAAwAA4BaJZwAAudQTrdQAAD+9hCOEIoDBcvVCiDvCjDyAAA=',
    alt: 'A mechanical gear',
    srcSet: {
      avif: `${wordProgramAvif160} 160w, ${wordProgramAvif} 320w`,
      webp: `${wordProgramWebp160} 160w, ${wordProgramWebp} 320w`,
    },
  },
  lawyer: {
    avif: wordLawyerAvif,
    webp: wordLawyerWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAADQAQCdASoQAAwAA4BaJZQAAudVjq4wAAD+9gL6X7uwDLObi/iU2LU1sEAAAA==',
    alt: 'A balance scale',
    srcSet: {
      avif: `${wordLawyerAvif160} 160w, ${wordLawyerAvif} 320w`,
      webp: `${wordLawyerWebp160} 160w, ${wordLawyerWebp} 320w`,
    },
  },
  happy: {
    avif: wordHappyAvif,
    webp: wordHappyWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAABQAgCdASoQAAwAA4BaJbACdDBOwZFOZXZskAAA/vYRI0oiN32N4uq/PuFeRzqCB9SkWX32RUwSr79Ia6wDcPB8kIe5EO/4nKCWoIRTZqJqpfPf0QAAAA==',
    alt: 'A grinning smiley face',
    srcSet: {
      avif: `${wordHappyAvif160} 160w, ${wordHappyAvif} 320w`,
      webp: `${wordHappyWebp160} 160w, ${wordHappyWebp} 320w`,
    },
  },
  hot: {
    avif: wordHotAvif,
    webp: wordHotWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAAAwAgCdASoQAAwAA4BaJbACdAEQ/dUBOTaQAAD+9NUCYD6wETdtvshE9SVJ1tbYMSvGxGJODDZJkvx5Uhss/aWvgLjn5TsNSAA=',
    alt: 'A flame',
    srcSet: {
      avif: `${wordHotAvif160} 160w, ${wordHotAvif} 320w`,
      webp: `${wordHotWebp160} 160w, ${wordHotWebp} 320w`,
    },
  },
  sad: {
    avif: wordSadAvif,
    webp: wordSadWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAACwAgCdASoQAAwAA4BaJbACdIDf6AFOuX+xk76oPgAA/vYSsIlOm9aw6SNRO1fjScZmCxXvzxb1nEusS+uZ2HCMLJZNNy07jZDWTPwzRLnLVIfDxoAAAA==',
    alt: 'A crying face',
    srcSet: {
      avif: `${wordSadAvif160} 160w, ${wordSadAvif} 320w`,
      webp: `${wordSadWebp160} 160w, ${wordSadWebp} 320w`,
    },
  },
  strong: {
    avif: wordStrongAvif,
    webp: wordStrongWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoQAAwAA4BaJbACdAEO+oXu6AAA/vYKNzFxeOoKoRR/ONDHUBuwb1/qBdmys1bAnuecX/oFmY0HMr1AAAA=',
    alt: 'A flexed bicep',
    srcSet: {
      avif: `${wordStrongAvif160} 160w, ${wordStrongAvif} 320w`,
      webp: `${wordStrongWebp160} 160w, ${wordStrongWebp} 320w`,
    },
  },
  hair: {
    avif: wordHairAvif,
    webp: wordHairWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAQCdASoQAAwAA4BaJbACdADwwDF5AAD+9hPekO0ULgRQdy7wVap9tHsdJVBbo++v94S62Se+9rg6OvWxdsf4WqcNJaMPngAAAA==',
    alt: 'A person with curly hair',
    srcSet: {
      avif: `${wordHairAvif160} 160w, ${wordHairAvif} 320w`,
      webp: `${wordHairWebp160} 160w, ${wordHairWebp} 320w`,
    },
  },
  head: {
    avif: wordHeadAvif,
    webp: wordHeadWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAAAQAgCdASoQAAwAA4BaJagCdAEN5Nhq+uZeAP72ERe5b/Qealgw5hWFGP78O3NuS6ZLN94n7LU44QAA',
    alt: 'A brain',
    srcSet: {
      avif: `${wordHeadAvif160} 160w, ${wordHeadAvif} 320w`,
      webp: `${wordHeadWebp160} 160w, ${wordHeadWebp} 320w`,
    },
  },
  health: {
    avif: wordHealthAvif,
    webp: wordHealthWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAAAQAgCdASoQAAwAA4BaJaACdAEO/1WNq3IAAP72ERfCjqjabPkcRYADobQ+U11KxsDp+uCUcadGcflsbNucAAAA',
    alt: 'A medical cross symbol',
    srcSet: {
      avif: `${wordHealthAvif160} 160w, ${wordHealthAvif} 320w`,
      webp: `${wordHealthWebp160} 160w, ${wordHealthWebp} 320w`,
    },
  },
  hello: {
    avif: wordHelloAvif,
    webp: wordHelloWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADQAQCdASoQAAwAA4BaJbACdAEN5SJzAAD+9whS8n5mN+7FcR8MNwTpnlgOnKdt+OksfM5X6D6l0r1gxUgGMLEtcAA=',
    alt: 'An open waving hand',
    srcSet: {
      avif: `${wordHelloAvif160} 160w, ${wordHelloAvif} 320w`,
      webp: `${wordHelloWebp160} 160w, ${wordHelloWebp} 320w`,
    },
  },
  'good-evening': {
    avif: wordGoodEveningAvif,
    webp: wordGoodEveningWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADQAQCdASoQAAwAA4BaJbACdADwvsswAAD+9N7+uVXg54LK5HznuXMTD7vt9/iLat7typm9oQlqNvpLYLaxU6PZiurzGKbX5H+WeJfnjwON2vtOLbQRjKjAAAA=',
    alt: 'A pink and orange sunset over hills',
    srcSet: {
      avif: `${wordGoodEveningAvif160} 160w, ${wordGoodEveningAvif} 320w`,
      webp: `${wordGoodEveningWebp160} 160w, ${wordGoodEveningWebp} 320w`,
    },
  },
  congratulations: {
    avif: wordCongratulationsAvif,
    webp: wordCongratulationsWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADwAQCdASoQAAwAA4BaJZACsAEN4YNimAAA/vYQqYdquZu9mJY4gd4SaYpmG+XwvMro5jy6BVAstI7wAAA=',
    alt: 'A party popper with confetti bursting out',
    srcSet: {
      avif: `${wordCongratulationsAvif160} 160w, ${wordCongratulationsAvif} 320w`,
      webp: `${wordCongratulationsWebp160} 160w, ${wordCongratulationsWebp} 320w`,
    },
  },
  week: {
    avif: wordWeekAvif,
    webp: wordWeekWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADQAQCdASoQAAwAA4BaJYgCdADwqgIcAAD+9hPIml4KbzaDxi4xvCFtpv2PGiofA2F2QhFt9iexMvAA',
    alt: 'A tear-off desk calendar',
    srcSet: {
      avif: `${wordWeekAvif160} 160w, ${wordWeekAvif} 320w`,
      webp: `${wordWeekWebp160} 160w, ${wordWeekWebp} 320w`,
    },
  },
  exam: {
    avif: wordExamAvif,
    webp: wordExamWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADwAQCdASoQAAwAA4BaJZgCsAEO+DmDTMAA/vTUGd/8RdfpbSBSIOz+H/nMX/BPMTfTzQAA',
    alt: 'A memo pad with a pencil, ready for notes',
    srcSet: {
      avif: `${wordExamAvif160} 160w, ${wordExamAvif} 320w`,
      webp: `${wordExamWebp160} 160w, ${wordExamWebp} 320w`,
    },
  },
  internet: {
    avif: wordInternetAvif,
    webp: wordInternetWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADwAQCdASoQAAwAA4BaJbACdAEPhoIKLSAA/vYRI0kNsCAeT5yHJpuqknkANOSxZmW65W+329YPZDeAAAA=',
    alt: 'A globe crossed with lines of longitude and latitude',
    srcSet: {
      avif: `${wordInternetAvif160} 160w, ${wordInternetAvif} 320w`,
      webp: `${wordInternetWebp160} 160w, ${wordInternetWebp} 320w`,
    },
  },
  project: {
    avif: wordProjectAvif,
    webp: wordProjectWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoQAAwAA4BaJagCdAEO9tNLgAD+9hKyMVEunOYSAMOTcnJcsbPIbncajZgDTfqQ+RUU+VwAAAA=',
    alt: 'A clipboard with a checklist',
    srcSet: {
      avif: `${wordProjectAvif160} 160w, ${wordProjectAvif} 320w`,
      webp: `${wordProjectWebp160} 160w, ${wordProjectWebp} 320w`,
    },
  },
  screen: {
    avif: wordScreenAvif,
    webp: wordScreenWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADQAQCdASoQAAwAA4BaJYgCdADwyAm+wAD+9N+Ct+zKvlN6CGF78GpmjVORgruzLO7RJV8fDCg76P0SItfMXkiB3qCAAA==',
    alt: 'A desktop computer monitor and stand',
    srcSet: {
      avif: `${wordScreenAvif160} 160w, ${wordScreenAvif} 320w`,
      webp: `${wordScreenWebp160} 160w, ${wordScreenWebp} 320w`,
    },
  },
  journalist: {
    avif: wordJournalistAvif,
    webp: wordJournalistWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoQAAwAA4BaJYwCsAEKnjh0AAD+9gnVu4hUYp+nwJOQK6Ni/41SVM7y77c5GSmZtJcqfkOQAAA=',
    alt: 'A microphone',
    srcSet: {
      avif: `${wordJournalistAvif160} 160w, ${wordJournalistAvif} 320w`,
      webp: `${wordJournalistWebp160} 160w, ${wordJournalistWebp} 320w`,
    },
  },
  office: {
    avif: wordOfficeAvif,
    webp: wordOfficeWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADQAQCdASoQAAwAA4BaJQBOgB6NuNUYAAD+9hPekJFwZ9LiBqr10Gl9uqBV5gZG1U7n+j5Uwb/7IcrQMEAAAA==',
    alt: 'An office building',
    srcSet: {
      avif: `${wordOfficeAvif160} 160w, ${wordOfficeAvif} 320w`,
      webp: `${wordOfficeWebp160} 160w, ${wordOfficeWebp} 320w`,
    },
  },
  cold: {
    avif: wordColdAvif,
    webp: wordColdWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoQAAwAA4BaJaACdAEN1kyowAAA/vYRF7lw7nsgc2EVd/8k3wsbuWKIarFtYUBAn0ejBmwOh7/89Cul5NCIAAAA',
    alt: 'A blue snowflake',
    srcSet: {
      avif: `${wordColdAvif160} 160w, ${wordColdAvif} 320w`,
      webp: `${wordColdWebp160} 160w, ${wordColdWebp} 320w`,
    },
  },
  delicious: {
    avif: wordDeliciousAvif,
    webp: wordDeliciousWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAQAgCdASoQAAwAA4BaJbACdAEPhoIKLcIAAP72ESNKIjd9sOwRswzh/PZ+qB+miCzJfHuNDe2wjL5eTa1e0mOIfpbdwyIgUv5DVRVH2AA=',
    alt: 'A face savoring delicious food',
    srcSet: {
      avif: `${wordDeliciousAvif160} 160w, ${wordDeliciousAvif} 320w`,
      webp: `${wordDeliciousWebp160} 160w, ${wordDeliciousWebp} 320w`,
    },
  },
  slow: {
    avif: wordSlowAvif,
    webp: wordSlowWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAAAQAgCdASoQAAwAA4BaJYgC7AEPAFOsM5IAAP72Av8AeBU9PMVA9kBbry0AYYsRS8clTgXGd2KZ+YgA',
    alt: 'A turtle',
    srcSet: {
      avif: `${wordSlowAvif160} 160w, ${wordSlowAvif} 320w`,
      webp: `${wordSlowWebp160} 160w, ${wordSlowWebp} 320w`,
    },
  },
  garden: {
    avif: wordGardenAvif,
    webp: wordGardenWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAAAQAgCdASoQAAwAA4BaJbACdAEPhuykMtmAAP72ChS6xHhAEHTROB0ulYCuaqVitykin/aCwygfQAAA',
    alt: 'A potted plant',
    srcSet: {
      avif: `${wordGardenAvif160} 160w, ${wordGardenAvif} 320w`,
      webp: `${wordGardenWebp160} 160w, ${wordGardenWebp} 320w`,
    },
  },
  breakfast: {
    avif: wordBreakfastAvif,
    webp: wordBreakfastWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoQAAwAA4BaJaACdAYrdvtEVmAA/vcEaYYJxnxTVODD1dP4IWpihgWlzdIA3p/k7grzeNNOXH/sH+HAAAA=',
    alt: 'A plate with apples, bananas, grapes, and strawberries',
    srcSet: {
      avif: `${wordBreakfastAvif160} 160w, ${wordBreakfastAvif} 320w`,
      webp: `${wordBreakfastWebp160} 160w, ${wordBreakfastWebp} 320w`,
    },
  },
  classroom: {
    avif: wordClassroomAvif,
    webp: wordClassroomWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAAAQAgCdASoQAAwAA4BaJYgCdAEKpVj00tsQAPkUFGZN6c1WIaWv1DgMuhL60tjIR7v7QP+XOT0XtC/6ktYlIEkY8njuZ8+BOcvG5d8+WvbnPSUfBdOud9YzQFzAunLzJTnO03X4AAA=',
    alt: 'A blackboard with ABC and a teacher holding a book',
    srcSet: {
      avif: `${wordClassroomAvif160} 160w, ${wordClassroomAvif} 320w`,
      webp: `${wordClassroomWebp160} 160w, ${wordClassroomWebp} 320w`,
    },
  },
  daughter: {
    avif: wordDaughterAvif,
    webp: wordDaughterWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADQAQCdASoQAAwAA4BaJbACdAEQ/dhioAD+9hCqYTTK5eyMmtV8QaU0G944s7ceGS5+OOvXTx+/RLVCWf5YVHMMcllfN8svMf1UYIAER1U0dEAA',
    alt: 'A young girl with a heart, representing a daughter',
    srcSet: {
      avif: `${wordDaughterAvif160} 160w, ${wordDaughterAvif} 320w`,
      webp: `${wordDaughterWebp160} 160w, ${wordDaughterWebp} 320w`,
    },
  },
  driver: {
    avif: wordDriverAvif,
    webp: wordDriverWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADwAQCdASoQAAwAA4BaJZACdAEO/HmuOAAA/vYE+/vg7LX2IjML7wenGHPThy31iywFwyCj1y8LpseBWEWueLx5MgAAAA==',
    alt: 'A man standing beside a car',
    srcSet: {
      avif: `${wordDriverAvif160} 160w, ${wordDriverAvif} 320w`,
      webp: `${wordDriverWebp160} 160w, ${wordDriverWebp} 320w`,
    },
  },
  goal: {
    avif: wordGoalAvif,
    webp: wordGoalWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAAAwAgCdASoQAAwAA4BaJagCsAYq/vtlPwYwAAD+9hEjQCNCZfDsHCev7t6H8KJ5O+mSlGiNSsJFFPIPJtG28mX8lp+dc+Bv1+LTPoAA',
    alt: 'A dart hitting the center of a target',
    srcSet: {
      avif: `${wordGoalAvif160} 160w, ${wordGoalAvif} 320w`,
      webp: `${wordGoalWebp160} 160w, ${wordGoalWebp} 320w`,
    },
  },
  employee: {
    avif: wordEmployeeAvif,
    webp: wordEmployeeWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADwAQCdASoQAAwAA4BaJQBOgBufK3NPUAAA/vYT3UZL9KDcaRkJkruSr+T5RaQhor9dayxhsIWLM7qj2GbXHWo0Rz3e02HfrQRj4oNAAAA=',
    alt: 'A man in a suit holding a briefcase',
    srcSet: {
      avif: `${wordEmployeeAvif160} 160w, ${wordEmployeeAvif} 320w`,
      webp: `${wordEmployeeWebp160} 160w, ${wordEmployeeWebp} 320w`,
    },
  },
  friend: {
    avif: wordFriendAvif,
    webp: wordFriendWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAABwAgCdASoQAAwAA4BaJbACdH8G6AA5W2Ghv1wAAP72Ba6UfNpH938Ef+Y4kysHuMTLa1T04BfSWOQ3rFjnVR1ooQoFThJoA5QAAA==',
    alt: 'Two boys shaking hands',
    srcSet: {
      avif: `${wordFriendAvif160} 160w, ${wordFriendAvif} 320w`,
      webp: `${wordFriendWebp160} 160w, ${wordFriendWebp} 320w`,
    },
  },
  food: {
    avif: wordFoodAvif,
    webp: wordFoodWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADwAQCdASoQAAwAA4BaJagCdAEO/8bGSBAA/vcEaVfQQq13jWqEknDSsg+i5jnhEYs2W3yIcJAAAA==',
    alt: 'A plate with rice and a chicken leg',
    srcSet: {
      avif: `${wordFoodAvif160} 160w, ${wordFoodAvif} 320w`,
      webp: `${wordFoodWebp160} 160w, ${wordFoodWebp} 320w`,
    },
  },
  fruit: {
    avif: wordFruitAvif,
    webp: wordFruitWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAAAQAgCdASoQAAwAA4BaJZACdAEPACUhI/MAAP72AvamOxWxgXgtNI+1WGbVOx6A02iL0HZbZuN96NvjZ5oAAA==',
    alt: 'A plate with tangerine, kiwi, pineapple, and watermelon',
    srcSet: {
      avif: `${wordFruitAvif160} 160w, ${wordFruitAvif} 320w`,
      webp: `${wordFruitWebp160} 160w, ${wordFruitWebp} 320w`,
    },
  },
  fast: {
    avif: wordFastAvif,
    webp: wordFastWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoQAAwAA4BaJZACdAYoBvtERgAA/vYRFe/nto06OHUQfvWxCeXhNcfEPqzXAJdeK/0bu/QCihHwdlAAAAA=',
    alt: 'A man running',
    srcSet: {
      avif: `${wordFastAvif160} 160w, ${wordFastAvif} 320w`,
      webp: `${wordFastWebp160} 160w, ${wordFastWebp} 320w`,
    },
  },
  family: {
    avif: wordFamilyAvif,
    webp: wordFamilyWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADQAQCdASoQAAwAA4BaJbACdAEOT6224AD+9gYN8Jhv4Ve8hLxTJilVELTuHXoFFJSclfEkcRDKDdMEmsBuiAmCPeolnb3KBfUad2AmmQWlobeAAAA=',
    alt: 'A father, mother, and child together',
    srcSet: {
      avif: `${wordFamilyAvif160} 160w, ${wordFamilyAvif} 320w`,
      webp: `${wordFamilyWebp160} 160w, ${wordFamilyWebp} 320w`,
    },
  },
  discount: {
    avif: wordDiscountAvif,
    webp: wordDiscountWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAACwAQCdASoQAAwAA4BaJYgC7AEG0EigAP73B6eaL6fOxxzdtJ7a8LEMBfFNFjrCG2EsYZ+TW6J6cR2NYv+83GBSqFaz/q/PTNPI2JgAAAA=',
    alt: 'A shopping cart with a 50% off badge',
    srcSet: {
      avif: `${wordDiscountAvif160} 160w, ${wordDiscountAvif} 320w`,
      webp: `${wordDiscountWebp160} 160w, ${wordDiscountWebp} 320w`,
    },
  },
  development: {
    avif: wordDevelopmentAvif,
    webp: wordDevelopmentWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoQAAwAA4BaJZgCdAEN35RLLwAA/vYKJDpadXkcXuWn1qEn5SmaLeWS4B7HPFUwfkAbedP9jHji+hs8cYvLUYgA',
    alt: 'A progress ring at seventy-two percent',
    srcSet: {
      avif: `${wordDevelopmentAvif160} 160w, ${wordDevelopmentAvif} 320w`,
      webp: `${wordDevelopmentWebp160} 160w, ${wordDevelopmentWebp} 320w`,
    },
  },
  homework: {
    avif: wordHomeworkAvif,
    webp: wordHomeworkWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAAAQAgCdASoQAAwAA4BaJbACdMn8BganvpgAAP73BQLw1r1tJnHUnTSS6j+oWEo91Ej2735TglJNrKsJ2Dz7e6oJpHYp2tHjGpa60NgXUPQidFP7Y/0MAA==',
    alt: 'A boy writing in a notebook with a pencil',
    srcSet: {
      avif: `${wordHomeworkAvif160} 160w, ${wordHomeworkAvif} 320w`,
      webp: `${wordHomeworkWebp160} 160w, ${wordHomeworkWebp} 320w`,
    },
  },
  idea: {
    avif: wordIdeaAvif,
    webp: wordIdeaWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADQAQCdASoQAAwAA4BaJbACdAEN3tZjYAD+9xBYVpNjAt3wS7s2LE0UTBIGYC5LX2zqs0i/hdP5TukunxOS+TN/7BK3H9EgAAA=',
    alt: 'A glittering sparkle',
    srcSet: {
      avif: `${wordIdeaAvif160} 160w, ${wordIdeaAvif} 320w`,
      webp: `${wordIdeaWebp160} 160w, ${wordIdeaWebp} 320w`,
    },
  },
  freedom: {
    avif: wordFreedomAvif,
    webp: wordFreedomWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADQAQCdASoQAAwAA4BaJQBOgCHfURR4AAD+9gfLy0tuOkE+Ja9LAdkw1jbr1FQ3AAA=',
    alt: 'A white dove in flight',
    srcSet: {
      avif: `${wordFreedomAvif160} 160w, ${wordFreedomAvif} 320w`,
      webp: `${wordFreedomWebp160} 160w, ${wordFreedomWebp} 320w`,
    },
  },
  justice: {
    avif: wordJusticeAvif,
    webp: wordJusticeWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAAAQAgCdASoQAAwAA4BaJaACdH8AF8fh7ABAAP701QTp+7qY4lVIaFZdqosIiQRlOHLT53bSOF6nqIGvTcaUvjYxpMWg+efQgAA=',
    alt: 'A judge in official robes',
    srcSet: {
      avif: `${wordJusticeAvif160} 160w, ${wordJusticeAvif} 320w`,
      webp: `${wordJusticeWebp160} 160w, ${wordJusticeWebp} 320w`,
    },
  },
  truth: {
    avif: wordTruthAvif,
    webp: wordTruthWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAACwAQCdASoQAAwAA4BaJZAAAt4+PEVQAP73DoXghw+HECrCOvYhFoFe8gsoCV0DFR3NXgOtdzEAAA==',
    alt: 'A document with a verified check mark',
    srcSet: {
      avif: `${wordTruthAvif160} 160w, ${wordTruthAvif} 320w`,
      webp: `${wordTruthWebp160} 160w, ${wordTruthWebp} 320w`,
    },
  },
  research: {
    avif: wordResearchAvif,
    webp: wordResearchWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADwAQCdASoQAAwAA4BaJYgCdAEKp8YJW0AA/vYSsLDje7edbjLq1LPvxrARbWaJ8N8W6e/N182OE9SJJocrjvEQfhEYAA==',
    alt: 'A magnifying glass',
    srcSet: {
      avif: `${wordResearchAvif160} 160w, ${wordResearchAvif} 320w`,
      webp: `${wordResearchWebp160} 160w, ${wordResearchWebp} 320w`,
    },
  },
  society: {
    avif: wordSocietyAvif,
    webp: wordSocietyWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAQCdASoQAAwAA4BaJQBOgBikF91QAP73EWL09GrYBa7seSTNyTjrXHd68/JbqhEaPSelNNQR8KKNPU6OnH5OKc/voTxMSQAAAA==',
    alt: 'Two people embracing',
    srcSet: {
      avif: `${wordSocietyAvif160} 160w, ${wordSocietyAvif} 320w`,
      webp: `${wordSocietyWebp160} 160w, ${wordSocietyWebp} 320w`,
    },
  },
  culture: {
    avif: wordCultureAvif,
    webp: wordCultureWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADwAQCdASoQAAwAA4BaJaACdAEKpfht9EAA/vTcOV1e6ylKsLm5ySQihUZWdtJ3QMoXJpUu+sMWCBDgAAA=',
    alt: 'Theatrical comedy and tragedy masks',
    srcSet: {
      avif: `${wordCultureAvif160} 160w, ${wordCultureAvif} 320w`,
      webp: `${wordCultureWebp160} 160w, ${wordCultureWebp} 320w`,
    },
  },
  history: {
    avif: wordHistoryAvif,
    webp: wordHistoryWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAAAQAgCdASoQAAwAA4BaJZACdAELYGbsFIwAAP72ESNLUUjgq/K9wyLR+IcFME6zeGGjncMAAAA=',
    alt: 'An hourglass with sand flowing',
    srcSet: {
      avif: `${wordHistoryAvif160} 160w, ${wordHistoryAvif} 320w`,
      webp: `${wordHistoryWebp160} 160w, ${wordHistoryWebp} 320w`,
    },
  },
  philosophy: {
    avif: wordPhilosophyAvif,
    webp: wordPhilosophyWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAABQAgCdASoQAAwAA4BaJagCdH8AFwx3YekztWgA/vYT4Ea63rgKCdxHZnOcVEl7rC0AijWM2kudTvxkr2edrC+qDwAAAA==',
    alt: 'An owl',
    srcSet: {
      avif: `${wordPhilosophyAvif160} 160w, ${wordPhilosophyAvif} 320w`,
      webp: `${wordPhilosophyWebp160} 160w, ${wordPhilosophyWebp} 320w`,
    },
  },
  theory: {
    avif: wordTheoryAvif,
    webp: wordTheoryWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAABwAQCdASoQAAwAA4BaJZACdAF1AAD+8XsTspIQ5qnztprCXnCTAqfZ+AbXCYPo40AAAA==',
    alt: 'A jigsaw puzzle piece',
    srcSet: {
      avif: `${wordTheoryAvif160} 160w, ${wordTheoryAvif} 320w`,
      webp: `${wordTheoryWebp160} 160w, ${wordTheoryWebp} 320w`,
    },
  },
  experience: {
    avif: wordExperienceAvif,
    webp: wordExperienceWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAQAgCdASoQAAwAA4BaJagCdAEN0v8MGA+AAP73DvOJxjikyzTOG44NU+TF90mR5N0pA97Lyk+eG8aLSNYEwzVTf31/M4fwTOTr324AAAA=',
    alt: 'A worn travel backpack',
    srcSet: {
      avif: `${wordExperienceAvif160} 160w, ${wordExperienceAvif} 320w`,
      webp: `${wordExperienceWebp160} 160w, ${wordExperienceWebp} 320w`,
    },
  },
  responsibility: {
    avif: wordResponsibilityAvif,
    webp: wordResponsibilityWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAAAQAgCdASoQAAwAA4BaJZACdAEVV0kHSb9AAP72CuaA6HxCnVDsXsN7Gk+pQXAvuUqpahk/vQmo4P1A50cVVD2bCAAAAA==',
    alt: 'A protective shield',
    srcSet: {
      avif: `${wordResponsibilityAvif160} 160w, ${wordResponsibilityAvif} 320w`,
      webp: `${wordResponsibilityWebp160} 160w, ${wordResponsibilityWebp} 320w`,
    },
  },
  meaning: {
    avif: wordMeaningAvif,
    webp: wordMeaningWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjAAAABXRUJQVlA4ICQAAACQAQCdASoQAAwAA4BaJQAAXOqYlgAA/vYE5jp79AV7ZQDAgAA=',
    alt: 'A thought balloon',
    srcSet: {
      avif: `${wordMeaningAvif160} 160w, ${wordMeaningAvif} 320w`,
      webp: `${wordMeaningWebp160} 160w, ${wordMeaningWebp} 320w`,
    },
  },
  analysis: {
    avif: wordAnalysisAvif,
    webp: wordAnalysisWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAQAgCdASoQAAwAA4BaJZACdAED/JzMfMAAAP72E90f6uuCpaHZ7WilEVjB048yW+nBy31G+WXih/GbHmbyWdZJBUzkUaZvnXDoB9cmgAA=',
    alt: 'A bar chart with a magnifying glass',
    srcSet: {
      avif: `${wordAnalysisAvif160} 160w, ${wordAnalysisAvif} 320w`,
      webp: `${wordAnalysisWebp160} 160w, ${wordAnalysisWebp} 320w`,
    },
  },
  beautiful: {
    avif: wordBeautifulAvif,
    webp: wordBeautifulWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADwAQCdASoQAAwAA4BaJagAAudlYtFtggAA/vYRI0tgmEsxiEvRkbLkUI6flhS6TqCVOEA0S/f5Zrg3Xvd7AAAA',
    alt: 'A blooming pink tulip',
    srcSet: {
      avif: `${wordBeautifulAvif160} 160w, ${wordBeautifulAvif} 320w`,
      webp: `${wordBeautifulWebp160} 160w, ${wordBeautifulWebp} 320w`,
    },
  },
  clean: {
    avif: wordCleanAvif,
    webp: wordCleanWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADQAQCdASoQAAwAA4BaJaACdAEPADtnwAD+9wgo1Mw4/BxVAKYtWhL/1Y964HcvpaD6QdUIAAA=',
    alt: 'A broom',
    srcSet: {
      avif: `${wordCleanAvif160} 160w, ${wordCleanAvif} 320w`,
      webp: `${wordCleanWebp160} 160w, ${wordCleanWebp} 320w`,
    },
  },
  goodbye: {
    avif: wordGoodbyeAvif,
    webp: wordGoodbyeWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADwAQCdASoQAAwAA4BaJZACdAEQAk10tAAA/vYRI1NCFYTY5C8u1pjO+KWBLjnAgPQ0ahiFabYKLAAA',
    alt: 'A closed door',
    srcSet: {
      avif: `${wordGoodbyeAvif160} 160w, ${wordGoodbyeAvif} 320w`,
      webp: `${wordGoodbyeWebp160} 160w, ${wordGoodbyeWebp} 320w`,
    },
  },
  please: {
    avif: wordPleaseAvif,
    webp: wordPleaseWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAACwAQCdASoQAAwAA4BaJbACdAEO/C4wAP73AqPdYlG2+3iHdq+3UTyrJPb8Z7TkzIyG0qemRekJAAAA',
    alt: 'Two open upward palms',
    srcSet: {
      avif: `${wordPleaseAvif160} 160w, ${wordPleaseAvif} 320w`,
      webp: `${wordPleaseWebp160} 160w, ${wordPleaseWebp} 320w`,
    },
  },
  word: {
    avif: wordWordAvif,
    webp: wordWordWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAAAQAgCdASoQAAwAA4BaJbACdAD2O+qWdjMAAP72E96Q7iz1WaABnPLchk/G04LZEcXwcAYLQ2f2CFqX5IiGNro1TR/p4wAA',
    alt: 'Colourful ABCD letter blocks',
    srcSet: {
      avif: `${wordWordAvif160} 160w, ${wordWordAvif} 320w`,
      webp: `${wordWordWebp160} 160w, ${wordWordWebp} 320w`,
    },
  },
  answer: {
    avif: wordAnswerAvif,
    webp: wordAnswerWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAAAQAgCdASoQAAwAA4BaJZACdAEPhvxuJoAAAP73EFbqQYKlooKmImVRMR3Cl8Wgz/2FU3DSFglOAGKyKkIgAA==',
    alt: 'A green check mark in a box',
    srcSet: {
      avif: `${wordAnswerAvif160} 160w, ${wordAnswerAvif} 320w`,
      webp: `${wordAnswerWebp160} 160w, ${wordAnswerWebp} 320w`,
    },
  },
  'to-wake-up': {
    avif: wordToWakeUpAvif,
    webp: wordToWakeUpWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADQAQCdASoQAAwAA4BaJbACdAELXjFTgAD+9grSW6XU2MSoVSbtoHWCrKFF8x7fOYaD9rTVeim8ibNm6lodAa0fXYAAAA==',
    alt: 'A yawning face stretching awake',
    srcSet: {
      avif: `${wordToWakeUpAvif160} 160w, ${wordToWakeUpAvif} 320w`,
      webp: `${wordToWakeUpWebp160} 160w, ${wordToWakeUpWebp} 320w`,
    },
  },
  habit: {
    avif: wordHabitAvif,
    webp: wordHabitWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADwAQCdASoQAAwAA4BaJZgCdAEN4o/1aIAA/vYSsK6K+7X2QOalVn4gsB9MPuoSS3ZDZfC3Mu8s33ifs03RIz/XFQAAAA==',
    alt: 'A repeating loop arrow icon',
    srcSet: {
      avif: `${wordHabitAvif160} 160w, ${wordHabitAvif} 320w`,
      webp: `${wordHabitWebp160} 160w, ${wordHabitWebp} 320w`,
    },
  },
  'to-go-out': {
    avif: wordToGoOutAvif,
    webp: wordToGoOutWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAAAQAgCdASoQAAwAA4BaJQBdgCFsGIHBcid4AP73EFhWc/+q5SIANtp/ytss3Cq/y9z3RnHUZZ8m1BPfP6GoYlwAAAA=',
    alt: 'A pair of footprints',
    srcSet: {
      avif: `${wordToGoOutAvif160} 160w, ${wordToGoOutAvif} 320w`,
      webp: `${wordToGoOutWebp160} 160w, ${wordToGoOutWebp} 320w`,
    },
  },
  'to-return': {
    avif: wordToReturnAvif,
    webp: wordToReturnWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADwAQCdASoQAAwAA4BaJaACdAEN3wiAQAAA/vYSsK8EGYGVc0WCQMLXvUJuoEyMK6sLD/BbSqK10NlLQ6AdzKf8a0y8AA==',
    alt: 'Counterclockwise circular arrows',
    srcSet: {
      avif: `${wordToReturnAvif160} 160w, ${wordToReturnAvif} 320w`,
      webp: `${wordToReturnWebp160} 160w, ${wordToReturnWebp} 320w`,
    },
  },
  welcome: {
    avif: wordWelcomeAvif,
    webp: wordWelcomeWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADwAQCdASoQAAwAA4BaJZgCdAEO/Hp7EwAA/vcEaAtnoCZVDvdUsF5NJ6D/lGdvUxA5ixn7Q6FL0icgAAA=',
    alt: 'Two hands raised in celebration',
    srcSet: {
      avif: `${wordWelcomeAvif160} 160w, ${wordWelcomeAvif} 320w`,
      webp: `${wordWelcomeWebp160} 160w, ${wordWelcomeWebp} 320w`,
    },
  },
  'excuse-me': {
    avif: wordExcuseMeAvif,
    webp: wordExcuseMeWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoQAAwAA4BaJbACdAEO/HoXsAAA/vcI7dNbCrxGyFLP0GrIB/McQJ70zIoM92/Gbz2YmObhOlqCEU2y19QtTwAA',
    alt: 'A person raising one hand',
    srcSet: {
      avif: `${wordExcuseMeAvif160} 160w, ${wordExcuseMeAvif} 320w`,
      webp: `${wordExcuseMeWebp160} 160w, ${wordExcuseMeWebp} 320w`,
    },
  },
  'good-morning': {
    avif: wordGoodMorningAvif,
    webp: wordGoodMorningWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAADwAQCdASoQAAwAA4BaJbACdADw0qqm9GgA/vYTyrN5zOQf2/aoa08re3CvsLozbvTHaXAwlF3qENrEXt136ztj4Ey5ypAY8kU2zcJyydz0OAq6hehXR4MGsVAAAA==',
    alt: 'A sunrise over mountains',
    srcSet: {
      avif: `${wordGoodMorningAvif160} 160w, ${wordGoodMorningAvif} 320w`,
      webp: `${wordGoodMorningWebp160} 160w, ${wordGoodMorningWebp} 320w`,
    },
  },
  'how-are-you': {
    avif: wordHowAreYouAvif,
    webp: wordHowAreYouWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjAAAABXRUJQVlA4ICQAAABQAQCdASoQAAwAA4BaJQBOgCgAAP7xfZDKIycpGUAnvKnwAAA=',
    alt: 'A speech bubble',
    srcSet: {
      avif: `${wordHowAreYouAvif160} 160w, ${wordHowAreYouAvif} 320w`,
      webp: `${wordHowAreYouWebp160} 160w, ${wordHowAreYouWebp} 320w`,
    },
  },
  'no-problem': {
    avif: wordNoProblemAvif,
    webp: wordNoProblemWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAACwAQCdASoQAAwAA4BaJagCdDiAAcmAAP7xNNi5X1trVe21ak134sUpK2wL7T7rxC2pCRqCOOF75yIbLwAAAA==',
    alt: 'A thumbs up hand',
    srcSet: {
      avif: `${wordNoProblemAvif160} 160w, ${wordNoProblemAvif} 320w`,
      webp: `${wordNoProblemWebp160} 160w, ${wordNoProblemWebp} 320w`,
    },
  },
  'of-course': {
    avif: wordOfCourseAvif,
    webp: wordOfCourseWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAAAQAgCdASoQAAwAA4BaJbACdAEQ/brQjsOAAP73COXOZ2CdvvgwEb+cX3a0h/YMlH2PE5NJ9M2oAAAA',
    alt: 'An OK hand gesture',
    srcSet: {
      avif: `${wordOfCourseAvif160} 160w, ${wordOfCourseAvif} 320w`,
      webp: `${wordOfCourseWebp160} 160w, ${wordOfCourseWebp} 320w`,
    },
  },
  'little-by-little': {
    avif: wordLittleByLittleAvif,
    webp: wordLittleByLittleWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADwAQCdASoQAAwAA4BaJYgCdAEN5SMYYgAA/vcRDVG7YBW54rQNQSd8xhHl/QOKVHItQeNIIOxxiZdSYHiJQKwXMTrbFX71k7xAAA==',
    alt: 'A ladder leaning upward',
    srcSet: {
      avif: `${wordLittleByLittleAvif160} 160w, ${wordLittleByLittleAvif} 320w`,
      webp: `${wordLittleByLittleWebp160} 160w, ${wordLittleByLittleWebp} 320w`,
    },
  },
  'patience-is-the-key': {
    avif: wordPatienceIsTheKeyAvif,
    webp: wordPatienceIsTheKeyWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADwAQCdASoQAAwAA4BaJbACdAELXlor8AAA/vcO84CcpDWUXlWlo7sVEI++I9ze81Wrmhow7vpsRkVhRoAAAA==',
    alt: 'A padlock with a key',
    srcSet: {
      avif: `${wordPatienceIsTheKeyAvif160} 160w, ${wordPatienceIsTheKeyAvif} 320w`,
      webp: `${wordPatienceIsTheKeyWebp160} 160w, ${wordPatienceIsTheKeyWebp} 320w`,
    },
  },
  'whoever-strives-finds': {
    avif: wordWhoeverStrivesFindsAvif,
    webp: wordWhoeverStrivesFindsWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAADQAQCdASoQAAwAA4BaJQBWACIj3oIPgAD+9hCqiq5Yax+XZjEu2DWKV/uZw0q3LwAAAA==',
    alt: 'A person climbing a rock face',
    srcSet: {
      avif: `${wordWhoeverStrivesFindsAvif160} 160w, ${wordWhoeverStrivesFindsAvif} 320w`,
      webp: `${wordWhoeverStrivesFindsWebp160} 160w, ${wordWhoeverStrivesFindsWebp} 320w`,
    },
  },
  'time-is-gold': {
    avif: wordTimeIsGoldAvif,
    webp: wordTimeIsGoldWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAAAQAgCdASoQAAwAA4BaJbACdAELUP4kmQAAAP72Rh0JHAWNOzgErA2bwEIPf4s4M0DDePesQrklzSfISUiL1lZZ6kjJZtwAAAA=',
    alt: 'An hourglass beside a gold coin',
    srcSet: {
      avif: `${wordTimeIsGoldAvif160} 160w, ${wordTimeIsGoldAvif} 320w`,
      webp: `${wordTimeIsGoldWebp160} 160w, ${wordTimeIsGoldWebp} 320w`,
    },
  },
  'as-you-sow-so-you-reap': {
    avif: wordAsYouSowSoYouReapAvif,
    webp: wordAsYouSowSoYouReapWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAAAQAgCdASoQAAwAA4BaJYgCdAEVz4eaGepAAP73CS/QaYbuoUs/8obf9lS8cfpg2x8bZANPg68RPPmT9EYAAA==',
    alt: 'A green seedling sprouting',
    srcSet: {
      avif: `${wordAsYouSowSoYouReapAvif160} 160w, ${wordAsYouSowSoYouReapAvif} 320w`,
      webp: `${wordAsYouSowSoYouReapWebp160} 160w, ${wordAsYouSowSoYouReapWebp} 320w`,
    },
  },
  son: {
    avif: wordSonAvif,
    webp: wordSonWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAwAgCdASoQAAwAA4BaJbACdFQAA5atwSdBgAD+9hKwjTz1hgdUO6UBlE9f+BLetLo8gF5JYLi1adrKfP9FHFYpgrVZ5J5V7F6NSpb3KyRobNEQAAA=',
    alt: 'A young boy with a heart, representing a son',
    srcSet: {
      avif: `${wordSonAvif160} 160w, ${wordSonAvif} 320w`,
      webp: `${wordSonWebp160} 160w, ${wordSonWebp} 320w`,
    },
  },
  husband: {
    avif: wordHusbandAvif,
    webp: wordHusbandWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAABwAgCdASoQAAwAA4BaJbACdH8G6AA5d8UJ7kAAAP72ErCNOr7+GnXrcUAvWk8TOvBpDRzu2x/+D4Qup+z69TjO5duHOl96XicKt8v4DSfR6AAA',
    alt: 'A man with a wedding ring, representing a husband',
    srcSet: {
      avif: `${wordHusbandAvif160} 160w, ${wordHusbandAvif} 320w`,
      webp: `${wordHusbandWebp160} 160w, ${wordHusbandWebp} 320w`,
    },
  },
  wife: {
    avif: wordWifeAvif,
    webp: wordWifeWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADwAQCdASoQAAwAA4BaJbACdAELz3eX0HAA/vcQVuifRz3hR72zd5PKfZAhuVUHRKCa9MsQWrKg4fNs+sSi4XjX3xuXTOW1/VzHa4qn1/la0AAA',
    alt: 'A woman with a wedding ring, representing a wife',
    srcSet: {
      avif: `${wordWifeAvif160} 160w, ${wordWifeAvif} 320w`,
      webp: `${wordWifeWebp160} 160w, ${wordWifeWebp} 320w`,
    },
  },
  neighbor: {
    avif: wordNeighborAvif,
    webp: wordNeighborWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAQAgCdASoQAAwAA4BaJaACdAEO68xLaMygAP73BSyitE8yyG3CamGD1oHgNy2O81J/TbL08ICILyRldqY25PGS0jWBLoYN0AkQxrsAAAA=',
    alt: 'Two houses side by side',
    srcSet: {
      avif: `${wordNeighborAvif160} 160w, ${wordNeighborAvif} 320w`,
      webp: `${wordNeighborWebp160} 160w, ${wordNeighborWebp} 320w`,
    },
  },
  vegetables: {
    avif: wordVegetablesAvif,
    webp: wordVegetablesWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAAAwAgCdASoQAAwAA4BaJZACdAEQUPS0ycTYAAD+9w7zgxwYyghEATAWoC5vGleFjXsjrEsb273rAkgO4RrIHg/94ec7cBnVgdpZRizfgHyTCyPBeAAAAA==',
    alt: 'A plate with carrot, broccoli, and tomato',
    srcSet: {
      avif: `${wordVegetablesAvif160} 160w, ${wordVegetablesAvif} 320w`,
      webp: `${wordVegetablesWebp160} 160w, ${wordVegetablesWebp} 320w`,
    },
  },
  kitchen: {
    avif: wordKitchenAvif,
    webp: wordKitchenWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADwAQCdASoQAAwAA4BaJbACdAEO+o5HPAAA/vYHxvDXUfBIXw2uLy3LoKdiGZEOv3N7lqkycE1p8oAA',
    alt: 'A steaming pot of food',
    srcSet: {
      avif: `${wordKitchenAvif160} 160w, ${wordKitchenAvif} 320w`,
      webp: `${wordKitchenWebp160} 160w, ${wordKitchenWebp} 320w`,
    },
  },
  table: {
    avif: wordTableAvif,
    webp: wordTableWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAABwAQCdASoQAAwAA4BaJZgCdAFAAAD+8NC3D/H297etf5ffF+8wc9gPoO6xDYc77QMy+o7HbOpTwSpuOJuyqAAA',
    alt: 'A wooden table',
    srcSet: {
      avif: `${wordTableAvif160} 160w, ${wordTableAvif} 320w`,
      webp: `${wordTableWebp160} 160w, ${wordTableWebp} 320w`,
    },
  },
  apartment: {
    avif: wordApartmentAvif,
    webp: wordApartmentWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoQAAwAA4BaJZACdAEO+ovURAAA/vYKDxoffknIE1/CvNeGavDO7DnKBNuN6fGZZ2UEBagS7R6rBOKcAAA=',
    alt: 'A row of apartment houses',
    srcSet: {
      avif: `${wordApartmentAvif160} 160w, ${wordApartmentAvif} 320w`,
      webp: `${wordApartmentWebp160} 160w, ${wordApartmentWebp} 320w`,
    },
  },
  lamp: {
    avif: wordLampAvif,
    webp: wordLampWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAABwAQCdASoQAAwAA4BaJbACdAFAAAD+8cRdyNVtY9+ktx4n6vB3aro6iyoY4IZtDy1u55Soq1WDgokBfvAIWJuyqAAAAA==',
    alt: 'A tall floor lamp',
    srcSet: {
      avif: `${wordLampAvif160} 160w, ${wordLampAvif} 320w`,
      webp: `${wordLampWebp160} 160w, ${wordLampWebp} 320w`,
    },
  },
  sky: {
    avif: wordSkyAvif,
    webp: wordSkyWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAABwAQCdASoQAAwAA4BaJYgCdAF1AAD+8PRu6/c5lkw9jKCf5h978AAA',
    alt: 'A fluffy cloud in a blue sky',
    srcSet: {
      avif: `${wordSkyAvif160} 160w, ${wordSkyAvif} 320w`,
      webp: `${wordSkyWebp160} 160w, ${wordSkyWebp} 320w`,
    },
  },
  river: {
    avif: wordRiverAvif,
    webp: wordRiverWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADwAQCdASoQAAwAA4BaJaACdADdR0KOWAAA/vBxQyz1d1I+R5ZpZtzL6G6tfSMe3Q7KVQ9j9M4O4VdKK+D4wHG7lifuJOe70rudtolp5Rm/LPC7d+xLAAAA',
    alt: 'A winding blue river between green banks',
    srcSet: {
      avif: `${wordRiverAvif160} 160w, ${wordRiverAvif} 320w`,
      webp: `${wordRiverWebp160} 160w, ${wordRiverWebp} 320w`,
    },
  },
  day: {
    avif: wordDayAvif,
    webp: wordDayWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADwAQCdASoQAAwAA4BaJbACdAELXjGzGAAA/vcO84HKTL5og8s+oKmr6a20kiijNOVz+l46O6QlSruGm1LUEIpszewAAA==',
    alt: 'A bright radiant sun',
    srcSet: {
      avif: `${wordDayAvif160} 160w, ${wordDayAvif} 320w`,
      webp: `${wordDayWebp160} 160w, ${wordDayWebp} 320w`,
    },
  },
  year: {
    avif: wordYearAvif,
    webp: wordYearWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAAAQAgCdASoQAAwAA4BaJZACdAD0j7QVr4IAAP72E8qzjkFxvPJskyrwDSJttsGQd63axKqEm2HtzggC8FwAAA==',
    alt: 'A wall calendar',
    srcSet: {
      avif: `${wordYearAvif160} 160w, ${wordYearAvif} 320w`,
      webp: `${wordYearWebp160} 160w, ${wordYearWebp} 320w`,
    },
  },
  lesson: {
    avif: wordLessonAvif,
    webp: wordLessonWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADQAQCdASoQAAwAA4BaJQBOgCHfT+UAAAD+9gfLy06kxmJhWzn6GRQz55x21BAA',
    alt: 'Bookmark tabs marking a lesson',
    srcSet: {
      avif: `${wordLessonAvif160} 160w, ${wordLessonAvif} 320w`,
      webp: `${wordLessonWebp160} 160w, ${wordLessonWebp} 320w`,
    },
  },
  blackboard: {
    avif: wordBlackboardAvif,
    webp: wordBlackboardWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADwAQCdASoQAAwAA4BaJQBOgB4UKaa3lEAA/vUdmP0iwp/mGqXz1lP4sFquV/RXflStmglrxT8MVM2B5t/aBXQzEN7CRidqBUAAAA==',
    alt: 'A blackboard with ABC written in chalk',
    srcSet: {
      avif: `${wordBlackboardAvif160} 160w, ${wordBlackboardAvif} 320w`,
      webp: `${wordBlackboardWebp160} 160w, ${wordBlackboardWebp} 320w`,
    },
  },
  'to-sell': {
    avif: wordToSellAvif,
    webp: wordToSellWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADwAQCdASoQAAwAA4BaJbACdAEO+o5HiwAA/vYE/qfqHRpmLBM8O6+tE8l8d0eaKOja+NiadW5eAA==',
    alt: 'Two hands shaking on a deal',
    srcSet: {
      avif: `${wordToSellAvif160} 160w, ${wordToSellAvif} 320w`,
      webp: `${wordToSellWebp160} 160w, ${wordToSellWebp} 320w`,
    },
  },
  customer: {
    avif: wordCustomerAvif,
    webp: wordCustomerWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAABQAgCdASoQAAwAA4BaJbACdDiAAUmdD4YkEAAA/vTvJo/19bhiYShj2WRdUqBjaeDDHC/b86aOPPhTfKroJCLm2H5o434thMEwOE0eQZxQq+CYAAA=',
    alt: 'A woman with shopping bags',
    srcSet: {
      avif: `${wordCustomerAvif160} 160w, ${wordCustomerAvif} 320w`,
      webp: `${wordCustomerWebp160} 160w, ${wordCustomerWebp} 320w`,
    },
  },
  website: {
    avif: wordWebsiteAvif,
    webp: wordWebsiteWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADwAQCdASoQAAwAA4BaJZACdAEPhsNXokAA/vYSsI055ouKuDMq/iqmdB5pK7zZgWpAbX51A/HqYtAEAAA=',
    alt: 'A laptop computer',
    srcSet: {
      avif: `${wordWebsiteAvif160} 160w, ${wordWebsiteAvif} 320w`,
      webp: `${wordWebsiteWebp160} 160w, ${wordWebsiteWebp} 320w`,
    },
  },
  network: {
    avif: wordNetworkAvif,
    webp: wordNetworkWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAABwAQCdASoQAAwAA4BaJYgCdAFAAAD+8TTWSWtjkbMKEA5J+ZV+gNB99c79pGsnAAA=',
    alt: 'A satellite dish antenna',
    srcSet: {
      avif: `${wordNetworkAvif160} 160w, ${wordNetworkAvif} 320w`,
      webp: `${wordNetworkWebp160} 160w, ${wordNetworkWebp} 320w`,
    },
  },
  application: {
    avif: wordApplicationAvif,
    webp: wordApplicationWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADwAQCdASoQAAwAA4BaJZAAAsWOuMU96QAA/vYTpEKEIGS/0Es5ZAqEINbXjRKLSUBXtW5ZG3IuPOyHNhA4AA==',
    alt: 'A mobile phone with an app grid',
    srcSet: {
      avif: `${wordApplicationAvif160} 160w, ${wordApplicationAvif} 320w`,
      webp: `${wordApplicationWebp160} 160w, ${wordApplicationWebp} 320w`,
    },
  },
  news: {
    avif: wordNewsAvif,
    webp: wordNewsWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADQAQCdASoQAAwAA4BaJZwC7AEO+olwAAD+9gfG806QeK9wHpVnZiRA69ViaEUMAAA=',
    alt: 'A rolled-up newspaper',
    srcSet: {
      avif: `${wordNewsAvif160} 160w, ${wordNewsAvif} 320w`,
      webp: `${wordNewsWebp160} 160w, ${wordNewsWebp} 320w`,
    },
  },
  airport: {
    avif: wordAirportAvif,
    webp: wordAirportWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADwAQCdASoQAAwAA4BaJQBOgCFsFENYmAAA/vYQ2EtFYs+XZFcVYUHScLsVcaNXfkZxIhGVVABN9IDCMUMQAA==',
    alt: 'An airplane arriving',
    srcSet: {
      avif: `${wordAirportAvif160} 160w, ${wordAirportAvif} 320w`,
      webp: `${wordAirportWebp160} 160w, ${wordAirportWebp} 320w`,
    },
  },
  'to-listen': {
    avif: wordToListenAvif,
    webp: wordToListenWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoQAAwAA4BaJbACdAEKj1ziAAD+9w7zgbJl7Vf9DKt/faBpekXZUynCKEyMyt2Togzxzt2AAAA=',
    alt: 'An ear with a hearing aid',
    srcSet: {
      avif: `${wordToListenAvif160} 160w, ${wordToListenAvif} 320w`,
      webp: `${wordToListenWebp160} 160w, ${wordToListenWebp} 320w`,
    },
  },
  'to-go': {
    avif: wordToGoAvif,
    webp: wordToGoWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAQCdASoQAAwAA4BaJYgCdAEPAAJggAD+9w7x5SeA5lqxcC1Qt1s037qIbG219w+qgAAA',
    alt: 'A person walking',
    srcSet: {
      avif: `${wordToGoAvif160} 160w, ${wordToGoAvif} 320w`,
      webp: `${wordToGoWebp160} 160w, ${wordToGoWebp} 320w`,
    },
  },
  'to-learn': {
    avif: wordToLearnAvif,
    webp: wordToLearnWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADQAQCdASoQAAwAA4BaJZgCdAEN1fbKAAD+9glwt3/5hoYSMP19wPwzEk16xv4lGQeRusrD4xW5KFoClH/6AAAA',
    alt: 'An open book with a pencil',
    srcSet: {
      avif: `${wordToLearnAvif160} 160w, ${wordToLearnAvif} 320w`,
      webp: `${wordToLearnWebp160} 160w, ${wordToLearnWebp} 320w`,
    },
  },
  'to-teach': {
    avif: wordToTeachAvif,
    webp: wordToTeachWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADQAQCdASoQAAwAA4BaJbACdADwxpUzgAD+9hPdRuVIazQlNsqhxv/i7PmI7eTCR8QJvPKvm/MMULu6W54kt2C37kBHD8jWfVNoGYwA',
    alt: 'A woman teacher',
    srcSet: {
      avif: `${wordToTeachAvif160} 160w, ${wordToTeachAvif} 320w`,
      webp: `${wordToTeachWebp160} 160w, ${wordToTeachWebp} 320w`,
    },
  },
  'to-travel': {
    avif: wordToTravelAvif,
    webp: wordToTravelWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADwAQCdASoQAAwAA4BaJZgCdAEO/v1O8QAA/vYRW3160gipkHYnxk6gpwHg0tXtRDaOgwMtJhX+lZv/gC/Xcdi23UuITf1WNvLfFbFR4WG9AAAA',
    alt: 'A person walking with rolling luggage',
    srcSet: {
      avif: `${wordToTravelAvif160} 160w, ${wordToTravelAvif} 320w`,
      webp: `${wordToTravelWebp160} 160w, ${wordToTravelWebp} 320w`,
    },
  },
  'to-ask': {
    avif: wordToAskAvif,
    webp: wordToAskWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAABwAQCdASoQAAwAA4BaJbACdAFAAAD+8pL2GLpX5Gqjt07GmwjYAAAA',
    alt: 'A white question mark',
    srcSet: {
      avif: `${wordToAskAvif160} 160w, ${wordToAskAvif} 320w`,
      webp: `${wordToAskWebp160} 160w, ${wordToAskWebp} 320w`,
    },
  },
  merchant: {
    avif: wordMerchantAvif,
    webp: wordMerchantWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACwAQCdASoQAAwAA4BaJbACdAEKjUaAAP72CtJb0fcka7I8OdkYpJ54rFDva1O+qfuNRReii2Kl1RbohG7LafZDk+AAAA==',
    alt: 'A convenience storefront',
    srcSet: {
      avif: `${wordMerchantAvif160} 160w, ${wordMerchantAvif} 320w`,
      webp: `${wordMerchantWebp160} 160w, ${wordMerchantWebp} 320w`,
    },
  },
  manager: {
    avif: wordManagerAvif,
    webp: wordManagerWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAQCdASoQAAwAA4BaJaACdAELXloFIAD+9hEXuXdg8iOdxFK9BQwZ+yHSRj5cFNC946M8kZ61JIOz+jwaoYwcAsG2pnrciUr4AA==',
    alt: 'A woman office worker',
    srcSet: {
      avif: `${wordManagerAvif160} 160w, ${wordManagerAvif} 320w`,
      webp: `${wordManagerWebp160} 160w, ${wordManagerWebp} 320w`,
    },
  },
  work: {
    avif: wordWorkAvif,
    webp: wordWorkWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoQAAwAA4BaJQBdgCHf/Z4WhAAA/vYE/9kjMQxWsEpGkSu7MZ80+WKaPGxvthn07lYMhg/Jh9pCWd/w0assgAAA',
    alt: 'A toolbox',
    srcSet: {
      avif: `${wordWorkAvif160} 160w, ${wordWorkAvif} 320w`,
      webp: `${wordWorkWebp160} 160w, ${wordWorkWebp} 320w`,
    },
  },
  salary: {
    avif: wordSalaryAvif,
    webp: wordSalaryWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAAAQAgCdASoQAAwAA4BaJZgCdAEO+ai3UMQAAP72C8Ddf/P5gcsZmE1kmyhzobXHUenm+I/z0apIRlC2zEC+pGzOhEAAAA==',
    alt: 'A dollar banknote',
    srcSet: {
      avif: `${wordSalaryAvif160} 160w, ${wordSalaryAvif} 320w`,
      webp: `${wordSalaryWebp160} 160w, ${wordSalaryWebp} 320w`,
    },
  },
  big: {
    avif: wordBigAvif,
    webp: wordBigWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADQAQCdASoQAAwAA4BaJbACdACyQv2DqAD+vHM0udxyHG2e2Q5tVhiRyKqieZWC4TNBvlXdbvUuuZklhWtaxQg6j5yzlloFevsqZvjgk44j9DwAAAA=',
    alt: 'A very tall spire-topped skyscraper towering over the city, like the Burj Khalifa',
    srcSet: {
      avif: `${wordBigAvif160} 160w, ${wordBigAvif} 320w`,
      webp: `${wordBigWebp160} 160w, ${wordBigWebp} 320w`,
    },
  },
  room: {
    avif: wordRoomAvif,
    webp: wordRoomWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAAAwAgCdASoQAAwAA4BaJbACdH8AGBr/+efWAAD+9wgj7JdwLk+F2zbuWpisl9XCXFrwU2ps4C8D7UoD2W7oOAf5G0Z32na5FV0wyLtVZjAAAA==',
    alt: 'A living room with a sofa and a floor lamp',
    srcSet: {
      avif: `${wordRoomAvif160} 160w, ${wordRoomAvif} 320w`,
      webp: `${wordRoomWebp160} 160w, ${wordRoomWebp} 320w`,
    },
  },
  sugar: {
    avif: wordSugarAvif,
    webp: wordSugarWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRi4AAABXRUJQVlA4ICIAAABwAQCdASoQAAwABwBaJYgCdAFAAAD+8tUx3UYa9bYNoAAA',
    alt: 'A plate with a mound of granulated sugar',
    srcSet: {
      avif: `${wordSugarAvif160} 160w, ${wordSugarAvif} 320w`,
      webp: `${wordSugarWebp160} 160w, ${wordSugarWebp} 320w`,
    },
  },
  uncle: {
    avif: wordUncleAvif,
    webp: wordUncleWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAABQAgCdASoQAAwAA4BaJbACdDBWgWlDkzQ5QAAA/vYT3UZLJw9WwujirPNsnMhCexf8IciSakMwaWbGxB/bOMxdIWBdn+jwCTeeZ3qn7/Gdg0/cEyiTiP7JaYwIAAAA',
    alt: 'A man with an age badge reading forty-five',
    srcSet: {
      avif: `${wordUncleAvif160} 160w, ${wordUncleAvif} 320w`,
      webp: `${wordUncleWebp160} 160w, ${wordUncleWebp} 320w`,
    },
  },
  wall: {
    avif: wordWallAvif,
    webp: wordWallWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADQAQCdASoQAAwAA4BaJaGQzRhRAAHMAAD+2kPqFyRcIW/m5VZxX9H5lyc5wAAA',
    alt: 'A brick wall',
    srcSet: {
      avif: `${wordWallAvif160} 160w, ${wordWallAvif} 320w`,
      webp: `${wordWallWebp160} 160w, ${wordWallWebp} 320w`,
    },
  },
  tall: {
    avif: wordTallAvif,
    webp: wordTallWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADwAQCdASoQAAwAA4BaJZgCdAEPAPHSMgAA/ueHYyMQe36sqf+/fN6X6w8tT/Dedq8lIDdl9aMxAAAA',
    alt: 'A very tall skyscraper with a height marker line, like the Burj Khalifa',
    srcSet: {
      avif: `${wordTallAvif160} 160w, ${wordTallAvif} 320w`,
      webp: `${wordTallWebp160} 160w, ${wordTallWebp} 320w`,
    },
  },
  six: {
    avif: wordSixAvif,
    webp: wordSixWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAAAwAgCdASoQAAwAA4BaJbACdEf/gbIPDbLQAAD+9hHOyb/6rjd4JLtkcJi1iQoCY9/G680qmwsMXSTPerLsrnMMovBkw6hRrIWW5p79fghxPbJRF9S3EYAA',
    alt: 'The number 6 on a keycap',
    srcSet: {
      avif: `${wordSixAvif160} 160w, ${wordSixAvif} 320w`,
      webp: `${wordSixWebp160} 160w, ${wordSixWebp} 320w`,
    },
  },
  seven: {
    avif: wordSevenAvif,
    webp: wordSevenWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAADwAQCdASoQAAwAA4BaJbACdADwuGheAAAA/vYSFlfTZb9FZulh4cG76+WK9R5BUTj+N15pViH8InuHtQH26DkypSXuqqmADqFGshZbmnv1+B63iTxTewZMAEAAAA==',
    alt: 'The number 7 on a keycap',
    srcSet: {
      avif: `${wordSevenAvif160} 160w, ${wordSevenAvif} 320w`,
      webp: `${wordSevenWebp160} 160w, ${wordSevenWebp} 320w`,
    },
  },
  eight: {
    avif: wordEightAvif,
    webp: wordEightWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAAAQAgCdASoQAAwAA4BaJbACdDBVQWOU2UmAAP72Ec7M1MdLZgr5QwiA07bssRX7eQdW5E8VvU+P75D8Yg2UWKrhKShRdp8CjdgW1Gg7/PNa9ZqNqyAAAA==',
    alt: 'The number 8 on a keycap',
    srcSet: {
      avif: `${wordEightAvif160} 160w, ${wordEightAvif} 320w`,
      webp: `${wordEightWebp160} 160w, ${wordEightWebp} 320w`,
    },
  },
  nine: {
    avif: wordNineAvif,
    webp: wordNineWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAAAQAgCdASoQAAwAA4BaJbACdFQAAy6npUAAAP72Ec7M1MLymg21qxayZHCRODf5ImXmlU682gk5gj8j8yy1rtW7r+L/7FkBhCvIX75n7O/bzlWGMsVZAAAA',
    alt: 'The number 9 on a keycap',
    srcSet: {
      avif: `${wordNineAvif160} 160w, ${wordNineAvif} 320w`,
      webp: `${wordNineWebp160} 160w, ${wordNineWebp} 320w`,
    },
  },
  eleven: {
    avif: wordElevenAvif,
    webp: wordElevenWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAQAgCdASoQAAwAA4BaJbACdAEN5YeBJboAAP71HZf2gn3aL11lPyh1NnqETEp0q93bppttOvBv3KACrJ8eYmiXLpIY/8Me7U25d16HMVvm/Jb7NumiSCFZjLYO6ogA',
    alt: 'The number 11 on a keycap',
    srcSet: {
      avif: `${wordElevenAvif160} 160w, ${wordElevenAvif} 320w`,
      webp: `${wordElevenWebp160} 160w, ${wordElevenWebp} 320w`,
    },
  },
  twelve: {
    avif: wordTwelveAvif,
    webp: wordTwelveWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAABQAgCdASoQAAwAA4BaJbACdGaAAwA4gTVbyQAA/vUdl/aCfdovXWU/KHU2eoRLYTEQ08TbP40ZlmJlHkSaCT8EuXSQx/4WHSo38eiETyV0iOP6drTIiCFZiD0pugAA',
    alt: 'The number 12 on a keycap',
    srcSet: {
      avif: `${wordTwelveAvif160} 160w, ${wordTwelveAvif} 320w`,
      webp: `${wordTwelveWebp160} 160w, ${wordTwelveWebp} 320w`,
    },
  },
  thirteen: {
    avif: wordThirteenAvif,
    webp: wordThirteenWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAABQAgCdASoQAAwAA4BaJbACdGaAAwA4gIplc4AA/vUdl/aCfdovXWU/KHU2eoRLYTEQ0vdjtp14N+5QAWN4nzxlwRBBrj1IHFq1a8UUJuednbAZ47tx/keNBuVeEAAA',
    alt: 'The number 13 on a keycap',
    srcSet: {
      avif: `${wordThirteenAvif160} 160w, ${wordThirteenAvif} 320w`,
      webp: `${wordThirteenWebp160} 160w, ${wordThirteenWebp} 320w`,
    },
  },
  fourteen: {
    avif: wordFourteenAvif,
    webp: wordFourteenWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAABQAgCdASoQAAwAA4BaJbACdGaAAwA412TSRoAA/vUdl/aCfdovXWU/KHU2eoRL6XQ4olJrSWoqKYmtqfuuyAZghqLLkp2qrMKWf8sq88Mqje1/XDZhpFfIgWxRLgAA',
    alt: 'The number 14 on a keycap',
    srcSet: {
      avif: `${wordFourteenAvif160} 160w, ${wordFourteenAvif} 320w`,
      webp: `${wordFourteenWebp160} 160w, ${wordFourteenWebp} 320w`,
    },
  },
  fifteen: {
    avif: wordFifteenAvif,
    webp: wordFifteenWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAABQAgCdASoQAAwAA4BaJbACdGaAAwA4nET3wQAA/vUdl/aCfdovXWU/KHU2eoRLYVHdBQzHXZCRc3U3uXxVSTjSG6sSbWjtVWYUs/5ZV54ZVG9r+uGzDSK+RAtiiXAA',
    alt: 'The number 15 on a keycap',
    srcSet: {
      avif: `${wordFifteenAvif160} 160w, ${wordFifteenAvif} 320w`,
      webp: `${wordFifteenWebp160} 160w, ${wordFifteenWebp} 320w`,
    },
  },
  sixteen: {
    avif: wordSixteenAvif,
    webp: wordSixteenWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAABQAgCdASoQAAwAA4BaJbACdGaAAwA4/HplUAAA/vUdl/aCfdovXWU/KHU2eoRMLT34xUdRbARFMTW1Pp34+tzgjaiy5KdqqzCln/LKuk3+9ziDjmwn9jVmIPSm6AAA',
    alt: 'The number 16 on a keycap',
    srcSet: {
      avif: `${wordSixteenAvif160} 160w, ${wordSixteenAvif} 320w`,
      webp: `${wordSixteenWebp160} 160w, ${wordSixteenWebp} 320w`,
    },
  },
  seventeen: {
    avif: wordSeventeenAvif,
    webp: wordSeventeenWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAAAQAgCdASoQAAwAA4BaJbACdAEN5ZbA1UUAAP71HZf2gn3aL11lPyh1NnqETCk8PTsDjy5Wtb0+RBVzAnMDrVYk2tHa4LUZHvrsLo67kI3tf1w219UdJ0HpaH8AAA==',
    alt: 'The number 17 on a keycap',
    srcSet: {
      avif: `${wordSeventeenAvif160} 160w, ${wordSeventeenAvif} 320w`,
      webp: `${wordSeventeenWebp160} 160w, ${wordSeventeenWebp} 320w`,
    },
  },
  eighteen: {
    avif: wordEighteenAvif,
    webp: wordEighteenWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAABQAgCdASoQAAwAA4BaJbACdGaAAwA4/HplUAAA/vUdl/aCfdovXWU/KHU2eoRMLT34xUdRbARFMTW1Pp34+tzgjaiy5KdqqzCln/mcq6Tf73OIOObCf2NWYg9KboAA',
    alt: 'The number 18 on a keycap',
    srcSet: {
      avif: `${wordEighteenAvif160} 160w, ${wordEighteenAvif} 320w`,
      webp: `${wordEighteenWebp160} 160w, ${wordEighteenWebp} 320w`,
    },
  },
  nineteen: {
    avif: wordNineteenAvif,
    webp: wordNineteenWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAABQAgCdASoQAAwAA4BaJbACdGaAAwA4/gfrdAAA/vUdl/aCfdovXWU/KHU2eoRMLWfdLrMskSQ9FEbTt0Hdh/9j57FOb7nhYdKjfx0ETpJar9DSzboB9BHjQblXhAAA',
    alt: 'The number 19 on a keycap',
    srcSet: {
      avif: `${wordNineteenAvif160} 160w, ${wordNineteenAvif} 320w`,
      webp: `${wordNineteenWebp160} 160w, ${wordNineteenWebp} 320w`,
    },
  },
  twenty: {
    avif: wordTwentyAvif,
    webp: wordTwentyWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAABQAgCdASoQAAwAA4BaJbACdGaAAwArO3cDoAAA/vUdl/aCfdovXWU/KHU2XI/QJgWspE/ukv0h6KQlSnnpmPn4JcukhmBseohg0qN/HohE6SWq/PtlPoQt0baPUAhHCgA=',
    alt: 'The number 20 on a keycap',
    srcSet: {
      avif: `${wordTwentyAvif160} 160w, ${wordTwentyAvif} 320w`,
      webp: `${wordTwentyWebp160} 160w, ${wordTwentyWebp} 320w`,
    },
  },
  thirty: {
    avif: wordThirtyAvif,
    webp: wordThirtyWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAABQAgCdASoQAAwAA4BaJbACdGaAAwA3ycEWxoAA/vUdl/aCfdovXWU/KHU2c9P91POkG5z/+CqaFiEHqKxlo5D1lGutttPp66kDi1atfHooNvG79sWQzboB9BHjQblXhAA=',
    alt: 'The number 30 on a keycap',
    srcSet: {
      avif: `${wordThirtyAvif160} 160w, ${wordThirtyAvif} 320w`,
      webp: `${wordThirtyWebp160} 160w, ${wordThirtyWebp} 320w`,
    },
  },
  forty: {
    avif: wordFortyAvif,
    webp: wordFortyWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAABQAgCdASoQAAwAA4BaJbACdGaAAwAxHK3pugAA/vUdl/aCfdovXWU/KHU2Xc8a2HmlgwBh/FOYP3dkNcg+d20qvKCIINcepBN8LIxHXuvAN8gc7R0hd2oaHkeNBuVeEAA=',
    alt: 'The number 40 on a keycap',
    srcSet: {
      avif: `${wordFortyAvif160} 160w, ${wordFortyAvif} 320w`,
      webp: `${wordFortyWebp160} 160w, ${wordFortyWebp} 320w`,
    },
  },
  fifty: {
    avif: wordFiftyAvif,
    webp: wordFiftyWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAAAwAgCdASoQAAwAA4BaJbACdGaAAwAoYkkiAAD+9R2X9oJ92i9dZT8odTZc4irFt5s/cVnvmIoNPmMa0TvUzXpONIrFOcbO49RDBpUb+PRCJ0ktV+fbKfQhbo20eoBCOFAAAA==',
    alt: 'The number 50 on a keycap',
    srcSet: {
      avif: `${wordFiftyAvif160} 160w, ${wordFiftyAvif} 320w`,
      webp: `${wordFiftyWebp160} 160w, ${wordFiftyWebp} 320w`,
    },
  },
  sixty: {
    avif: wordSixtyAvif,
    webp: wordSixtyWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAADwAQCdASoQAAwAA4BaJbACdAEN3T97UAAA/vUdl/aCfdovXWU/KHU2XLZELv7tT21LmLq5B+7tPz4dtctvPvhKKIcI88KbF1Nt/ohHvA8fatrmbTu1eC3qIppC4MxQAAA=',
    alt: 'The number 60 on a keycap',
    srcSet: {
      avif: `${wordSixtyAvif160} 160w, ${wordSixtyAvif} 320w`,
      webp: `${wordSixtyWebp160} 160w, ${wordSixtyWebp} 320w`,
    },
  },
  seventy: {
    avif: wordSeventyAvif,
    webp: wordSeventyWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAABQAgCdASoQAAwAA4BaJbACdGaAAwAE2eRtAAAA/vUdl/aZeka/M2OurtpAjB+b1JF2a0S6TmD926tHSztiTv2IeIrFOb/W49PcW5m914BvkDnbAZ47nv80RSCHrUQA',
    alt: 'The number 70 on a keycap',
    srcSet: {
      avif: `${wordSeventyAvif160} 160w, ${wordSeventyAvif} 320w`,
      webp: `${wordSeventyWebp160} 160w, ${wordSeventyWebp} 320w`,
    },
  },
  eighty: {
    avif: wordEightyAvif,
    webp: wordEightyWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAABQAgCdASoQAAwAA4BaJbACdGaAAwAr7wZwwAAA/vUdl/aCfdovXWU/KHU2XLZEK2jSrsck9tbrvyeZlahD5dEr4SiiHCPPAb0CuLczffLwDfIHO0dIXdqGh5HjQblXhAA=',
    alt: 'The number 80 on a keycap',
    srcSet: {
      avif: `${wordEightyAvif160} 160w, ${wordEightyAvif} 320w`,
      webp: `${wordEightyWebp160} 160w, ${wordEightyWebp} 320w`,
    },
  },
  ninety: {
    avif: wordNinetyAvif,
    webp: wordNinetyWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAQAgCdASoQAAwAA4BaJbACdAEN36yguMAAAP71HZf2gn3aL11lPyh1NlziKsTlFltS5KxD2w3t3VwnH4VYOB3w86aHuozsmhOb3y9DabmJHJK7T6EUhI18iPNy0lwA',
    alt: 'The number 90 on a keycap',
    srcSet: {
      avif: `${wordNinetyAvif160} 160w, ${wordNinetyAvif} 320w`,
      webp: `${wordNinetyWebp160} 160w, ${wordNinetyWebp} 320w`,
    },
  },
  hundred: {
    avif: wordHundredAvif,
    webp: wordHundredWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAAAwAgCdASoQAAwAA4BaJbACdGaAAwAhc6qpgAD+9R2X9oJ92i9dZT8odTYshx+dxD4wC+1EPbDenx66UsAGSwjttqAOXUgcWrVhJnvFZvziCog7kYf3emAA',
    alt: 'The number 100 on a keycap',
    srcSet: {
      avif: `${wordHundredAvif160} 160w, ${wordHundredAvif} 320w`,
      webp: `${wordHundredWebp160} 160w, ${wordHundredWebp} 320w`,
    },
  },
  potato: {
    avif: wordPotatoAvif,
    webp: wordPotatoWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADwAQCdASoQAAwAA4BaJZACdAEPAofXomAA/vTchGsu4+uxaQudzRx93k79O1yTSxw22mHS5DBsDofAWfYAAA==',
    alt: 'A whole brown-skinned potato',
    srcSet: {
      avif: `${wordPotatoAvif160} 160w, ${wordPotatoAvif} 320w`,
      webp: `${wordPotatoWebp160} 160w, ${wordPotatoWebp} 320w`,
    },
  },
  tomato: {
    avif: wordTomatoAvif,
    webp: wordTomatoWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAAAwAgCdASoQAAwAA4BaJbACdDBSQZCBSoRuAAD+83WC+Z9cN1d8qhejKrM++QU6fqrN07Y8Gk5X62reNstur8WyjXeqKgwW1kucjaH3IpcxZLF5UIAAAA==',
    alt: 'A whole red tomato with its green stem',
    srcSet: {
      avif: `${wordTomatoAvif160} 160w, ${wordTomatoAvif} 320w`,
      webp: `${wordTomatoWebp160} 160w, ${wordTomatoWebp} 320w`,
    },
  },
  onion: {
    avif: wordOnionAvif,
    webp: wordOnionWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAAAQAgCdASoQAAwAA4BaJZgCdAELYLrWuMoAAP701QITi4nzeGStiszASPF4iZzTnu6gt78ly1zpXGGuAAA=',
    alt: 'A whole purple-brown onion',
    srcSet: {
      avif: `${wordOnionAvif160} 160w, ${wordOnionAvif} 320w`,
      webp: `${wordOnionWebp160} 160w, ${wordOnionWebp} 320w`,
    },
  },
  garlic: {
    avif: wordGarlicAvif,
    webp: wordGarlicWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADwAQCdASoQAAwAA4BaJQBOgCFsGGA2pAAA/vYK0l3MJ84xJdzzRZNBXB704uLVmavE4roAAAA=',
    alt: 'A bulb of garlic',
    srcSet: {
      avif: `${wordGarlicAvif160} 160w, ${wordGarlicAvif} 320w`,
      webp: `${wordGarlicWebp160} 160w, ${wordGarlicWebp} 320w`,
    },
  },
  carrot: {
    avif: wordCarrotAvif,
    webp: wordCarrotWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAAAQAgCdASoQAAwAA4BaJbACdAEQ96gM0yFwAP72CiGGy+tSFquiajnA0VCxstY+VPaL0iF4sQaKm7hfzj+qjIix2SPLgAAA',
    alt: 'An orange carrot with its green leafy top',
    srcSet: {
      avif: `${wordCarrotAvif160} 160w, ${wordCarrotAvif} 320w`,
      webp: `${wordCarrotWebp160} 160w, ${wordCarrotWebp} 320w`,
    },
  },
  cucumber: {
    avif: wordCucumberAvif,
    webp: wordCucumberWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADwAQCdASoQAAwAA4BaJQBOgCHgU3kFdAAA/vYJ0edS370/cLSob8DaEMRB5qilDA3srlTD+0nF9POIggAAAA==',
    alt: 'A whole green cucumber',
    srcSet: {
      avif: `${wordCucumberAvif160} 160w, ${wordCucumberAvif} 320w`,
      webp: `${wordCucumberWebp160} 160w, ${wordCucumberWebp} 320w`,
    },
  },
  cabbage: {
    avif: wordCabbageAvif,
    webp: wordCabbageWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAADwAQCdASoQAAwAA4BaJZACdAEPAFOmueAA/vYE+3iodGY5dHRHTsMKalPBKm4OMQAAAA==',
    alt: 'A round pale-green cabbage head',
    srcSet: {
      avif: `${wordCabbageAvif160} 160w, ${wordCabbageAvif} 320w`,
      webp: `${wordCabbageWebp160} 160w, ${wordCabbageWebp} 320w`,
    },
  },
  cauliflower: {
    avif: wordCauliflowerAvif,
    webp: wordCauliflowerWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRiwAAABXRUJQVlA4ICAAAABwAQCdASoQAAwABwBaJYwCdAF1AAD+8gsQyfL4wwAAAA==',
    alt: 'A cream-white cauliflower head with green leaves at its base',
    srcSet: {
      avif: `${wordCauliflowerAvif160} 160w, ${wordCauliflowerAvif} 320w`,
      webp: `${wordCauliflowerWebp160} 160w, ${wordCauliflowerWebp} 320w`,
    },
  },
  broccoli: {
    avif: wordBroccoliAvif,
    webp: wordBroccoliWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADQAQCdASoQAAwAA4BaJbACdAD0hPFKWAD+9N/AAo3xnwwIbAcu4wSkYIZIERIDqXVCZlBLdpxBsJuXoXM6Et0zMDy0p8AA',
    alt: 'A green broccoli floret',
    srcSet: {
      avif: `${wordBroccoliAvif160} 160w, ${wordBroccoliAvif} 320w`,
      webp: `${wordBroccoliWebp160} 160w, ${wordBroccoliWebp} 320w`,
    },
  },
  spinach: {
    avif: wordSpinachAvif,
    webp: wordSpinachWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADwAQCdASoQAAwAA4BaJQBOgCHgAHxjzAAA/vTTN3wOcg3d6Nfi2ugRQ22Kg2vvBOwe4Po3bEQQAAAA',
    alt: 'A bunch of dark green spinach leaves',
    srcSet: {
      avif: `${wordSpinachAvif160} 160w, ${wordSpinachAvif} 320w`,
      webp: `${wordSpinachWebp160} 160w, ${wordSpinachWebp} 320w`,
    },
  },
  mushroom: {
    avif: wordMushroomAvif,
    webp: wordMushroomWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAACwAQCdASoQAAwAA4BaJZACdAEO+kKgAP703IRtFJpbSe9Z3h0aQKIJi9R8MzEPyrUoVutqw3Qw1RS/yTMAAA==',
    alt: 'A brown mushroom with a rounded cap',
    srcSet: {
      avif: `${wordMushroomAvif160} 160w, ${wordMushroomAvif} 320w`,
      webp: `${wordMushroomWebp160} 160w, ${wordMushroomWebp} 320w`,
    },
  },
  radish: {
    avif: wordRadishAvif,
    webp: wordRadishWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAAAQAgCdASoQAAwAA4BaJaACdAEPAAPnqZAAAP70zgmSloFM2IUowQSp0n4B0mpua50GtFQAAAA=',
    alt: 'A pink-red radish with its white root tip and green leafy top',
    srcSet: {
      avif: `${wordRadishAvif160} 160w, ${wordRadishAvif} 320w`,
      webp: `${wordRadishWebp160} 160w, ${wordRadishWebp} 320w`,
    },
  },
  beetroot: {
    avif: wordBeetrootAvif,
    webp: wordBeetrootWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADQAQCdASoQAAwAA4BaJQAAXOvpgBJfoAD+9M7E3b5nZi62RawlCVZMrbR2CWIUj87IcnwAAAA=',
    alt: 'A dark magenta beetroot with its leafy top',
    srcSet: {
      avif: `${wordBeetrootAvif160} 160w, ${wordBeetrootAvif} 320w`,
      webp: `${wordBeetrootWebp160} 160w, ${wordBeetrootWebp} 320w`,
    },
  },
  peas: {
    avif: wordPeasAvif,
    webp: wordPeasWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAAAQAgCdASoQAAwAA4BaJZACdAEQywMLw3IAAP7019iUJLtKW6wwrQwx8Rj8C12eD35Ja01lfYAkKkh0pgcVfVBigAA=',
    alt: 'An open green pea pod with peas inside',
    srcSet: {
      avif: `${wordPeasAvif160} 160w, ${wordPeasAvif} 320w`,
      webp: `${wordPeasWebp160} 160w, ${wordPeasWebp} 320w`,
    },
  },
  'green-beans': {
    avif: wordGreenBeansAvif,
    webp: wordGreenBeansWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAADQAQCdASoQAAwAA4BaJYgCdAEO+lDtqAD+9M4Mj5ftePfesfa8c42TsWkdbiBNE18AAA==',
    alt: 'A bundle of curved green bean pods',
    srcSet: {
      avif: `${wordGreenBeansAvif160} 160w, ${wordGreenBeansAvif} 320w`,
      webp: `${wordGreenBeansWebp160} 160w, ${wordGreenBeansWebp} 320w`,
    },
  },
  chilli: {
    avif: wordChilliAvif,
    webp: wordChilliWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADwAQCdASoQAAwAA4BaJbACdAEPAN50RAAA/vTUIJfdgZ5rQ2Z53q85NeobMxBNmVlwEfRDHNotJc0PvX9KwCbla16dgps8DMQlgAAA',
    alt: 'A red chilli pepper with a green stem',
    srcSet: {
      avif: `${wordChilliAvif160} 160w, ${wordChilliAvif} 320w`,
      webp: `${wordChilliWebp160} 160w, ${wordChilliWebp} 320w`,
    },
  },
  'red-pepper': {
    avif: wordRedPepperAvif,
    webp: wordRedPepperWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADwAQCdASoQAAwAA4BaJbACdAEO+ozikAAA/vTUGeAjx3pAcLt3W3W+zBmU05/GHPrNT34bQThGHIb5zl0Nv+YqUJv4Li5eD36eMAAA',
    alt: 'A whole red bell pepper',
    srcSet: {
      avif: `${wordRedPepperAvif160} 160w, ${wordRedPepperAvif} 320w`,
      webp: `${wordRedPepperWebp160} 160w, ${wordRedPepperWebp} 320w`,
    },
  },
  banana: {
    avif: wordBananaAvif,
    webp: wordBananaWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADQAQCdASoQAAwAA4BaJbACdAEO+lDtqAD+9wbYpYBy9e2fEc+9GNJ2tMz4QB1d3utAkm+ZGeWyfAAA',
    alt: 'A single ripe yellow banana',
    srcSet: {
      avif: `${wordBananaAvif160} 160w, ${wordBananaAvif} 320w`,
      webp: `${wordBananaWebp160} 160w, ${wordBananaWebp} 320w`,
    },
  },
  grape: {
    avif: wordGrapeAvif,
    webp: wordGrapeWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAAAQAgCdASoQAAwAA4BaJYgCdAEPCwEY3nQAAP701BngIuid7UHdpJgPYvj84ZHqO86M96C7G4a+SSNCi4hY3iAA',
    alt: 'A bunch of purple grapes',
    srcSet: {
      avif: `${wordGrapeAvif160} 160w, ${wordGrapeAvif} 320w`,
      webp: `${wordGrapeWebp160} 160w, ${wordGrapeWebp} 320w`,
    },
  },
  mango: {
    avif: wordMangoAvif,
    webp: wordMangoWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADQAQCdASoQAAwAA4BaJbACdADGkKdggAD+9hPdRuVTtZ7aT85XSxDmDNSocHpJNITPa0NygFPeIuz4/q3+VWxOUAA=',
    alt: 'A whole ripe mango',
    srcSet: {
      avif: `${wordMangoAvif160} 160w, ${wordMangoAvif} 320w`,
      webp: `${wordMangoWebp160} 160w, ${wordMangoWebp} 320w`,
    },
  },
  lemon: {
    avif: wordLemonAvif,
    webp: wordLemonWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADQAQCdASoQAAwAA4BaJbACdAEO9tsUoAD+9xA5FfmtkJjVDZjTaC5aGyfbu6DqyD2UeZPfTYhP0aWXt7AAAA==',
    alt: 'A single yellow lemon',
    srcSet: {
      avif: `${wordLemonAvif160} 160w, ${wordLemonAvif} 320w`,
      webp: `${wordLemonWebp160} 160w, ${wordLemonWebp} 320w`,
    },
  },
  watermelon: {
    avif: wordWatermelonAvif,
    webp: wordWatermelonWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAAAQAgCdASoQAAwAA4BaJagCdAELX++rW9mYAP72ENiS/Mlez7d+iwoCH8VA/sZrqcisbqxvX4YdkOCin/Le1U1lM28JzvRRAAA=',
    alt: 'A wedge of watermelon with visible seeds',
    srcSet: {
      avif: `${wordWatermelonAvif160} 160w, ${wordWatermelonAvif} 320w`,
      webp: `${wordWatermelonWebp160} 160w, ${wordWatermelonWebp} 320w`,
    },
  },
  melon: {
    avif: wordMelonAvif,
    webp: wordMelonWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADQAQCdASoQAAwAA4BaJaAAAtrmfDnoAAD+9xBWiiN1tVsuv1oeYkd3FhWXJ3Uv3/rbJ+vSnuAAAA==',
    alt: 'A whole cantaloupe melon',
    srcSet: {
      avif: `${wordMelonAvif160} 160w, ${wordMelonAvif} 320w`,
      webp: `${wordMelonWebp160} 160w, ${wordMelonWebp} 320w`,
    },
  },
  pineapple: {
    avif: wordPineappleAvif,
    webp: wordPineappleWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADwAQCdASoQAAwAA4BaJbACdAELX/PcAEAA/vcQVujcmsXgg9KpyflQTinr6fRprYsu+mxGZy40+flcAAA=',
    alt: 'A whole pineapple with spiky green crown',
    srcSet: {
      avif: `${wordPineappleAvif160} 160w, ${wordPineappleAvif} 320w`,
      webp: `${wordPineappleWebp160} 160w, ${wordPineappleWebp} 320w`,
    },
  },
  pomegranate: {
    avif: wordPomegranateAvif,
    webp: wordPomegranateWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAAAQAgCdASoQAAwAA4BaJbACdAEPAXFP1giAAP701QJgQkkjleG5BPrtv02B+15eD33Cz2Hkh/4fQpqEt5727cf1cL+h8/LkWfRAAA==',
    alt: 'A whole pomegranate with ruby seeds showing',
    srcSet: {
      avif: `${wordPomegranateAvif160} 160w, ${wordPomegranateAvif} 320w`,
      webp: `${wordPomegranateWebp160} 160w, ${wordPomegranateWebp} 320w`,
    },
  },
  fig: {
    avif: wordFigAvif,
    webp: wordFigWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADwAQCdASoQAAwAA4BaJYwCdAEO+on+dAAA/vTOxPJ07K1aagiGONvdyb5EkIkkQiJLRotRPwAAAA==',
    alt: 'A ripe purple fig with a cut showing pink flesh',
    srcSet: {
      avif: `${wordFigAvif160} 160w, ${wordFigAvif} 320w`,
      webp: `${wordFigWebp160} 160w, ${wordFigWebp} 320w`,
    },
  },
  'fresh-dates': {
    avif: wordFreshDatesAvif,
    webp: wordFreshDatesWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAAAQAgCdASoQAAwAA4BaJYgCdAEPABaGIEAAAP70zgyUjsT0cy7SIOzUVZSIdLnj2KlUMBEBlpHcNQm7AwAAAA==',
    alt: 'A small cluster of fresh dates on a stem',
    srcSet: {
      avif: `${wordFreshDatesAvif160} 160w, ${wordFreshDatesAvif} 320w`,
      webp: `${wordFreshDatesWebp160} 160w, ${wordFreshDatesWebp} 320w`,
    },
  },
  pear: {
    avif: wordPearAvif,
    webp: wordPearWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADwAQCdASoQAAwAA4BaJbAAAlvOl02PmAAA/vYT3Ub1aZpyj70KGC9BV/uxbIUG6/9sbvb+TMreYNUAAAA=',
    alt: 'A single green pear',
    srcSet: {
      avif: `${wordPearAvif160} 160w, ${wordPearAvif} 320w`,
      webp: `${wordPearWebp160} 160w, ${wordPearWebp} 320w`,
    },
  },
  cherry: {
    avif: wordCherryAvif,
    webp: wordCherryWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAACwAQCdASoQAAwAA4BaJbACdAEO/C4wAP701ECLov7Ephlw5IU33XfNhbgCxkq6P+0xbYh8W3fFEngv4Gq+Z8W9U0/6IEVI7bkUyoy/wo8mQAAA',
    alt: 'A pair of red cherries on a shared stem',
    srcSet: {
      avif: `${wordCherryAvif160} 160w, ${wordCherryAvif} 320w`,
      webp: `${wordCherryWebp160} 160w, ${wordCherryWebp} 320w`,
    },
  },
  strawberry: {
    avif: wordStrawberryAvif,
    webp: wordStrawberryWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAAAQAgCdASoQAAwAA4BaJbACdAEUr+ogfvZAAP701Rz5j3wxeGR2dORKsK0SEmBjaHaEfSrb69Q6Oq3KejkYA/QA',
    alt: 'A single red strawberry with green leaves',
    srcSet: {
      avif: `${wordStrawberryAvif160} 160w, ${wordStrawberryAvif} 320w`,
      webp: `${wordStrawberryWebp160} 160w, ${wordStrawberryWebp} 320w`,
    },
  },
  blueberry: {
    avif: wordBlueberryAvif,
    webp: wordBlueberryWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADQAQCdASoQAAwAA4BaJZgAApMINYJ0AAD+9N/AAonJ9CGvttxCgwREZmmWbetAWfdPmR7aICpvQDVw3/5ZoLvF2flcAAAA',
    alt: 'A small cluster of blueberries',
    srcSet: {
      avif: `${wordBlueberryAvif160} 160w, ${wordBlueberryAvif} 320w`,
      webp: `${wordBlueberryWebp160} 160w, ${wordBlueberryWebp} 320w`,
    },
  },
  blackberry: {
    avif: wordBlackberryAvif,
    webp: wordBlackberryWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAADwAQCdASoQAAwAA4BaJYwC7AEPAAkD3goA/vNutGutBXM58P3oro4Zz9zyjhWjvYAAAA==',
    alt: 'A cluster of dark blackberry druplets',
    srcSet: {
      avif: `${wordBlackberryAvif160} 160w, ${wordBlackberryAvif} 320w`,
      webp: `${wordBlackberryWebp160} 160w, ${wordBlackberryWebp} 320w`,
    },
  },
  raspberry: {
    avif: wordRaspberryAvif,
    webp: wordRaspberryWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACQAQCdASoQAAwAA4BaJZAAAudPjMAA/vTOC7b6Bim/EVbF/vmRkn9fREmfXYAA',
    alt: 'A cluster of red raspberry druplets',
    srcSet: {
      avif: `${wordRaspberryAvif160} 160w, ${wordRaspberryAvif} 320w`,
      webp: `${wordRaspberryWebp160} 160w, ${wordRaspberryWebp} 320w`,
    },
  },
  'kiwi-fruit': {
    avif: wordKiwiFruitAvif,
    webp: wordKiwiFruitWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADwAQCdASoQAAwAA4BaJbAAAudN+K/pmkAA/vYSsjAU2DJMEaTUVZArIoLAwXaFO1XZZrUYx3cNjf/a0zPhAJKsMvAAAA==',
    alt: 'A sliced kiwi fruit showing green flesh and seeds',
    srcSet: {
      avif: `${wordKiwiFruitAvif160} 160w, ${wordKiwiFruitAvif} 320w`,
      webp: `${wordKiwiFruitWebp160} 160w, ${wordKiwiFruitWebp} 320w`,
    },
  },
  guava: {
    avif: wordGuavaAvif,
    webp: wordGuavaWebp,
    width: 320,
    height: 240,
    lqip: 'data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAABQAQCdASoQAAwAA4BaJZAABAAAAP7xNRHyYgejT8iX1v4JwjGG9eEAAAA=',
    alt: 'A whole pale green guava with visible seeds',
    srcSet: {
      avif: `${wordGuavaAvif160} 160w, ${wordGuavaAvif} 320w`,
      webp: `${wordGuavaWebp160} 160w, ${wordGuavaWebp} 320w`,
    },
  },
};

/* ------------------------------------------------------- illustrations --- */

export const illustrations = {
  emptySearch: { src: emptySearchSrc, width: 240, height: 180, alt: 'No words match your search' },
  emptyBookmarks: {
    src: emptyBookmarksSrc,
    width: 240,
    height: 180,
    alt: 'You have not saved any words yet',
  },
  emptyProgress: {
    src: emptyProgressSrc,
    width: 240,
    height: 180,
    alt: 'No learning progress recorded yet',
  },
  errorGeneric: { src: errorGenericSrc, width: 240, height: 180, alt: 'Something went wrong' },
  offline: { src: offlineSrc, width: 240, height: 180, alt: 'You are offline' },
  notFound: { src: notFoundSrc, width: 240, height: 180, alt: 'This page could not be found' },
  quizComplete: {
    src: quizCompleteSrc,
    width: 240,
    height: 180,
    alt: 'Quiz complete — a trophy surrounded by confetti',
  },
} as const satisfies Record<string, VectorAsset>;

export const decorative = {
  leafFlourish: { src: leafFlourishSrc, width: 120, height: 120, alt: '', decorative: true },
  quoteBlob: { src: quoteBlobSrc, width: 220, height: 160, alt: '', decorative: true },
  heroGradientOverlay: {
    src: heroGradientOverlaySrc,
    width: 1600,
    height: 900,
    alt: '',
    decorative: true,
  },
  patternTile: { src: patternTileSrc, width: 80, height: 80, alt: '', decorative: true },
} as const satisfies Record<string, VectorAsset>;

/* ------------------------------------------------------------- sounds --- */

export const sounds = {
  correct: { src: correctSrc, label: 'Correct answer', durationMs: 480 },
  incorrect: { src: incorrectSrc, label: 'Incorrect answer', durationMs: 380 },
  complete: { src: completeSrc, label: 'Quiz complete', durationMs: 480 },
} as const satisfies Record<string, SoundAsset>;

/* ------------------------------------------------------------ lookups --- */

/**
 * Artwork for a word, or `undefined` when the word is not in the illustrated
 * subset — render the designed gradient tile instead.
 */
export function getWordArt(wordId: string): ImageAsset | undefined {
  return wordArt[wordId];
}

/**
 * Artwork for a category, or `undefined` when the category has no illustration
 * — render the designed gradient tile instead.
 */
export function getCategoryArt(categoryId: string): ImageAsset | undefined {
  return categoryArt[categoryId];
}

/** `true` when `wordId` has a real illustration. Narrows to `WordArtId`. */
export function hasWordArt(wordId: string): wordId is WordArtId {
  return wordId in wordArt;
}

/** `true` when `categoryId` has a real illustration. Narrows to `CategoryArtId`. */
export function hasCategoryArt(categoryId: string): categoryId is CategoryArtId {
  return categoryId in categoryArt;
}
