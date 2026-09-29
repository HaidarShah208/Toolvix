import { getPopularTools, toolHref } from "@/config/tools";
import { Logo } from "./logo";
import { MobileNavigation } from "./mobile-navigation";
import { NavLinks } from "./nav-links";
import { SearchDialog } from "./search-dialog";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const quickLinks = getPopularTools().map((t) => ({ href: toolHref(t), name: t.name, icon: t.icon }));
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="container-page flex h-16 items-center gap-3">
        <Logo />
        <nav aria-label="Main" className="ml-6 hidden lg:block">
          <NavLinks />
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <SearchDialog />
          <ThemeToggle />
          <MobileNavigation quickLinks={quickLinks} />
        </div>
      </div>
    </header>
  );
}
