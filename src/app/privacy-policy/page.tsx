import Link from "next/link";
import { StaticPage } from "@/components/layout/static-page";
import { siteConfig, STATIC_PAGES_UPDATED } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

const title = "Privacy Policy";
const description = `How ${siteConfig.name} handles your data: tools run in your browser, inputs are not uploaded, and optional analytics are described here.`;

export const metadata = buildMetadata({ title, description, path: "/privacy-policy" });

export default function PrivacyPolicyPage() {
  return (
    <StaticPage
      title={title}
      description={description}
      path="/privacy-policy"
      updated={STATIC_PAGES_UPDATED}
      intro={`This policy explains what information ${siteConfig.name} (${siteConfig.url}) collects and how it is used. The short version: the tools work on your device, and we don't collect what you type or upload.`}
    >
      <h2>Data you enter into tools</h2>
      <p>
        Calculators, converters, text tools, image tools and generators run in your web browser. The numbers, text,
        files and settings you use are processed on your device and are not sent to our servers. We cannot see, store
        or recover them.
      </p>
      <p>
        Some tools remember preferences in your browser&apos;s local storage (for example, your light or dark theme
        choice). This stays on your device and you can clear it at any time in your browser settings.
      </p>

      <h2>Server logs</h2>
      <p>
        Like most websites, our hosting provider automatically records basic technical information when pages are
        requested, such as IP address, browser type, the page requested and the time. These logs are used to keep the
        site secure and working and are retained only as long as the provider requires.
      </p>

      <h2>Analytics and advertising</h2>
      <p>
        If we enable analytics (such as Google Analytics) or advertising (such as Google AdSense), those services may
        use cookies or similar technologies to measure visits or show ads, and they process data under their own
        privacy policies. Where required by law, we will ask for your consent before these services set
        non-essential cookies. Analytics are configured to anonymize IP addresses.
      </p>
      <p>
        You can learn how Google uses data at{" "}
        <a href="https://policies.google.com/technologies/partner-sites" rel="noopener noreferrer" target="_blank">
          policies.google.com/technologies/partner-sites
        </a>{" "}
        and manage ad personalization at{" "}
        <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">
          adssettings.google.com
        </a>
        .
      </p>

      <h2>Emails you send us</h2>
      <p>
        If you contact us by email, we use your address and message only to reply to you, and we do not add you to a
        mailing list.
      </p>

      <h2>Children</h2>
      <p>
        The site is intended for a general audience and does not knowingly collect personal information from children.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct or delete personal information we hold
        about you. Because the tools don&apos;t send us your inputs, in most cases we hold none. To make a request,{" "}
        <Link href="/contact">contact us</Link>.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy when the site changes. The date at the top shows when it was last revised.
      </p>
    </StaticPage>
  );
}
