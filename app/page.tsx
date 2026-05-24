"use client";

import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CalendarClock,
  Flame,
  Info,
  Moon,
  Scale,
  Share2,
  Sparkles,
  Sun,
  Target,
  TrendingDown,
  Trophy,
  X,
  Zap
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  ActivityLevel,
  Gender,
  bodyFatRanges,
  calculatePlan,
  clampBodyFat,
  macroTargets,
  resolveBodyFatImage,
  projectedTimeline
} from "@/lib/calculations";
import { Locale, MetricKey, MetricInfoValues, translations } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 }
  }
};

const item: Variants = {
  hidden: { y: 18, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.45, ease: [0, 0, 0.2, 1] } }
};

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const formatKg = (value: number) => `${value.toFixed(1)} kg`;
const formatKcal = (value: number) => `${Math.round(value).toLocaleString()} kcal`;

export default function Home() {
  const [gender, setGender] = useState<Gender>("male");
  const [weight, setWeight] = useState(95);
  const [age, setAge] = useState(32);
  const [height, setHeight] = useState(181);
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [currentBodyFat, setCurrentBodyFat] = useState(22);
  const [targetBodyFat, setTargetBodyFat] = useState(12);
  const [weeklyLossTarget, setWeeklyLossTarget] = useState(1);
  const [locale, setLocale] = useState<Locale>("en");
  const [activeMetric, setActiveMetric] = useState<MetricKey | null>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const t = translations[locale];

  const input = {
    gender,
    weight,
    age,
    height,
    activity,
    currentBodyFat,
    targetBodyFat,
    weeklyLossTarget
  };

  const results = useMemo(() => calculatePlan(input), [input]);
  const timeline = useMemo(() => projectedTimeline(input, 8), [input]);
  const macros = useMemo(
    () => macroTargets(results.dailyCalories, results.leanMass),
    [results.dailyCalories, results.leanMass]
  );

  const currentImage = resolveBodyFatImage(gender, currentBodyFat);
  const targetImage = resolveBodyFatImage(gender, targetBodyFat);
  const currentImageSrc = `${publicBasePath}${currentImage.src}`;
  const targetImageSrc = `${publicBasePath}${targetImage.src}`;
  const progress =
    results.weightToLose === 0
      ? 100
      : Math.min(100, Math.round((results.weeklyLoss / results.weightToLose) * 100));
  const metricInfoValues: MetricInfoValues = {
    weight: formatKg(weight),
    currentBodyFat: `${currentBodyFat / 100}`,
    targetBodyFat: `${targetBodyFat / 100}`,
    fatMass: formatKg(results.fatMass),
    leanMass: formatKg(results.leanMass),
    targetWeight: formatKg(results.targetWeight),
    weightToLose: formatKg(results.weightToLose),
    totalCaloriesToBurn: formatKcal(results.totalCaloriesToBurn),
    weeklyLoss: formatKg(results.weeklyLoss),
    dailyDeficit: formatKcal(results.dailyDeficit),
    bmr: formatKcal(results.bmr),
    activityMultiplier: results.activityMultiplier.toFixed(3).replace(/0+$/, "").replace(/\.$/, ""),
    maintenance: formatKcal(results.maintenance),
    dailyCalories: formatKcal(results.dailyCalories),
    estimatedWeeks: `${results.estimatedWeeks} ${t.weeks}`
  };
  const activeMetricInfo = activeMetric
    ? t.metricInfo[activeMetric](metricInfoValues)
    : null;

  function updateGender(nextGender: Gender) {
    setGender(nextGender);
    setCurrentBodyFat((value) => clampBodyFat(nextGender, value));
    setTargetBodyFat((value) => clampBodyFat(nextGender, value));
  }

  return (
    <main className="min-h-screen overflow-hidden px-4 py-5 sm:px-6 lg:px-8">
      <InfoDialog
        info={activeMetricInfo}
        closeLabel={t.close}
        onClose={() => setActiveMetric(null)}
      />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-5 rounded-[2rem] border border-white/40 bg-background/35 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 sm:p-7 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              {t.badge}
            </div>
            <h1 className="max-w-4xl text-4xl font-black tracking-normal text-foreground sm:text-5xl lg:text-6xl">
              {t.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {t.subtitle}
            </p>
          </motion.div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="grid grid-cols-3 gap-1 rounded-full bg-secondary/70 p-1">
              {(["en", "ru", "uk"] as Locale[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setLocale(option)}
                  className={cn(
                    "rounded-full px-3 py-2 text-xs font-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    locale === option
                      ? "bg-background text-foreground shadow-glass"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {translations[option].localeName}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              aria-label={t.toggleTheme}
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                const params = new URLSearchParams({
                  gender,
                  weight: String(weight),
                  age: String(age),
                  height: String(height),
                  activity,
                  currentBodyFat: String(currentBodyFat),
                  targetBodyFat: String(targetBodyFat),
                  weeklyLossTarget: String(weeklyLossTarget),
                  locale
                });
                navigator.clipboard?.writeText(`${location.origin}?${params.toString()}`);
              }}
            >
              <Share2 className="h-4 w-4" />
              {t.share}
            </Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
          <motion.section
            variants={container}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
            aria-label={t.inputs}
          >
            <motion.div variants={item}>
              <Card className="glass">
                <CardHeader>
                  <CardTitle>{t.inputs}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>{t.gender}</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2 rounded-full bg-secondary/70 p-1">
                      {(["male", "female"] as Gender[]).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateGender(option)}
                          className={cn(
                            "rounded-full px-4 py-3 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            gender === option
                              ? "bg-background text-foreground shadow-glass"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {t.genders[option]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <NumberField
                      label={t.weight}
                      suffix="kg"
                      value={weight}
                      min={35}
                      max={250}
                      onChange={setWeight}
                    />
                    <NumberField
                      label={t.age}
                      suffix="yrs"
                      value={age}
                      min={14}
                      max={90}
                      onChange={setAge}
                    />
                    <NumberField
                      label={t.height}
                      suffix="cm"
                      value={height}
                      min={120}
                      max={230}
                      onChange={setHeight}
                    />
                    <div className="space-y-2">
                      <Label htmlFor="activity">{t.activity}</Label>
                      <Select
                        value={activity}
                        onValueChange={(value) => setActivity(value as ActivityLevel)}
                      >
                        <SelectTrigger id="activity">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(t.activities).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <BodyFatSlider
                    label={t.currentBodyFat}
                    gender={gender}
                    value={currentBodyFat}
                    onChange={setCurrentBodyFat}
                  />
                  <BodyFatSlider
                    label={t.targetBodyFat}
                    gender={gender}
                    value={targetBodyFat}
                    onChange={setTargetBodyFat}
                  />
                  <VelocitySlider
                    label={t.desiredVelocity}
                    hint={t.velocityHint}
                    value={weeklyLossTarget}
                    onChange={setWeeklyLossTarget}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="glass overflow-hidden">
                <CardHeader>
                  <CardTitle>{t.bodyFatSelector}</CardTitle>
                </CardHeader>
                <CardContent>
                  <BodyImage
                    imageSrc={currentImageSrc}
                    imageKey={`${gender}-${currentImage.file}`}
                    displayValue={`${currentBodyFat}%`}
                    label={t.currentBody}
                    altText={t.bodyFatAlt(t.currentBody, currentBodyFat)}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </motion.section>

          <section className="flex flex-col gap-6">
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
              aria-label={t.results}
            >
              <Metric
                icon={Flame}
                label={t.fatMass}
                value={formatKg(results.fatMass)}
                infoLabel={t.infoLabel}
                onInfo={() => setActiveMetric("fatMass")}
              />
              <Metric
                icon={Activity}
                label={t.leanMass}
                value={formatKg(results.leanMass)}
                infoLabel={t.infoLabel}
                onInfo={() => setActiveMetric("leanMass")}
              />
              <Metric
                icon={Target}
                label={t.targetWeight}
                value={formatKg(results.targetWeight)}
                infoLabel={t.infoLabel}
                onInfo={() => setActiveMetric("targetWeight")}
              />
              <Metric
                icon={TrendingDown}
                label={t.weightToLose}
                value={formatKg(results.weightToLose)}
                infoLabel={t.infoLabel}
                onInfo={() => setActiveMetric("weightToLose")}
              />
              <Metric
                icon={Zap}
                label={t.caloriesToBurn}
                value={formatKcal(results.totalCaloriesToBurn)}
                infoLabel={t.infoLabel}
                onInfo={() => setActiveMetric("caloriesToBurn")}
              />
              <Metric
                icon={Scale}
                label={t.dailyDeficit}
                value={formatKcal(results.dailyDeficit)}
                infoLabel={t.infoLabel}
                onInfo={() => setActiveMetric("dailyDeficit")}
              />
              <Metric
                icon={Flame}
                label={t.dailyIntake}
                value={formatKcal(results.dailyCalories)}
                infoLabel={t.infoLabel}
                onInfo={() => setActiveMetric("dailyIntake")}
              />
              <Metric
                icon={CalendarClock}
                label={t.timeline}
                value={`${results.estimatedWeeks} ${t.weeks}`}
                infoLabel={t.infoLabel}
                onInfo={() => setActiveMetric("timeline")}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]"
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle>{t.visualTransformation}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
                    <TransformationPanel
                      title={t.current}
                      imageSrc={currentImageSrc}
                      imageKey={`${gender}-${currentImage.file}`}
                      percent={currentBodyFat}
                      weight={weight}
                      altText={t.bodyFatAlt(t.current, currentBodyFat)}
                    />
                    <div className="mx-auto hidden h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground md:flex">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                    <TransformationPanel
                      title={t.target}
                      imageSrc={targetImageSrc}
                      imageKey={`${gender}-${targetImage.file}`}
                      percent={targetBodyFat}
                      weight={results.targetWeight}
                      altText={t.bodyFatAlt(t.target, targetBodyFat)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>{t.macroTargets}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <MacroBar label={t.protein} value={macros.protein} color="bg-primary" />
                  <MacroBar label={t.carbs} value={macros.carbs} color="bg-accent" />
                  <MacroBar label={t.fat} value={macros.fat} color="bg-sky-500" />
                  <div className="rounded-2xl bg-secondary/70 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-bold">
                      <Trophy className="h-4 w-4 text-accent" />
                      {t.weeklyMomentum}
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-background/70">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {t.weeklyMomentumText(formatKg(results.weeklyLoss))}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="grid gap-6 xl:grid-cols-2"
            >
              <ChartCard title={t.projectedWeightLoss}>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={timeline} margin={{ left: -16, right: 10, top: 10 }}>
                    <defs>
                      <linearGradient id="weightFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.42} />
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />
                    <XAxis dataKey="week" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} domain={["dataMin", "dataMax"]} />
                    <Tooltip content={<ChartTooltip suffix="kg" weekLabel={t.week} />} />
                    <Area
                      type="monotone"
                      dataKey="weight"
                      stroke="#14b8a6"
                      strokeWidth={3}
                      fill="url(#weightFill)"
                      isAnimationActive
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title={t.bodyFatReduction}>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={timeline} margin={{ left: -16, right: 10, top: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />
                    <XAxis dataKey="week" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} domain={["dataMin", "dataMax"]} />
                    <Tooltip content={<ChartTooltip suffix="%" weekLabel={t.week} />} />
                    <Line
                      type="monotone"
                      dataKey="bodyFat"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={false}
                      isAnimationActive
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
}

function NumberField({
  label,
  suffix,
  value,
  min,
  max,
  onChange
}: {
  label: string;
  suffix: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <div className="relative">
        <Input
          id={label}
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="pr-12"
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
          {suffix}
        </span>
      </div>
    </div>
  );
}

function BodyFatSlider({
  label,
  gender,
  value,
  onChange
}: {
  label: string;
  gender: Gender;
  value: number;
  onChange: (value: number) => void;
}) {
  const range = bodyFatRanges[gender];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label>{label}</Label>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="metric-tabular rounded-full bg-primary/12 px-3 py-1 text-sm font-black text-primary"
        >
          {value}%
        </motion.span>
      </div>
      <Slider
        min={range.min}
        max={range.max}
        step={1}
        value={[value]}
        aria-label={label}
        onValueChange={([next]) => onChange(next)}
      />
      <div className="flex justify-between text-xs font-semibold text-muted-foreground">
        <span>{range.min}%</span>
        <span>{range.max}%</span>
      </div>
    </div>
  );
}

function VelocitySlider({
  label,
  hint,
  value,
  onChange
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-3 rounded-[1.5rem] bg-secondary/45 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Label>{label}</Label>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">{hint}</p>
        </div>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="metric-tabular rounded-full bg-accent/16 px-3 py-1 text-sm font-black text-accent"
        >
          {(value * 1000).toFixed(0)}g
        </motion.span>
      </div>
      <Slider
        min={0.2}
        max={1}
        step={0.1}
        value={[value]}
        aria-label={label}
        onValueChange={([next]) => onChange(Number(next.toFixed(1)))}
      />
      <div className="flex justify-between text-xs font-semibold text-muted-foreground">
        <span>200g</span>
        <span>1kg</span>
      </div>
    </div>
  );
}

function BodyImage({
  imageSrc,
  imageKey,
  displayValue,
  label,
  altText
}: {
  imageSrc: string;
  imageKey: string;
  displayValue: string;
  label: string;
  altText: string;
}) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-secondary/70 to-background/45">
      <AnimatePresence mode="wait">
        <motion.div
          key={imageKey}
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.015 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={imageSrc}
            alt={altText}
            fill
            sizes="(max-width: 768px) 80vw, 320px"
            className="object-contain p-4"
            priority
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-4 left-4 rounded-full bg-background/80 px-3 py-1 text-sm font-black shadow-glass backdrop-blur">
        {displayValue}
      </div>
    </div>
  );
}

function InfoDialog({
  info,
  closeLabel,
  onClose
}: {
  info: { title: string; lines: string[] } | null;
  closeLabel: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {info ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="presentation"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="metric-info-title"
            className="glass w-full max-w-lg rounded-[1.5rem] p-5 shadow-glass sm:p-6"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Info className="h-5 w-5" />
                </div>
                <h2 id="metric-info-title" className="text-xl font-black tracking-normal">
                  {info.title}
                </h2>
              </div>
              <button
                type="button"
                aria-label={closeLabel}
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {info.lines.map((line) => (
                <p key={line} className="text-sm leading-6 text-muted-foreground">
                  {line}
                </p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  infoLabel,
  onInfo
}: {
  icon: typeof Flame;
  label: string;
  value: string;
  infoLabel: string;
  onInfo: () => void;
}) {
  return (
    <motion.div variants={item}>
      <Card className="glass h-full relative">
        <button
          type="button"
          aria-label={`${infoLabel}: ${label}`}
          onClick={onInfo}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Info className="h-4 w-4" />
        </button>
        <CardContent className="p-5">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-muted-foreground">{label}</p>
          <motion.p
            key={value}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="metric-tabular mt-1 text-2xl font-black tracking-normal"
          >
            {value}
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TransformationPanel({
  title,
  imageSrc,
  imageKey,
  percent,
  weight,
  altText
}: {
  title: string;
  imageSrc: string;
  imageKey: string;
  percent: number;
  weight: number;
  altText: string;
}) {
  return (
    <div className="rounded-[1.5rem] bg-secondary/50 p-4">
      <BodyImage
        imageSrc={imageSrc}
        imageKey={imageKey}
        displayValue={`${percent}%`}
        label={title}
        altText={altText}
      />
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-muted-foreground">{title}</p>
          <p className="text-2xl font-black">{percent}%</p>
        </div>
        <p className="metric-tabular rounded-full bg-background/75 px-3 py-1 text-sm font-black">
          {formatKg(weight)}
        </p>
      </div>
    </div>
  );
}

function MacroBar({
  label,
  value,
  color
}: {
  label: string;
  value: number;
  color: string;
}) {
  const width = Math.min(100, Math.max(12, value / 2.2));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-bold">
        <span>{label}</span>
        <span className="metric-tabular">{value}g</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
  suffix,
  weekLabel
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
  suffix: string;
  weekLabel: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border bg-card/95 px-4 py-3 text-sm shadow-glass backdrop-blur">
      <p className="font-bold">
        {weekLabel} {label}
      </p>
      <p className="metric-tabular text-muted-foreground">
        {payload[0].value} {suffix}
      </p>
    </div>
  );
}
