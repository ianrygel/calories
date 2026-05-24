\# Body Fat \& Calorie Calculator App



\## Goal



Create a premium-looking web application that helps users calculate:



\* current fat mass

\* lean body mass

\* target body weight

\* calories needed to lose fat

\* recommended daily calorie intake

\* estimated timeline



The app should feel like a modern fitness startup product.



\---



\# Tech Stack



Use:



\* Next.js (App Router)

\* React

\* TypeScript

\* Tailwind CSS

\* shadcn/ui

\* Framer Motion

\* Recharts



Deployment target:



\* Vercel



The project must be fully responsive and mobile-first.



\---



\# Main UX Concept



The key feature is a visual body fat selector.



Users should:



\* choose male or female

\* move a slider

\* see a realistic body image changing smoothly based on body fat %



This is the most important feature of the app.



\---



\# Design Style



Style requirements:



\* premium modern UI

\* glassmorphism cards

\* smooth animations

\* dark mode

\* fitness/startup aesthetic

\* clean typography

\* large spacing

\* rounded corners

\* subtle shadows

\* animated transitions



Use smooth Framer Motion animations everywhere.



\---



\# App Layout



\## Section 1 — User Inputs



Inputs:



\### Gender toggle



\* Male

\* Female



\### Numeric inputs



\* Current weight (kg)

\* Age

\* Height



\### Activity level



Dropdown:



\* Sedentary

\* Light activity

\* Moderate activity

\* High activity

\* Athlete



\### Current body fat slider



Range:



\* Male: 8%–35%

\* Female: 18%–45%



\### Target body fat slider



Same UI as above.



\---



\# Visual Body Fat Selector



\## IMPORTANT



Implement realistic body image transitions.



Do NOT use:



\* SVG body generation

\* canvas drawing

\* 3D rendering



Instead:



Use pre-generated realistic images.



Example structure:



/public

/male

8.webp

10.webp

12.webp

15.webp

18.webp

22.webp

25.webp

30.webp



/female

18.webp

20.webp

22.webp

25.webp

28.webp

32.webp

35.webp



\---



\# Body Image Behavior



When the user moves the slider:



\* image changes dynamically

\* transition should animate smoothly

\* use fade animation with Framer Motion

\* transitions should feel premium



Example:



<AnimatePresence mode="wait">

&#x20; <motion.img

&#x20;   key={bodyFat}

&#x20;   initial={{ opacity: 0 }}

&#x20;   animate={{ opacity: 1 }}

&#x20;   exit={{ opacity: 0 }}

&#x20; />

</AnimatePresence>



\---



\# Calculations



\## Example



Current weight:

95 kg



Current body fat:

22%



Target body fat:

10%



\---



\## Calculation formulas



\### Fat mass



fatMass = weight \* bodyFatPercentage



Example:

95 \* 0.22 = 21 kg



\---



\### Lean body mass



leanMass = weight - fatMass



Example:

95 - 21 = 74 kg



\---



\### Target weight



targetWeight = leanMass / (1 - targetBodyFat)



Example:

74 / (1 - 0.10) = 82 kg



\---



\### Weight to lose



weightToLose = currentWeight - targetWeight



Example:

95 - 82 = 13 kg



\---



\### Calories to burn



1 kg fat = 7700 calories



totalCaloriesToBurn = weightToLose \* 7700



Example:

13 \* 7700 = 100100 calories



\---



\### Recommended loss speed



Recommended:

1% body weight per week



weeklyLoss = currentWeight \* 0.01



Example:

95 \* 0.01 = 0.95 kg/week



\---



\### Daily calorie deficit



dailyDeficit =

(weeklyLoss \* 7700) / 7



Example:

1045 calories/day deficit



\---



\### Daily calorie intake



Use estimated maintenance calories based on activity level.



Example:

Maintenance = 2300 kcal



dailyCalories =

maintenance - dailyDeficit



Example:

2300 - 1045 = 1255 kcal/day



\---



\# Results Section



Create beautiful animated cards for:



\* Fat mass

\* Lean body mass

\* Target weight

\* Weight to lose

\* Total calories to burn

\* Recommended deficit

\* Recommended calorie intake

\* Estimated timeline



\---



\# Visual Transformation Section



Show side-by-side transformation:



\[ Current Body ]  --->  \[ Target Body ]



Include:



\* body images

\* body fat %

\* current weight

\* target weight



This section should be visually impressive.



\---



\# Charts



Use Recharts.



Add:



\* projected weekly weight loss chart

\* body fat reduction chart



Use smooth animation.



\---



\# Dark Mode



Add dark/light mode toggle.



Dark mode should look exceptional.



\---



\# Animations



Use Framer Motion heavily for:



\* card entrances

\* number changes

\* slider interactions

\* body image transitions

\* chart appearance

\* hover effects



Animations should feel smooth and premium.



\---



\# Responsiveness



Must work perfectly on:



\* mobile

\* tablet

\* desktop



Mobile UX is extremely important.



\---



\# Accessibility



Ensure:



\* keyboard navigation

\* proper labels

\* contrast ratios

\* accessible sliders



\---



\# Deployment



Prepare project for Vercel deployment.



Include:



\* optimized images

\* fast loading

\* SEO metadata

\* clean project structure



\---



\# Nice Extra Features



If possible, add:



\* timeline estimate in weeks

\* motivational progress UI

\* macro recommendations

\* save/share results

\* animated counters

\* confetti when goal is reached



\---



\# Code Quality



Requirements:



\* clean architecture

\* reusable components

\* TypeScript types

\* modern React patterns

\* no unnecessary complexity

\* production-ready code



Use best practices for:



\* Next.js

\* Tailwind

\* shadcn/ui

\* Framer Motion



\---



\# Final Goal



The app should look like a real premium fitness SaaS product, not a simple calculator.



