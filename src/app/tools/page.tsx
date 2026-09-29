import { CategoryPage, type CategoryPageCopy } from "@/components/tools/category-page";
import { buildMetadata } from "@/lib/seo/metadata";

const copy: CategoryPageCopy = {
  title: "Free Online Tools – Text, Image, Converter & Developer Tools",
  description:
    "Free browser-based tools: QR code generator, word counter, password generator, unit and time zone converters, image resizer, JSON formatter and more.",
  h1: "Free Online Tools",
  intro: [
    "Small, focused utilities for jobs you'd otherwise open a heavy app for: counting words, converting units, resizing a photo, formatting JSON or generating a secure password.",
    "The tools process your text, images and settings locally in your browser. Nothing is uploaded, which makes them fast and keeps your data on your device.",
  ],
  guideSlugs: ["how-to-create-a-strong-password", "how-to-convert-celsius-to-fahrenheit", "how-to-calculate-percentage"],
  faqs: [
    {
      question: "Are my files uploaded when I resize or compress an image?",
      answer:
        "No. The image tools use your browser's built-in canvas to process files on your device. The image never leaves your computer or phone.",
    },
    {
      question: "Is it safe to generate passwords here?",
      answer:
        "The password generator uses your browser's cryptographic random number generator and runs entirely on your device. Passwords are not sent anywhere or stored.",
    },
    {
      question: "Do the tools work offline?",
      answer:
        "The tools do their work without contacting a server, so most keep working if your connection drops after the page has loaded. You need a connection to open a page in the first place.",
    },
    {
      question: "Is there a limit on how much text or how many files I can process?",
      answer:
        "There are no usage limits. Very large inputs are limited only by your device's memory; the image tools accept files up to 50 MB.",
    },
    {
      question: "Can I suggest a new tool?",
      answer: "Yes. Use the contact page to tell us what you need, and we'll consider it for a future update.",
    },
  ],
};

export const metadata = buildMetadata({ title: copy.title, description: copy.description, path: "/tools" });

export default function ToolsPage() {
  return <CategoryPage category="tools" copy={copy} />;
}
