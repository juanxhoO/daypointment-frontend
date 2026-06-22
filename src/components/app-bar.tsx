"use client";
import { useTranslation } from "@/services/i18n/client";
import Link from "@/components/link";
import ThemeSwitchButton from "@/components/switch-theme-button";
import LanguageSwitcher from "@/components/language-switcher";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Bell,
  HelpCircle
} from "lucide-react";
function ResponsiveAppBar() {
  const { t } = useTranslation("common");

  return (
    <header className="sticky top-0 z-20 border-b bg-background text-foreground">
      <div className="flex h-[var(--header-height,4rem)] items-center gap-2 px-4">
        {/* Mobile sidebar trigger */}
        <SidebarTrigger
          aria-label="open navigation menu"
          className="md:hidden"
        />

        {/* Brand */}
        <Link
          href="/"
          className="me-auto font-mono text-lg font-bold tracking-[.3rem]"
        >
          {t("common:app-name")}
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="text-gray-500 hover:text-gray-700"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Help"
            className="text-gray-500 hover:text-gray-700"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
          <ThemeSwitchButton />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
export default ResponsiveAppBar;
