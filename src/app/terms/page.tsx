import Link from "next/link";
import { StaticPage } from "@/components/layout/static-page";
import { siteConfig, STATIC_PAGES_UPDATED } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

const title = "Terms of Use";
const description = `The terms that apply when you use ${siteConfig.name}'s free calculators, converters and online tools.`;

export const metadata = buildMetadata({ title, description, path: "/terms" });

export default function TermsPage() {
  return (
    <StaticPage
      title={title}
      description={description}
      path="/terms"
      updated={STATIC_PAGES_UPDATED}
      intro={`By using ${siteConfig.name}, you agree to these terms. If you don't agree, please don't use the site.`}
    >
      <h2>Use of the tools</h2>
      <p>
        You may use the calculators and tools for personal, educational and commercial purposes free of charge. Please
        don&apos;t attempt to disrupt the site, overload it with automated requests, or copy it wholesale.
      </p>

      <h2>No professional advice</h2>
      <p>
        Results are for general information only. They are not financial, medical, legal, tax or other professional
        advice. Read our <Link href="/disclaimer">disclaimer</Link> for details.
      </p>

      <h2>Accuracy</h2>
      <p>
        We work to keep formulas and content correct, but we can&apos;t guarantee that every result is error-free or
        suitable for your situation. Check important figures independently before relying on them.
      </p>

      <h2>Your content</h2>
      <p>
        Text, numbers and files you use with the tools stay on your device. You are responsible for having the right to
        use any content you process, such as images you resize.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The site design, text and code are owned by {siteConfig.name}. Output you create with the tools, such as a QR
        code or a formatted file, is yours to use.
      </p>

      <h2>Links to other sites</h2>
      <p>We are not responsible for the content or practices of external websites we link to.</p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, {siteConfig.name} is provided &quot;as is&quot; without warranties, and we are
        not liable for losses arising from its use.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms from time to time. Continued use of the site after changes means you accept the
        revised terms. Questions? <Link href="/contact">Contact us</Link>.
      </p>
    </StaticPage>
  );
}
