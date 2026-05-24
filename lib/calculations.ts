export type Gender = "male" | "female";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "high"
  | "athlete";

export type CalculatorInput = {
  gender: Gender;
  weight: number;
  age: number;
  height: number;
  activity: ActivityLevel;
  currentBodyFat: number;
  targetBodyFat: number;
  weeklyLossTarget: number;
};

export const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725,
  athlete: 1.9
};

export const activityLabels: Record<ActivityLevel, string> = {
  sedentary: "Sedentary",
  light: "Light activity",
  moderate: "Moderate activity",
  high: "High activity",
  athlete: "Athlete"
};

export type BodyFatImageRange = {
  min: number;
  max: number;
  file: string;
};

export const bodyFatImageRanges: Record<Gender, BodyFatImageRange[]> = {
  male: [
    { min: 4, max: 5, file: "4-5.png" },
    { min: 6, max: 7, file: "6-7.png" },
    { min: 8, max: 10, file: "8-10.png" },
    { min: 11, max: 12, file: "11-12.png" },
    { min: 13, max: 15, file: "13-15.png" },
    { min: 16, max: 19, file: "16-19.png" },
    { min: 20, max: 24, file: "20-24.png" },
    { min: 25, max: 30, file: "25-30.png" },
    { min: 35, max: 40, file: "35-40.png" }
  ],
  female: [
    { min: 12, max: 14, file: "12-14.png" },
    { min: 15, max: 17, file: "15-17.png" },
    { min: 18, max: 20, file: "18-20.png" },
    { min: 21, max: 23, file: "21-23.png" },
    { min: 24, max: 26, file: "24-26.png" },
    { min: 27, max: 29, file: "27-29.png" },
    { min: 30, max: 35, file: "30-35.png" },
    { min: 36, max: 40, file: "36-40.png" },
    { min: 50, max: 100, file: "50-100.png" }
  ]
};

export const bodyFatRanges: Record<Gender, { min: number; max: number }> = {
  male: {
    min: bodyFatImageRanges.male[0].min,
    max: bodyFatImageRanges.male[bodyFatImageRanges.male.length - 1].max
  },
  female: {
    min: bodyFatImageRanges.female[0].min,
    max: bodyFatImageRanges.female[bodyFatImageRanges.female.length - 1].max
  }
};

export function resolveBodyFatImage(gender: Gender, bodyFat: number) {
  const ranges = bodyFatImageRanges[gender];
  const inRange = ranges.find((range) => bodyFat >= range.min && bodyFat <= range.max);

  const range =
    inRange ??
    ranges.reduce((closest, candidate) => {
      const closestMidpoint = (closest.min + closest.max) / 2;
      const candidateMidpoint = (candidate.min + candidate.max) / 2;
      return Math.abs(candidateMidpoint - bodyFat) < Math.abs(closestMidpoint - bodyFat)
        ? candidate
        : closest;
    });

  return {
    ...range,
    src: `/${gender}/${range.file}`,
    label: `${range.min}-${range.max}%`
  };
}

export function clampBodyFat(gender: Gender, value: number) {
  const { min, max } = bodyFatRanges[gender];
  return Math.min(max, Math.max(min, value));
}

export function calculatePlan(input: CalculatorInput) {
  const currentBodyFatRatio = input.currentBodyFat / 100;
  const targetBodyFatRatio = input.targetBodyFat / 100;
  const fatMass = input.weight * currentBodyFatRatio;
  const leanMass = input.weight - fatMass;
  const targetWeight = leanMass / (1 - targetBodyFatRatio);
  const weightToLose = Math.max(0, input.weight - targetWeight);
  const totalCaloriesToBurn = weightToLose * 7700;
  const weeklyLoss = Math.min(1, Math.max(0.2, input.weeklyLossTarget));
  const dailyDeficit = (weeklyLoss * 7700) / 7;
  const bmr =
    10 * input.weight +
    6.25 * input.height -
    5 * input.age +
    (input.gender === "male" ? 5 : -161);
  const activityMultiplier = activityMultipliers[input.activity];
  const maintenance = bmr * activityMultiplier;
  const dailyCalories = Math.max(1200, maintenance - dailyDeficit);
  const estimatedWeeks = weeklyLoss > 0 ? Math.ceil(weightToLose / weeklyLoss) : 0;

  return {
    fatMass,
    leanMass,
    targetWeight,
    weightToLose,
    totalCaloriesToBurn,
    weeklyLoss,
    dailyDeficit,
    bmr,
    activityMultiplier,
    maintenance,
    dailyCalories,
    estimatedWeeks
  };
}

export function projectedTimeline(input: CalculatorInput, weeks = 8) {
  const result = calculatePlan(input);
  const points = [];

  for (let week = 0; week <= weeks; week += 1) {
    const projectedLoss = Math.min(result.weightToLose, result.weeklyLoss * week);
    const progress = result.weightToLose === 0 ? 1 : projectedLoss / result.weightToLose;
    const weight = input.weight - projectedLoss;
    const bodyFat =
      input.currentBodyFat -
      Math.max(0, input.currentBodyFat - input.targetBodyFat) * progress;

    points.push({
      week,
      weight: Number(weight.toFixed(1)),
      bodyFat: Number(bodyFat.toFixed(1))
    });
  }

  return points;
}

export function macroTargets(calories: number, leanMass: number) {
  const protein = Math.round(leanMass * 2.1);
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));

  return { protein, fat, carbs };
}
