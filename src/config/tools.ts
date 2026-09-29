import type { Tool, ToolCategory, ToolGroup } from "@/types";

const U = "2026-09-29";

/**
 * Single source of truth for every tool on the site. Navigation, category
 * pages, search, related links, metadata and the sitemap all read from here.
 * To add a tool: add an entry, its widget in `components/tools/widgets.tsx`
 * and its page content in `data/content`.
 */
export const tools: Tool[] = [
  // ───────────────────────── Calculators ─────────────────────────
  {
    id: "age-calculator",
    name: "Age Calculator",
    slug: "age-calculator",
    category: "calculators",
    group: "date-time",
    description: "Find your exact age in years, months and days from your date of birth.",
    icon: "cake",
    keywords: ["age", "birthday", "date of birth", "how old am i", "dob", "years old"],
    relatedTools: ["date-difference-calculator", "time-calculator", "time-zone-converter"],
    relatedGuides: ["how-to-calculate-age"],
    seoTitle: "Age Calculator – Calculate Your Exact Age",
    seoDescription:
      "Calculate your exact age in years, months and days from your date of birth, plus total days lived and a countdown to your next birthday.",
    popular: true,
    updated: U,
  },
  {
    id: "percentage-calculator",
    name: "Percentage Calculator",
    slug: "percentage-calculator",
    category: "calculators",
    group: "math",
    description: "Work out X% of Y, what percent one number is of another, and percentage change.",
    icon: "percent",
    keywords: ["percent", "percentage", "percentage increase", "percentage decrease", "percent change", "% of"],
    relatedTools: ["discount-calculator", "average-calculator", "ratio-calculator", "tip-calculator"],
    relatedGuides: ["how-to-calculate-percentage", "how-to-calculate-discount"],
    seoTitle: "Percentage Calculator – Calculate Percentages Easily",
    seoDescription:
      "Calculate percentages, percentage increases, decreases, and more with this free online percentage calculator. Shows the formula for every answer.",
    popular: true,
    updated: U,
  },
  {
    id: "gpa-calculator",
    name: "GPA Calculator",
    slug: "gpa-calculator",
    category: "calculators",
    group: "education",
    description: "Calculate your semester GPA from course credits and letter grades.",
    icon: "graduation-cap",
    keywords: ["gpa", "grade point average", "semester gpa", "college gpa", "credits", "grades"],
    relatedTools: ["cgpa-calculator", "average-calculator", "percentage-calculator"],
    relatedGuides: ["how-to-calculate-gpa", "how-to-calculate-cgpa"],
    seoTitle: "GPA Calculator – Calculate Your Semester GPA",
    seoDescription:
      "Calculate your GPA from credit hours and letter grades on a 4.0 or 4.3 scale. Add as many courses as you need and see your quality points.",
    popular: true,
    updated: U,
  },
  {
    id: "cgpa-calculator",
    name: "CGPA Calculator",
    slug: "cgpa-calculator",
    category: "calculators",
    group: "education",
    description: "Combine several semester GPAs into a credit-weighted cumulative GPA.",
    icon: "school",
    keywords: ["cgpa", "cumulative gpa", "overall gpa", "semester", "weighted gpa"],
    relatedTools: ["gpa-calculator", "average-calculator", "percentage-calculator"],
    relatedGuides: ["how-to-calculate-cgpa", "how-to-calculate-gpa"],
    seoTitle: "CGPA Calculator – Calculate Cumulative GPA by Semester",
    seoDescription:
      "Calculate your cumulative GPA (CGPA) from each semester's GPA and credits. Weighted by credit hours and works with 4, 5 or 10-point scales.",
    updated: U,
  },
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    slug: "bmi-calculator",
    category: "calculators",
    group: "health",
    description: "Calculate body mass index from height and weight in metric or imperial units.",
    icon: "heart-pulse",
    keywords: ["bmi", "body mass index", "healthy weight", "overweight", "weight height"],
    relatedTools: ["calorie-calculator", "weight-converter", "pace-calculator"],
    relatedGuides: ["how-to-calculate-bmi", "how-to-calculate-daily-calories"],
    seoTitle: "BMI Calculator – Calculate BMI Online",
    seoDescription:
      "Calculate your body mass index in kg/cm or lb/ft, see your adult BMI category and the healthy weight range for your height.",
    popular: true,
    updated: U,
  },
  {
    id: "loan-calculator",
    name: "Loan Calculator",
    slug: "loan-calculator",
    category: "calculators",
    group: "finance",
    description: "Estimate loan payments, total interest and an amortization schedule.",
    icon: "landmark",
    keywords: ["loan", "emi", "mortgage", "monthly payment", "amortization", "car loan", "personal loan"],
    relatedTools: ["simple-interest-calculator", "compound-interest-calculator", "salary-calculator"],
    relatedGuides: ["how-to-calculate-loan-payment", "how-to-calculate-simple-interest"],
    seoTitle: "Loan Calculator – Estimate Monthly Payments & Interest",
    seoDescription:
      "Estimate your loan payment, total interest and total repayment for monthly, bi-weekly or weekly payments, with a full amortization schedule.",
    popular: true,
    updated: U,
  },
  {
    id: "salary-calculator",
    name: "Salary Calculator",
    slug: "salary-calculator",
    category: "calculators",
    group: "finance",
    description: "Convert pay between hourly, daily, weekly, monthly and annual amounts.",
    icon: "wallet",
    keywords: ["salary", "hourly to salary", "annual salary", "monthly salary", "wage", "pay converter"],
    relatedTools: ["loan-calculator", "percentage-calculator", "time-calculator"],
    relatedGuides: ["how-to-calculate-percentage"],
    seoTitle: "Salary Calculator – Convert Hourly, Monthly & Annual Pay",
    seoDescription:
      "Convert gross pay between hourly, daily, weekly, bi-weekly, monthly and annual salary using your own working hours and weeks per year.",
    updated: U,
  },
  {
    id: "discount-calculator",
    name: "Discount Calculator",
    slug: "discount-calculator",
    category: "calculators",
    group: "finance",
    description: "Find the sale price and savings after one or two discounts, with optional tax.",
    icon: "tag",
    keywords: ["discount", "sale price", "percent off", "savings", "coupon", "markdown"],
    relatedTools: ["percentage-calculator", "tip-calculator", "salary-calculator"],
    relatedGuides: ["how-to-calculate-discount", "how-to-calculate-percentage"],
    seoTitle: "Discount Calculator – Find the Sale Price & Savings",
    seoDescription:
      "Calculate the final price after a percentage or fixed discount, stack a second discount, add sales tax and see exactly how much you save.",
    updated: U,
  },
  {
    id: "tip-calculator",
    name: "Tip Calculator",
    slug: "tip-calculator",
    category: "calculators",
    group: "finance",
    description: "Work out the tip, total bill and each person's share when splitting.",
    icon: "hand-coins",
    keywords: ["tip", "gratuity", "split bill", "restaurant", "per person"],
    relatedTools: ["discount-calculator", "percentage-calculator", "average-calculator"],
    relatedGuides: ["how-to-calculate-percentage"],
    seoTitle: "Tip Calculator – Calculate Tips & Split the Bill",
    seoDescription:
      "Calculate the tip and total for any bill, split it between any number of people and optionally round each share up.",
    updated: U,
  },
  {
    id: "simple-interest-calculator",
    name: "Simple Interest Calculator",
    slug: "simple-interest-calculator",
    category: "calculators",
    group: "finance",
    description: "Calculate simple interest and the final amount for any principal, rate and time.",
    icon: "piggy-bank",
    keywords: ["simple interest", "interest", "principal", "rate", "prt"],
    relatedTools: ["compound-interest-calculator", "loan-calculator", "percentage-calculator"],
    relatedGuides: ["how-to-calculate-simple-interest", "how-to-calculate-compound-interest"],
    seoTitle: "Simple Interest Calculator – Calculate Interest (I = PRT)",
    seoDescription:
      "Calculate simple interest and the total amount using I = P × R × T, with time in years, months or days and a year-by-year breakdown.",
    updated: U,
  },
  {
    id: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    slug: "compound-interest-calculator",
    category: "calculators",
    group: "finance",
    description: "See how savings grow with compounding and optional monthly contributions.",
    icon: "trending-up",
    keywords: ["compound interest", "savings", "investment growth", "apy", "compounding"],
    relatedTools: ["simple-interest-calculator", "loan-calculator", "salary-calculator"],
    relatedGuides: ["how-to-calculate-compound-interest", "how-to-calculate-simple-interest"],
    seoTitle: "Compound Interest Calculator – See How Savings Grow",
    seoDescription:
      "Calculate compound interest with daily, monthly, quarterly, yearly or continuous compounding and optional monthly contributions.",
    popular: true,
    updated: U,
  },
  {
    id: "average-calculator",
    name: "Average Calculator",
    slug: "average-calculator",
    category: "calculators",
    group: "math",
    description: "Find the mean, median, mode and range of a list of numbers.",
    icon: "sigma",
    keywords: ["average", "mean", "median", "mode", "range", "statistics"],
    relatedTools: ["percentage-calculator", "gpa-calculator", "ratio-calculator"],
    relatedGuides: ["how-to-calculate-percentage", "how-to-calculate-gpa"],
    seoTitle: "Average Calculator – Mean, Median, Mode & Range",
    seoDescription:
      "Paste a list of numbers to calculate the mean, median, mode, range, sum and more. Works with decimals and negative numbers.",
    updated: U,
  },
  {
    id: "ratio-calculator",
    name: "Ratio Calculator",
    slug: "ratio-calculator",
    category: "calculators",
    group: "math",
    description: "Simplify ratios, solve proportions and split a total by a ratio.",
    icon: "scale",
    keywords: ["ratio", "proportion", "simplify ratio", "aspect ratio", "a:b"],
    relatedTools: ["fraction-calculator", "percentage-calculator", "image-resizer"],
    relatedGuides: ["how-to-calculate-percentage"],
    seoTitle: "Ratio Calculator – Simplify Ratios & Solve Proportions",
    seoDescription:
      "Simplify a ratio to its lowest terms, find the missing value in a proportion, or divide an amount in a given ratio.",
    updated: U,
  },
  {
    id: "fraction-calculator",
    name: "Fraction Calculator",
    slug: "fraction-calculator",
    category: "calculators",
    group: "math",
    description: "Add, subtract, multiply, divide and simplify fractions.",
    icon: "divide",
    keywords: ["fraction", "add fractions", "simplify fraction", "mixed number", "numerator", "denominator"],
    relatedTools: ["ratio-calculator", "percentage-calculator", "average-calculator"],
    relatedGuides: ["how-to-calculate-percentage"],
    seoTitle: "Fraction Calculator – Add, Subtract & Simplify Fractions",
    seoDescription:
      "Add, subtract, multiply and divide fractions and get the simplified answer as a fraction, mixed number and decimal.",
    updated: U,
  },
  {
    id: "date-difference-calculator",
    name: "Date Difference Calculator",
    slug: "date-difference-calculator",
    category: "calculators",
    group: "date-time",
    description: "Count the days, weeks, months and working days between two dates.",
    icon: "calendar-range",
    keywords: ["days between dates", "date difference", "date duration", "business days", "add days to date"],
    relatedTools: ["age-calculator", "time-calculator", "time-zone-converter"],
    relatedGuides: ["how-to-calculate-age"],
    seoTitle: "Date Difference Calculator – Days Between Two Dates",
    seoDescription:
      "Count the days, weeks, months and weekdays between two dates, or add and subtract days from a date.",
    updated: U,
  },
  {
    id: "time-calculator",
    name: "Time Calculator",
    slug: "time-calculator",
    category: "calculators",
    group: "date-time",
    description: "Add or subtract hours, minutes and seconds, or find the time between two clock times.",
    icon: "clock",
    keywords: ["time", "hours", "minutes", "add time", "time duration", "hours between times"],
    relatedTools: ["date-difference-calculator", "age-calculator", "pace-calculator"],
    relatedGuides: ["how-to-calculate-age"],
    seoTitle: "Time Calculator – Add, Subtract & Measure Time",
    seoDescription:
      "Add and subtract hours, minutes and seconds, or calculate the duration between two times of day, including overnight shifts.",
    updated: U,
  },
  {
    id: "calorie-calculator",
    name: "Calorie Calculator",
    slug: "calorie-calculator",
    category: "calculators",
    group: "health",
    description: "Estimate your BMR and daily calorie needs for your activity level.",
    icon: "flame",
    keywords: ["calories", "tdee", "bmr", "maintenance calories", "weight loss calories"],
    relatedTools: ["bmi-calculator", "pace-calculator", "weight-converter"],
    relatedGuides: ["how-to-calculate-daily-calories", "how-to-calculate-bmi"],
    seoTitle: "Calorie Calculator – Estimate Daily Calorie Needs (TDEE)",
    seoDescription:
      "Estimate your basal metabolic rate and daily calories to maintain, lose or gain weight using the Mifflin–St Jeor equation.",
    updated: U,
  },
  {
    id: "pace-calculator",
    name: "Pace Calculator",
    slug: "pace-calculator",
    category: "calculators",
    group: "health",
    description: "Calculate running pace, finish time or distance in km or miles.",
    icon: "footprints",
    keywords: ["pace", "running pace", "min per km", "min per mile", "marathon pace", "5k time"],
    relatedTools: ["time-calculator", "calorie-calculator", "length-converter"],
    relatedGuides: ["how-to-calculate-daily-calories"],
    seoTitle: "Pace Calculator – Running Pace, Time & Distance",
    seoDescription:
      "Calculate your running or walking pace per km or mile, predict a finish time, or find the distance covered. Includes 5K to marathon presets.",
    updated: U,
  },

  // ───────────────────────── Utility tools ─────────────────────────
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    slug: "qr-code-generator",
    category: "tools",
    group: "generators",
    description: "Create downloadable QR codes for links, text, email addresses and phone numbers.",
    icon: "qr-code",
    keywords: ["qr", "qr code", "barcode", "url to qr", "qr maker"],
    relatedTools: ["password-generator", "uuid-generator", "color-converter"],
    relatedGuides: ["how-to-create-a-strong-password"],
    seoTitle: "QR Code Generator – Create QR Codes Free",
    seoDescription:
      "Create QR codes for URLs, text, email and phone numbers. Choose colors, size and error correction, then download as PNG or SVG.",
    popular: true,
    updated: U,
  },
  {
    id: "word-counter",
    name: "Word Counter",
    slug: "word-counter",
    category: "tools",
    group: "text",
    description: "Count words, characters, sentences and paragraphs, with reading time.",
    icon: "file-text",
    keywords: ["word count", "words", "essay length", "reading time", "count words"],
    relatedTools: ["character-counter", "case-converter", "text-cleaner", "lorem-ipsum-generator"],
    relatedGuides: [],
    seoTitle: "Word Counter – Count Words & Characters Online",
    seoDescription:
      "Count words, characters, sentences and paragraphs as you type, and see estimated reading and speaking time for your text.",
    popular: true,
    updated: U,
  },
  {
    id: "character-counter",
    name: "Character Counter",
    slug: "character-counter",
    category: "tools",
    group: "text",
    description: "Count characters with and without spaces, and check common length limits.",
    icon: "type",
    keywords: ["character count", "letter count", "characters", "tweet length", "meta description length"],
    relatedTools: ["word-counter", "text-cleaner", "case-converter"],
    relatedGuides: [],
    seoTitle: "Character Counter – Count Characters & Letters",
    seoDescription:
      "Count characters with and without spaces, letters, digits and bytes, and check your text against limits for posts, SMS and meta tags.",
    updated: U,
  },
  {
    id: "case-converter",
    name: "Case Converter",
    slug: "case-converter",
    category: "tools",
    group: "text",
    description: "Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case and more.",
    icon: "case-sensitive",
    keywords: ["case converter", "uppercase", "lowercase", "title case", "camelcase", "snake case"],
    relatedTools: ["text-cleaner", "word-counter", "text-reverser"],
    relatedGuides: [],
    seoTitle: "Case Converter – Change Text to Upper, Lower & Title Case",
    seoDescription:
      "Convert text between uppercase, lowercase, sentence case, title case, camelCase, PascalCase, snake_case and kebab-case instantly.",
    updated: U,
  },
  {
    id: "password-generator",
    name: "Password Generator",
    slug: "password-generator",
    category: "tools",
    group: "generators",
    description: "Generate strong random passwords in your browser with the options you choose.",
    icon: "key-round",
    keywords: ["password", "random password", "strong password", "secure password", "passphrase"],
    relatedTools: ["uuid-generator", "random-number-generator", "qr-code-generator"],
    relatedGuides: ["how-to-create-a-strong-password"],
    seoTitle: "Password Generator – Create Strong Random Passwords",
    seoDescription:
      "Generate strong, random passwords using your browser's cryptographic random generator. Choose length and character types. Nothing is sent to a server.",
    popular: true,
    updated: U,
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    slug: "unit-converter",
    category: "tools",
    group: "converters",
    description: "Convert length, weight, temperature, area, volume, speed, time and data units.",
    icon: "arrow-left-right",
    keywords: ["unit converter", "convert units", "metric", "imperial", "conversion"],
    relatedTools: ["length-converter", "weight-converter", "temperature-converter"],
    relatedGuides: ["how-to-convert-celsius-to-fahrenheit"],
    seoTitle: "Unit Converter – Convert Length, Weight, Volume & More",
    seoDescription:
      "Convert between metric and imperial units for length, weight, temperature, area, volume, speed, time and digital storage.",
    popular: true,
    updated: U,
  },
  {
    id: "length-converter",
    name: "Length Converter",
    slug: "length-converter",
    category: "tools",
    group: "converters",
    description: "Convert between meters, feet, inches, miles, kilometers and more.",
    icon: "ruler",
    keywords: ["length", "cm to inches", "feet to meters", "km to miles", "distance"],
    relatedTools: ["unit-converter", "weight-converter", "pace-calculator"],
    relatedGuides: [],
    seoTitle: "Length Converter – cm, Inches, Feet, Meters & Miles",
    seoDescription:
      "Convert length and distance between millimeters, centimeters, meters, kilometers, inches, feet, yards, miles and nautical miles.",
    updated: U,
  },
  {
    id: "weight-converter",
    name: "Weight Converter",
    slug: "weight-converter",
    category: "tools",
    group: "converters",
    description: "Convert between kilograms, pounds, ounces, stones and grams.",
    icon: "weight",
    keywords: ["weight", "kg to lbs", "pounds to kg", "grams to ounces", "stone", "mass"],
    relatedTools: ["unit-converter", "length-converter", "bmi-calculator"],
    relatedGuides: ["how-to-calculate-bmi"],
    seoTitle: "Weight Converter – kg to lbs, Grams, Ounces & Stone",
    seoDescription:
      "Convert weight and mass between kilograms, grams, milligrams, pounds, ounces, stone and metric or US tons.",
    updated: U,
  },
  {
    id: "temperature-converter",
    name: "Temperature Converter",
    slug: "temperature-converter",
    category: "tools",
    group: "converters",
    description: "Convert between Celsius, Fahrenheit, Kelvin and Rankine.",
    icon: "thermometer",
    keywords: ["temperature", "celsius to fahrenheit", "fahrenheit to celsius", "kelvin"],
    relatedTools: ["unit-converter", "length-converter", "weight-converter"],
    relatedGuides: ["how-to-convert-celsius-to-fahrenheit"],
    seoTitle: "Temperature Converter – Celsius, Fahrenheit & Kelvin",
    seoDescription:
      "Convert temperatures between Celsius, Fahrenheit, Kelvin and Rankine instantly, with the formula for each conversion.",
    updated: U,
  },
  {
    id: "time-zone-converter",
    name: "Time Zone Converter",
    slug: "time-zone-converter",
    category: "tools",
    group: "converters",
    description: "Convert a date and time between time zones, with daylight saving handled.",
    icon: "globe",
    keywords: ["time zone", "timezone converter", "utc", "gmt", "est to ist", "meeting planner"],
    relatedTools: ["time-calculator", "date-difference-calculator", "unit-converter"],
    relatedGuides: [],
    seoTitle: "Time Zone Converter – Convert Times Between Cities",
    seoDescription:
      "Convert a date and time from one time zone to several others. Uses the IANA time zone database built into your browser, including daylight saving.",
    updated: U,
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    slug: "image-resizer",
    category: "tools",
    group: "image",
    description: "Resize images to exact pixel dimensions or a percentage, right in your browser.",
    icon: "scaling",
    keywords: ["resize image", "image size", "photo resizer", "change dimensions", "scale image"],
    relatedTools: ["image-compressor", "ratio-calculator", "color-converter"],
    relatedGuides: [],
    seoTitle: "Image Resizer – Resize Photos Online Without Uploading",
    seoDescription:
      "Resize JPG, PNG and WebP images by pixels or percentage while keeping the aspect ratio. Images are processed in your browser and never uploaded.",
    updated: U,
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    slug: "image-compressor",
    category: "tools",
    group: "image",
    description: "Reduce image file size with adjustable quality, processed locally.",
    icon: "image-down",
    keywords: ["compress image", "reduce image size", "optimize image", "jpg compressor", "webp"],
    relatedTools: ["image-resizer", "qr-code-generator", "color-converter"],
    relatedGuides: [],
    seoTitle: "Image Compressor – Reduce Image File Size Online",
    seoDescription:
      "Compress JPG, PNG and WebP images by adjusting quality and maximum size, and compare file sizes before downloading. Runs entirely in your browser.",
    updated: U,
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    slug: "json-formatter",
    category: "tools",
    group: "developer",
    description: "Pretty-print, minify and sort JSON with clear error locations.",
    icon: "braces",
    keywords: ["json", "json beautifier", "pretty print json", "minify json", "format json"],
    relatedTools: ["json-validator", "uuid-generator", "text-cleaner"],
    relatedGuides: [],
    seoTitle: "JSON Formatter – Beautify & Minify JSON Online",
    seoDescription:
      "Format, beautify or minify JSON with 2-space, 4-space or tab indentation and optional key sorting. Errors show the exact line and column.",
    updated: U,
  },
  {
    id: "json-validator",
    name: "JSON Validator",
    slug: "json-validator",
    category: "tools",
    group: "developer",
    description: "Check whether JSON is valid and pinpoint syntax errors by line and column.",
    icon: "file-check",
    keywords: ["json validator", "validate json", "json lint", "json checker", "json syntax error"],
    relatedTools: ["json-formatter", "uuid-generator", "text-cleaner"],
    relatedGuides: [],
    seoTitle: "JSON Validator – Check JSON Syntax Online",
    seoDescription:
      "Validate JSON and find syntax errors with the exact line, column and a plain-English explanation. Shows a structure summary for valid JSON.",
    updated: U,
  },
  {
    id: "uuid-generator",
    name: "UUID Generator",
    slug: "uuid-generator",
    category: "tools",
    group: "developer",
    description: "Generate random v4 or time-ordered v7 UUIDs in bulk.",
    icon: "fingerprint",
    keywords: ["uuid", "guid", "uuid v4", "uuid v7", "unique id"],
    relatedTools: ["password-generator", "random-number-generator", "json-formatter"],
    relatedGuides: [],
    seoTitle: "UUID Generator – Generate v4 & v7 UUIDs Online",
    seoDescription:
      "Generate up to 500 random version 4 or time-ordered version 7 UUIDs at once, with uppercase, hyphen and brace formatting options.",
    updated: U,
  },
  {
    id: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    slug: "lorem-ipsum-generator",
    category: "tools",
    group: "generators",
    description: "Generate placeholder text by paragraphs, sentences or words.",
    icon: "pilcrow",
    keywords: ["lorem ipsum", "placeholder text", "dummy text", "filler text"],
    relatedTools: ["word-counter", "case-converter", "text-cleaner"],
    relatedGuides: [],
    seoTitle: "Lorem Ipsum Generator – Placeholder Text for Designs",
    seoDescription:
      "Generate lorem ipsum placeholder text by paragraphs, sentences or words, optionally wrapped in HTML paragraph tags.",
    updated: U,
  },
  {
    id: "random-number-generator",
    name: "Random Number Generator",
    slug: "random-number-generator",
    category: "tools",
    group: "generators",
    description: "Pick random whole or decimal numbers in any range, with or without repeats.",
    icon: "dices",
    keywords: ["random number", "rng", "number picker", "random integer", "dice", "lottery numbers"],
    relatedTools: ["password-generator", "uuid-generator", "average-calculator"],
    relatedGuides: [],
    seoTitle: "Random Number Generator – Pick Numbers in Any Range",
    seoDescription:
      "Generate random integers or decimals between any two numbers, choose how many, and allow or prevent duplicates. Uses cryptographic randomness.",
    updated: U,
  },
  {
    id: "color-converter",
    name: "Color Converter",
    slug: "color-converter",
    category: "tools",
    group: "converters",
    description: "Convert colors between HEX, RGB, HSL, HSV and CMYK, and check contrast.",
    icon: "palette",
    keywords: ["color converter", "hex to rgb", "rgb to hex", "hsl", "cmyk", "contrast ratio"],
    relatedTools: ["qr-code-generator", "image-compressor", "unit-converter"],
    relatedGuides: [],
    seoTitle: "Color Converter – HEX, RGB, HSL, HSV & CMYK",
    seoDescription:
      "Convert any color between HEX, RGB, HSL, HSV and CMYK, pick colors visually and check WCAG contrast against white and black text.",
    updated: U,
  },
  {
    id: "text-reverser",
    name: "Text Reverser",
    slug: "text-reverser",
    category: "tools",
    group: "text",
    description: "Reverse text by characters, words or lines.",
    icon: "undo-2",
    keywords: ["reverse text", "backwards text", "mirror text", "reverse words", "flip text"],
    relatedTools: ["case-converter", "text-cleaner", "word-counter"],
    relatedGuides: [],
    seoTitle: "Text Reverser – Reverse Text, Words or Lines",
    seoDescription:
      "Reverse text character by character, reverse word order, reverse each word or flip the order of lines. Emoji and accents stay intact.",
    updated: U,
  },
  {
    id: "text-cleaner",
    name: "Text Cleaner",
    slug: "text-cleaner",
    category: "tools",
    group: "text",
    description: "Remove extra spaces, blank lines, duplicates, HTML tags and hidden characters.",
    icon: "eraser",
    keywords: ["clean text", "remove extra spaces", "remove line breaks", "strip html", "remove duplicates"],
    relatedTools: ["case-converter", "word-counter", "character-counter"],
    relatedGuides: [],
    seoTitle: "Text Cleaner – Remove Extra Spaces & Line Breaks",
    seoDescription:
      "Clean up pasted text: trim whitespace, remove extra spaces, blank or duplicate lines, line breaks, HTML tags, smart quotes and invisible characters.",
    updated: U,
  },
];

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  shortName: string;
  href: string;
  description: string;
}

export const categories: Record<ToolCategory, CategoryInfo> = {
  calculators: {
    id: "calculators",
    name: "Calculators",
    shortName: "Calculators",
    href: "/calculators",
    description:
      "Maths, finance, health, education and date calculators that show the formula behind every result.",
  },
  tools: {
    id: "tools",
    name: "Everyday Tools",
    shortName: "Tools",
    href: "/tools",
    description:
      "Text, image, developer and conversion utilities that run in your browser, so your data stays on your device.",
  },
};

export const groupLabels: Record<ToolGroup, { name: string; description: string }> = {
  math: { name: "Math", description: "Percentages, averages, ratios and fractions." },
  finance: { name: "Finance", description: "Loans, interest, pay, discounts and tips." },
  health: { name: "Health & Fitness", description: "BMI, calories and running pace." },
  education: { name: "Education", description: "Grade point averages for school and university." },
  "date-time": { name: "Date & Time", description: "Ages, date ranges and time arithmetic." },
  text: { name: "Text", description: "Count, convert, reverse and clean text." },
  converters: { name: "Converters", description: "Units, temperatures, time zones and colors." },
  generators: { name: "Generators", description: "Passwords, QR codes, random numbers and placeholder text." },
  developer: { name: "Developer", description: "JSON formatting, validation and UUIDs." },
  image: { name: "Image", description: "Resize and compress images locally." },
};

export function toolHref(tool: Pick<Tool, "category" | "slug">): string {
  return `/${tool.category}/${tool.slug}`;
}

const toolsById = new Map(tools.map((t) => [t.id, t]));

export function getTool(id: string): Tool | undefined {
  return toolsById.get(id);
}

export function getToolBySlug(category: ToolCategory, slug: string): Tool | undefined {
  const tool = toolsById.get(slug);
  return tool && tool.category === category ? tool : undefined;
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function getPopularTools(category?: ToolCategory): Tool[] {
  return tools.filter((t) => t.popular && (!category || t.category === category));
}

export function getRelatedTools(tool: Tool, limit = 6): Tool[] {
  const explicit = tool.relatedTools
    .map((id) => toolsById.get(id))
    .filter((t): t is Tool => Boolean(t));
  const sameGroup = tools.filter(
    (t) => t.group === tool.group && t.id !== tool.id && !tool.relatedTools.includes(t.id),
  );
  return [...explicit, ...sameGroup].slice(0, limit);
}

/** Groups tools in a category, preserving the order groups first appear. */
export function groupTools(list: Tool[]): { group: ToolGroup; tools: Tool[] }[] {
  const map = new Map<ToolGroup, Tool[]>();
  for (const t of list) {
    const arr = map.get(t.group) ?? [];
    arr.push(t);
    map.set(t.group, arr);
  }
  return [...map.entries()].map(([group, items]) => ({ group, tools: items }));
}
