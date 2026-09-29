import Link from "next/link";
import { StaticPage } from "@/components/layout/static-page";
import { siteConfig, STATIC_PAGES_UPDATED } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

const title = "Disclaimer";
const description = `Important information about how to interpret results from ${siteConfig.name}'s health, finance and other calculators.`;

export const metadata = buildMetadata({ title, description, path: "/disclaimer" });

export default function DisclaimerPage() {
  return (
    <StaticPage
      title={title}
      description={description}
      path="/disclaimer"
      updated={STATIC_PAGES_UPDATED}
      intro={`The calculators and tools on ${siteConfig.name} are provided for general information and education.`}
    >
      <h2>Health calculators</h2>
      <p>
        The BMI, calorie and pace calculators give estimates based on widely used population formulas. They do not
        account for your full medical history, body composition or health conditions and are not a diagnosis. Talk to
        a doctor, dietitian or other qualified professional before making health decisions, especially if you are
        pregnant, under 18, or managing a medical condition.
      </p>

      <h2>Financial calculators</h2>
      <p>
        Loan, interest, salary, discount and tip results are estimates based on the figures and assumptions you enter.
        Real loans can include fees, insurance, variable rates and different day-count conventions; investment returns
        are not guaranteed; and salary conversions show gross pay before tax. Confirm figures with your lender, bank,
        employer or a licensed financial adviser.
      </p>

      <h2>Education calculators</h2>
      <p>
        GPA and CGPA scales differ between schools and countries. Use your institution&apos;s official grading policy
        for transcripts, applications and scholarship decisions.
      </p>

      <h2>Accuracy and rounding</h2>
      <p>
        Results are calculated with standard floating-point arithmetic and rounded for display. Tiny rounding
        differences can occur. We correct errors promptly when they&apos;re reported. If you spot one, please{" "}
        <Link href="/contact">let us know</Link>.
      </p>

      <h2>External links</h2>
      <p>Links to other websites are provided for convenience; we don&apos;t control or endorse their content.</p>
    </StaticPage>
  );
}
