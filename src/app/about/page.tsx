import Link from "next/link";
import { StaticPage } from "@/components/layout/static-page";
import { siteConfig } from "@/config/site";
import { getToolsByCategory } from "@/config/tools";
import { buildMetadata } from "@/lib/seo/metadata";

const title = "About Toolvix";
const description = `${siteConfig.name} builds free, privacy-friendly calculators and online tools that explain their results. Learn how we build and check them.`;

export const metadata = buildMetadata({ title, description, path: "/about" });

export default function AboutPage() {
  const calculators = getToolsByCategory("calculators").length;
  const tools = getToolsByCategory("tools").length;
  return (
    <StaticPage
      title={title}
      description={description}
      path="/about"
      schemaType="AboutPage"
      intro={`${siteConfig.name} is a collection of ${calculators} calculators and ${tools} everyday tools for the small jobs that come up at school, at work and at home.`}
    >
      <h2>What we build</h2>
      <p>
        Every tool on {siteConfig.name} does one job: working out a percentage, converting a unit, counting words,
        generating a password, resizing a photo. We keep each page focused on that job, with the tool at the top and a
        clear explanation underneath.
      </p>
      <p>
        We think a calculator should show its working. That’s why the calculators display the formula they use and the
        steps between your inputs and the answer, and why each topic has a <Link href="/guides">guide</Link> that
        explains the method in plain English.
      </p>

      <h2>How we keep results reliable</h2>
      <ul>
        <li>Calculations use standard, published formulas, such as the amortization formula for loans, WHO categories for adult BMI and the Mifflin–St Jeor equation for calorie needs.</li>
        <li>Inputs are validated, so empty, impossible or out-of-range values produce a clear message instead of a misleading number.</li>
        <li>Health and finance tools are labeled as estimates and list the assumptions behind them.</li>
        <li>Conversions use exact defined factors where they exist (for example, 1 inch = 2.54 cm exactly).</li>
      </ul>

      <h2>Privacy by design</h2>
      <p>
        The tools run in your browser. Numbers you type, text you paste and images you open are processed on your
        device and are not uploaded to us. You can read the details in our <Link href="/privacy-policy">privacy policy</Link>.
      </p>

      <h2>Get in touch</h2>
      <p>
        Found a mistake, or want a tool we don’t have yet? <Link href="/contact">Contact us</Link>. Corrections are
        always welcome.
      </p>
    </StaticPage>
  );
}
