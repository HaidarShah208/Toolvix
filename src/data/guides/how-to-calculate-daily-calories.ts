import type { GuideContent } from "@/types";

const guide: GuideContent = {
  directAnswer:
    "To estimate daily calorie needs, calculate your basal metabolic rate (BMR) with the Mifflin–St Jeor equation, then multiply it by an activity factor between 1.2 and 1.9 to get your total daily energy expenditure (TDEE). A 30-year-old man weighing 80 kg at 180 cm has a BMR of 1,780 kcal, or about 2,759 kcal a day at a moderate activity level.",
  intro:
    "Your body burns energy all day, even at rest, and more when you move. Calorie calculators estimate that total in two stages: first the energy your body needs to keep running, then an adjustment for how active you are. The result is a reasonable starting point, but it is an estimate with real margins of error, and it works best when you adjust it based on what actually happens over a few weeks.",
  steps: [
    "Measure your weight in kilograms and height in centimeters. To convert, divide pounds by 2.2046 and multiply inches by 2.54.",
    "Calculate BMR with the Mifflin–St Jeor equation: 10 × weight + 6.25 × height − 5 × age, then add 5 for men or subtract 161 for women.",
    "Choose the activity factor that honestly matches a typical week, including your job, not just your workouts.",
    "Multiply BMR by the activity factor to estimate TDEE, the calories you would need to maintain your current weight.",
    "If you want to lose or gain weight, adjust from TDEE by a modest amount, and review the result after two to four weeks.",
  ],
  formulas: [
    {
      label: "Mifflin–St Jeor BMR (men)",
      expression: "BMR = 10W + 6.25H − 5A + 5",
      variables: [
        { symbol: "W", meaning: "weight in kilograms" },
        { symbol: "H", meaning: "height in centimeters" },
        { symbol: "A", meaning: "age in years" },
      ],
    },
    {
      label: "Mifflin–St Jeor BMR (women)",
      expression: "BMR = 10W + 6.25H − 5A − 161",
    },
    {
      label: "Total daily energy expenditure",
      expression: "TDEE = BMR × activity factor",
      variables: [
        { symbol: "1.2", meaning: "sedentary: desk job, little or no exercise" },
        { symbol: "1.375", meaning: "lightly active: light exercise 1–3 days a week" },
        { symbol: "1.55", meaning: "moderately active: exercise 3–5 days a week" },
        { symbol: "1.725", meaning: "very active: hard exercise 6–7 days a week" },
        { symbol: "1.9", meaning: "extra active: physical job plus hard training" },
      ],
    },
  ],
  examples: [
    {
      title: "Man, 30 years, 80 kg, 180 cm, moderately active",
      steps: [
        "10 × 80 = 800",
        "6.25 × 180 = 1,125",
        "5 × 30 = 150",
        "BMR = 800 + 1,125 − 150 + 5 = 1,780 kcal",
        "TDEE = 1,780 × 1.55 = 2,759 kcal",
      ],
      result: "Estimated maintenance intake is about 2,760 kcal a day. A 500 kcal deficit would put the target near 2,260 kcal.",
    },
    {
      title: "Woman, 45 years, 68 kg, 165 cm, lightly active",
      steps: [
        "10 × 68 = 680",
        "6.25 × 165 = 1,031.25",
        "5 × 45 = 225",
        "BMR = 680 + 1,031.25 − 225 − 161 = 1,325.25 kcal",
        "TDEE = 1,325.25 × 1.375 ≈ 1,822 kcal",
      ],
      result: "Estimated maintenance is about 1,820 kcal a day. If she were sedentary, it would be about 1,590 kcal.",
    },
    {
      title: "How the target shifts after losing 5 kg",
      steps: [
        "Same man as the first example, now 75 kg",
        "BMR = 750 + 1,125 − 150 + 5 = 1,730 kcal",
        "TDEE = 1,730 × 1.55 ≈ 2,682 kcal",
        "Change: 2,759 − 2,682 ≈ 77 kcal a day",
      ],
      result: "Maintenance needs fall as weight falls, so a fixed intake produces a smaller deficit over time.",
    },
  ],
  sections: [
    {
      heading: "What is the difference between BMR and TDEE?",
      paragraphs: [
        "BMR is the energy your body uses at complete rest to breathe, circulate blood, maintain body temperature and keep organs working. For most people it is the largest share of daily energy use.",
        "TDEE adds everything else: the energy used to digest food, deliberate exercise, and all the non-exercise movement of a normal day, such as walking, standing and fidgeting. That last category varies a lot between people and is one reason two people with the same BMR can need quite different amounts of food.",
      ],
    },
    {
      heading: "Why Mifflin–St Jeor?",
      paragraphs: [
        "Published in 1990, the Mifflin–St Jeor equation has generally performed better than the older Harris–Benedict equation when compared with measured metabolic rates in adults, and many dietitians use it as a default. It is still an estimate: for an individual, the prediction can be off by 10% or more.",
        "If you know your body fat percentage reasonably well, the Katch–McArdle equation, which is based on lean body mass, can suit very muscular people better. For people with obesity, older adults and some medical conditions, all of these equations become less reliable.",
      ],
    },
    {
      heading: "How accurate is the 500-calorie rule?",
      paragraphs: [
        "A common guideline says eating 500 kcal below maintenance each day loses about 0.45 kg (1 lb) a week, based on an estimate of roughly 3,500 kcal per pound of body fat. It is a reasonable rough starting point, but it overstates long-term loss.",
        "As you lose weight, your BMR and the energy cost of moving fall, as the third example shows. The body can also adapt by reducing spontaneous activity. Early weight loss often includes water, which makes the first weeks look faster than what follows. Expect progress to slow, and recalculate your needs every few kilograms.",
      ],
    },
    {
      heading: "How low is too low?",
      paragraphs: [
        "Very large deficits make it hard to get enough protein, vitamins and minerals, and can lead to muscle loss, fatigue and a greater chance of regaining weight. Commonly cited guidance suggests not going below about 1,200 kcal a day for women or 1,500 kcal for men without medical supervision, although the right floor depends on the person.",
        "Anyone who is pregnant or breastfeeding, under 18, managing diabetes or another medical condition, or has a history of disordered eating should set calorie targets with a doctor or registered dietitian rather than a formula.",
      ],
    },
    {
      heading: "How should you pick an activity level?",
      list: [
        "Start with your job. A desk job with a gym session three times a week is often closer to lightly active than moderately active.",
        "Most people overestimate activity. If unsure, choose the lower level and adjust if you lose weight faster than expected.",
        "Do not add exercise calories from a fitness tracker on top of an activity factor; that counts the same activity twice.",
        "Judge by results: if your weight is stable over three or four weeks, your intake is close to your real TDEE.",
      ],
    },
  ],
  faqs: [
    {
      question: "How many calories should I eat to lose weight?",
      answer:
        "A moderate deficit of roughly 300 to 500 kcal below your estimated TDEE is a common starting point. Track your weight trend for a few weeks and adjust, rather than cutting further straight away.",
    },
    {
      question: "Do I need to eat back the calories I burn exercising?",
      answer:
        "If you used an activity factor, your exercise is already included. If you used the sedentary factor, adding some exercise calories back is reasonable, but tracker estimates are often high.",
    },
    {
      question: "Why does age reduce the BMR estimate?",
      answer:
        "Metabolic rate tends to decline with age, partly because people typically lose muscle. The equation reflects that by subtracting 5 kcal for each year of age.",
    },
    {
      question: "How many calories do I need to gain muscle?",
      answer:
        "A small surplus, often around 200 to 300 kcal above maintenance, combined with resistance training and enough protein, is a common approach. Larger surpluses tend to add more fat.",
    },
    {
      question: "Is BMR the minimum I should eat?",
      answer:
        "BMR is not a hard floor, but eating well below it for long periods is rarely advisable without medical supervision. It is a useful reference point when judging whether a target is too aggressive.",
    },
  ],
  disclaimer:
    "Calorie equations give estimates for healthy adults and can be significantly off for individuals. This guide is general information, not medical or nutritional advice. If you are pregnant, have a medical condition, take medication that affects weight, or plan a major change in diet, consult a doctor or registered dietitian.",
};

export default guide;
