export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Users", href: "/users" },
  { label: "Source Health", href: "/source-health" },
  { label: "Content Overrides", href: "/content-overrides" },
  { label: "Refresh Jobs", href: "/refresh-jobs" },
  { label: "Referrals", href: "/referrals" },
  { label: "Reports", href: "/reports" },
  { label: "Analytics", href: "/analytics" },
  { label: "Notification Templates", href: "/notification-templates" },
  { label: "CMS", href: "/cms" },
  { label: "FAQ", href: "/faq" },
  { label: "Enquiries", href: "/enquiries" },
  { label: "Settings", href: "/settings/appearance" },
  { label: "My Profile", href: "/profile" },
];
