import { Mail } from "lucide-react";
import { StaticPage } from "@/components/layout/static-page";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

const title = "Contact Us";
const description = `Contact the ${siteConfig.name} team to report an error, suggest a new calculator or tool, or ask a question about the site.`;

export const metadata = buildMetadata({ title, description, path: "/contact" });

export default function ContactPage() {
  const email = siteConfig.contactEmail;
  return (
    <StaticPage
      title={title}
      description={description}
      path="/contact"
      schemaType="ContactPage"
      intro="We read every message. The quickest way to reach us is by email."
    >
      <div className="my-6 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
          <Mail className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-foreground">Email</p>
          <a href={`mailto:${email}`} className="break-all">
            {email}
          </a>
        </div>
      </div>

      <h2>Helpful details to include</h2>
      <ul>
        <li>
          <strong>Reporting a wrong result:</strong> the page address, the values you entered and the answer you
          expected.
        </li>
        <li>
          <strong>Suggesting a tool:</strong> what you’re trying to calculate or convert, and any formula or standard
          you’d like it to follow.
        </li>
        <li>
          <strong>Accessibility problems:</strong> your device, browser and any assistive technology you use.
        </li>
      </ul>

      <h2>What we can’t help with</h2>
      <p>
        We can’t give personal financial, medical or legal advice, and we can’t recover inputs from a tool because we
        never receive them. Results are calculated in your browser.
      </p>
    </StaticPage>
  );
}
