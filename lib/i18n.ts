import type { ActivityLevel, Gender } from "@/lib/calculations";

export type Locale = "en" | "ru" | "uk";

export type MetricKey =
  | "fatMass"
  | "leanMass"
  | "targetWeight"
  | "weightToLose"
  | "caloriesToBurn"
  | "dailyDeficit"
  | "dailyIntake"
  | "timeline";

export type MetricInfoValues = {
  weight: string;
  currentBodyFat: string;
  targetBodyFat: string;
  fatMass: string;
  leanMass: string;
  targetWeight: string;
  weightToLose: string;
  totalCaloriesToBurn: string;
  weeklyLoss: string;
  dailyDeficit: string;
  bmr: string;
  activityMultiplier: string;
  maintenance: string;
  dailyCalories: string;
  estimatedWeeks: string;
};

type MetricInfo = {
  title: string;
  lines: string[];
};

type Translation = {
  localeName: string;
  badge: string;
  title: string;
  subtitle: string;
  toggleTheme: string;
  share: string;
  inputs: string;
  gender: string;
  genders: Record<Gender, string>;
  weight: string;
  age: string;
  height: string;
  activity: string;
  activities: Record<ActivityLevel, string>;
  currentBodyFat: string;
  targetBodyFat: string;
  bodyFatSelector: string;
  currentBody: string;
  targetBody: string;
  results: string;
  fatMass: string;
  leanMass: string;
  targetWeight: string;
  weightToLose: string;
  caloriesToBurn: string;
  dailyDeficit: string;
  dailyIntake: string;
  timeline: string;
  visualTransformation: string;
  current: string;
  target: string;
  macroTargets: string;
  protein: string;
  carbs: string;
  fat: string;
  weeklyMomentum: string;
  weeklyMomentumText: (weeklyLoss: string) => string;
  projectedWeightLoss: string;
  bodyFatReduction: string;
  desiredVelocity: string;
  velocityHint: string;
  week: string;
  weeks: string;
  infoLabel: string;
  close: string;
  metricInfo: Record<MetricKey, (values: MetricInfoValues) => MetricInfo>;
  bodyFatAlt: (label: string, bodyFat: number) => string;
};

const enMetricInfo: Translation["metricInfo"] = {
  fatMass: (v) => ({
    title: "Fat mass",
    lines: [
      "Fat mass is the part of your current body weight that is fat tissue.",
      "Formula: body weight x current body fat percentage.",
      `Current calculation: ${v.weight} x ${v.currentBodyFat} = ${v.fatMass}.`
    ]
  }),
  leanMass: (v) => ({
    title: "Lean mass",
    lines: [
      "Lean mass is everything that is not fat: muscle, organs, bone, water, and connective tissue.",
      "Formula: body weight - fat mass.",
      `Current calculation: ${v.weight} - ${v.fatMass} = ${v.leanMass}.`
    ]
  }),
  targetWeight: (v) => ({
    title: "Target weight",
    lines: [
      "Target weight estimates what you would weigh if lean mass stayed the same and body fat reached your target.",
      "Formula: lean mass / (1 - target body fat percentage).",
      `Current calculation: ${v.leanMass} / (1 - ${v.targetBodyFat}) = ${v.targetWeight}.`
    ]
  }),
  weightToLose: (v) => ({
    title: "Weight to lose",
    lines: [
      "This is the difference between your current weight and estimated target weight.",
      "Formula: current weight - target weight.",
      `Current calculation: ${v.weight} - ${v.targetWeight} = ${v.weightToLose}.`
    ]
  }),
  caloriesToBurn: (v) => ({
    title: "Calories to burn",
    lines: [
      "This estimates the energy deficit needed for the weight you want to lose.",
      "The app uses 7,700 kcal as an approximate energy value for 1 kg of fat loss.",
      `Current calculation: ${v.weightToLose} x 7,700 = ${v.totalCaloriesToBurn}.`
    ]
  }),
  dailyDeficit: (v) => ({
    title: "Daily deficit",
    lines: [
      "Daily deficit comes from your selected weekly loss velocity.",
      "Formula: selected weekly loss x 7,700 / 7 days.",
      `Current calculation: ${v.weeklyLoss} x 7,700 / 7 = ${v.dailyDeficit}.`
    ]
  }),
  dailyIntake: (v) => ({
    title: "Daily intake",
    lines: [
      "Daily intake is estimated maintenance calories minus the daily deficit.",
      "Maintenance is calculated from Mifflin-St Jeor BMR, then multiplied by your activity level.",
      `BMR: ${v.bmr}. Activity multiplier: ${v.activityMultiplier}. Maintenance: ${v.maintenance}.`,
      `Current calculation: ${v.maintenance} - ${v.dailyDeficit} = ${v.dailyCalories}.`
    ]
  }),
  timeline: (v) => ({
    title: "Timeline",
    lines: [
      "Timeline estimates how many weeks are needed to reach the target at your selected weekly loss velocity.",
      "Formula: weight to lose / selected weekly loss.",
      `Current calculation: ${v.weightToLose} / ${v.weeklyLoss} = ${v.estimatedWeeks}.`
    ]
  })
};

const ruMetricInfo: Translation["metricInfo"] = {
  fatMass: (v) => ({
    title: "Масса жира",
    lines: [
      "Масса жира - это часть текущего веса, которая приходится на жировую ткань.",
      "Формула: вес тела x текущий процент жира.",
      `Текущий расчет: ${v.weight} x ${v.currentBodyFat} = ${v.fatMass}.`
    ]
  }),
  leanMass: (v) => ({
    title: "Сухая масса",
    lines: [
      "Сухая масса - это все, что не является жиром: мышцы, органы, кости, вода и соединительные ткани.",
      "Формула: вес тела - масса жира.",
      `Текущий расчет: ${v.weight} - ${v.fatMass} = ${v.leanMass}.`
    ]
  }),
  targetWeight: (v) => ({
    title: "Целевой вес",
    lines: [
      "Целевой вес показывает, сколько вы будете весить, если сухая масса сохранится, а процент жира снизится до цели.",
      "Формула: сухая масса / (1 - целевой процент жира).",
      `Текущий расчет: ${v.leanMass} / (1 - ${v.targetBodyFat}) = ${v.targetWeight}.`
    ]
  }),
  weightToLose: (v) => ({
    title: "Нужно сбросить",
    lines: [
      "Это разница между текущим весом и расчетным целевым весом.",
      "Формула: текущий вес - целевой вес.",
      `Текущий расчет: ${v.weight} - ${v.targetWeight} = ${v.weightToLose}.`
    ]
  }),
  caloriesToBurn: (v) => ({
    title: "Калорий к сжиганию",
    lines: [
      "Это примерный общий дефицит энергии, нужный для снижения веса.",
      "Приложение использует приближение: 1 кг жира = 7700 ккал.",
      `Текущий расчет: ${v.weightToLose} x 7700 = ${v.totalCaloriesToBurn}.`
    ]
  }),
  dailyDeficit: (v) => ({
    title: "Дневной дефицит",
    lines: [
      "Дневной дефицит зависит от выбранной скорости похудения в неделю.",
      "Формула: выбранная недельная потеря x 7700 / 7 дней.",
      `Текущий расчет: ${v.weeklyLoss} x 7700 / 7 = ${v.dailyDeficit}.`
    ]
  }),
  dailyIntake: (v) => ({
    title: "Дневная норма",
    lines: [
      "Дневная норма - это расчетные поддерживающие калории минус дневной дефицит.",
      "Поддержание считается через BMR по формуле Миффлина-Сан Жеора и множитель активности.",
      `BMR: ${v.bmr}. Множитель активности: ${v.activityMultiplier}. Поддержание: ${v.maintenance}.`,
      `Текущий расчет: ${v.maintenance} - ${v.dailyDeficit} = ${v.dailyCalories}.`
    ]
  }),
  timeline: (v) => ({
    title: "Срок",
    lines: [
      "Срок показывает, сколько недель нужно до цели при выбранной скорости похудения.",
      "Формула: вес к снижению / выбранная недельная потеря.",
      `Текущий расчет: ${v.weightToLose} / ${v.weeklyLoss} = ${v.estimatedWeeks}.`
    ]
  })
};

const ukMetricInfo: Translation["metricInfo"] = {
  fatMass: (v) => ({
    title: "Маса жиру",
    lines: [
      "Маса жиру - це частина поточної ваги, яка припадає на жирову тканину.",
      "Формула: вага тіла x поточний відсоток жиру.",
      `Поточний розрахунок: ${v.weight} x ${v.currentBodyFat} = ${v.fatMass}.`
    ]
  }),
  leanMass: (v) => ({
    title: "Суха маса",
    lines: [
      "Суха маса - це все, що не є жиром: м'язи, органи, кістки, вода та сполучні тканини.",
      "Формула: вага тіла - маса жиру.",
      `Поточний розрахунок: ${v.weight} - ${v.fatMass} = ${v.leanMass}.`
    ]
  }),
  targetWeight: (v) => ({
    title: "Цільова вага",
    lines: [
      "Цільова вага показує, скільки ви важитимете, якщо суха маса збережеться, а відсоток жиру знизиться до цілі.",
      "Формула: суха маса / (1 - цільовий відсоток жиру).",
      `Поточний розрахунок: ${v.leanMass} / (1 - ${v.targetBodyFat}) = ${v.targetWeight}.`
    ]
  }),
  weightToLose: (v) => ({
    title: "Потрібно скинути",
    lines: [
      "Це різниця між поточною вагою та розрахунковою цільовою вагою.",
      "Формула: поточна вага - цільова вага.",
      `Поточний розрахунок: ${v.weight} - ${v.targetWeight} = ${v.weightToLose}.`
    ]
  }),
  caloriesToBurn: (v) => ({
    title: "Калорій до спалення",
    lines: [
      "Це приблизний загальний дефіцит енергії, потрібний для зниження ваги.",
      "Застосунок використовує наближення: 1 кг жиру = 7700 ккал.",
      `Поточний розрахунок: ${v.weightToLose} x 7700 = ${v.totalCaloriesToBurn}.`
    ]
  }),
  dailyDeficit: (v) => ({
    title: "Денний дефіцит",
    lines: [
      "Денний дефіцит залежить від вибраної швидкості схуднення на тиждень.",
      "Формула: вибрана тижнева втрата x 7700 / 7 днів.",
      `Поточний розрахунок: ${v.weeklyLoss} x 7700 / 7 = ${v.dailyDeficit}.`
    ]
  }),
  dailyIntake: (v) => ({
    title: "Денна норма",
    lines: [
      "Денна норма - це розрахункові підтримувальні калорії мінус денний дефіцит.",
      "Підтримання рахується через BMR за формулою Міффліна-Сан Жеора та множник активності.",
      `BMR: ${v.bmr}. Множник активності: ${v.activityMultiplier}. Підтримання: ${v.maintenance}.`,
      `Поточний розрахунок: ${v.maintenance} - ${v.dailyDeficit} = ${v.dailyCalories}.`
    ]
  }),
  timeline: (v) => ({
    title: "Термін",
    lines: [
      "Термін показує, скільки тижнів потрібно до цілі за вибраної швидкості схуднення.",
      "Формула: вага до зниження / вибрана тижнева втрата.",
      `Поточний розрахунок: ${v.weightToLose} / ${v.weeklyLoss} = ${v.estimatedWeeks}.`
    ]
  })
};

export const translations: Record<Locale, Translation> = {
  en: {
    localeName: "EN",
    badge: "Body recomposition planner",
    title: "LeanPath",
    subtitle:
      "Calculate body composition, target weight, calorie deficit, and an 8-week fat-loss projection from one polished control surface.",
    toggleTheme: "Toggle dark mode",
    share: "Share",
    inputs: "Inputs",
    gender: "Gender",
    genders: { male: "Male", female: "Female" },
    weight: "Weight",
    age: "Age",
    height: "Height",
    activity: "Activity",
    activities: {
      sedentary: "Sedentary",
      light: "Light activity",
      moderate: "Moderate activity",
      high: "High activity",
      athlete: "Athlete"
    },
    currentBodyFat: "Current body fat",
    targetBodyFat: "Target body fat",
    bodyFatSelector: "Body Fat Selector",
    currentBody: "Current body",
    targetBody: "Target body",
    results: "Results",
    fatMass: "Fat mass",
    leanMass: "Lean mass",
    targetWeight: "Target weight",
    weightToLose: "Weight to lose",
    caloriesToBurn: "Calories to burn",
    dailyDeficit: "Daily deficit",
    dailyIntake: "Daily intake",
    timeline: "Timeline",
    visualTransformation: "Visual Transformation",
    current: "Current",
    target: "Target",
    macroTargets: "Macro Targets",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Fat",
    weeklyMomentum: "Weekly momentum",
    weeklyMomentumText: (weeklyLoss) =>
      `${weeklyLoss} per week at your selected loss velocity.`,
    projectedWeightLoss: "Projected Weight Loss",
    bodyFatReduction: "Body Fat Reduction",
    desiredVelocity: "Desired loss velocity",
    velocityHint: "200 g to 1 kg per week",
    week: "Week",
    weeks: "weeks",
    infoLabel: "Show calculation details",
    close: "Close",
    metricInfo: enMetricInfo,
    bodyFatAlt: (label, bodyFat) => `${label}, ${bodyFat}% body fat`
  },
  ru: {
    localeName: "RU",
    badge: "Планировщик рекомпозиции тела",
    title: "LeanPath",
    subtitle:
      "Рассчитайте состав тела, целевой вес, дефицит калорий и прогноз снижения веса на 8 недель.",
    toggleTheme: "Переключить темную тему",
    share: "Поделиться",
    inputs: "Данные",
    gender: "Пол",
    genders: { male: "Мужской", female: "Женский" },
    weight: "Вес",
    age: "Возраст",
    height: "Рост",
    activity: "Активность",
    activities: {
      sedentary: "Сидячий образ",
      light: "Легкая активность",
      moderate: "Средняя активность",
      high: "Высокая активность",
      athlete: "Атлет"
    },
    currentBodyFat: "Текущий процент жира",
    targetBodyFat: "Целевой процент жира",
    bodyFatSelector: "Выбор процента жира",
    currentBody: "Текущее тело",
    targetBody: "Целевое тело",
    results: "Результаты",
    fatMass: "Масса жира",
    leanMass: "Сухая масса",
    targetWeight: "Целевой вес",
    weightToLose: "Нужно сбросить",
    caloriesToBurn: "Калорий к сжиганию",
    dailyDeficit: "Дневной дефицит",
    dailyIntake: "Дневная норма",
    timeline: "Срок",
    visualTransformation: "Визуальная трансформация",
    current: "Сейчас",
    target: "Цель",
    macroTargets: "Макроцели",
    protein: "Белки",
    carbs: "Углеводы",
    fat: "Жиры",
    weeklyMomentum: "Недельный темп",
    weeklyMomentumText: (weeklyLoss) =>
      `${weeklyLoss} в неделю при выбранной скорости снижения веса.`,
    projectedWeightLoss: "Прогноз веса на 8 недель",
    bodyFatReduction: "Снижение процента жира",
    desiredVelocity: "Желаемая скорость похудения",
    velocityHint: "От 200 г до 1 кг в неделю",
    week: "Неделя",
    weeks: "нед.",
    infoLabel: "Показать детали расчета",
    close: "Закрыть",
    metricInfo: ruMetricInfo,
    bodyFatAlt: (label, bodyFat) => `${label}, ${bodyFat}% жира`
  },
  uk: {
    localeName: "UK",
    badge: "Планувальник рекомпозиції тіла",
    title: "LeanPath",
    subtitle:
      "Розрахуйте склад тіла, цільову вагу, дефіцит калорій і прогноз зниження ваги на 8 тижнів.",
    toggleTheme: "Перемкнути темну тему",
    share: "Поділитися",
    inputs: "Дані",
    gender: "Стать",
    genders: { male: "Чоловіча", female: "Жіноча" },
    weight: "Вага",
    age: "Вік",
    height: "Зріст",
    activity: "Активність",
    activities: {
      sedentary: "Сидячий спосіб",
      light: "Легка активність",
      moderate: "Середня активність",
      high: "Висока активність",
      athlete: "Атлет"
    },
    currentBodyFat: "Поточний відсоток жиру",
    targetBodyFat: "Цільовий відсоток жиру",
    bodyFatSelector: "Вибір відсотка жиру",
    currentBody: "Поточне тіло",
    targetBody: "Цільове тіло",
    results: "Результати",
    fatMass: "Маса жиру",
    leanMass: "Суха маса",
    targetWeight: "Цільова вага",
    weightToLose: "Потрібно скинути",
    caloriesToBurn: "Калорій до спалення",
    dailyDeficit: "Денний дефіцит",
    dailyIntake: "Денна норма",
    timeline: "Термін",
    visualTransformation: "Візуальна трансформація",
    current: "Зараз",
    target: "Ціль",
    macroTargets: "Макроцілі",
    protein: "Білки",
    carbs: "Вуглеводи",
    fat: "Жири",
    weeklyMomentum: "Тижневий темп",
    weeklyMomentumText: (weeklyLoss) =>
      `${weeklyLoss} на тиждень за вибраної швидкості зниження ваги.`,
    projectedWeightLoss: "Прогноз ваги на 8 тижнів",
    bodyFatReduction: "Зниження відсотка жиру",
    desiredVelocity: "Бажана швидкість схуднення",
    velocityHint: "Від 200 г до 1 кг на тиждень",
    week: "Тиждень",
    weeks: "тиж.",
    infoLabel: "Показати деталі розрахунку",
    close: "Закрити",
    metricInfo: ukMetricInfo,
    bodyFatAlt: (label, bodyFat) => `${label}, ${bodyFat}% жиру`
  }
};
