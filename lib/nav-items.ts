import {
  LayoutDashboard,
  Users,
  Activity,
  FileEdit,
  RefreshCw,
  Gift,
  MessageSquareWarning,
  BarChart3,
  BellRing,
  FileText,
  HelpCircle,
  Mail,
  UserCircle,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "User Management", href: "/users", icon: Users },
  { label: "Source Health", href: "/source-health", icon: Activity },
  { label: "Content Overrides", href: "/content-overrides", icon: FileEdit },
  { label: "Refresh Jobs", href: "/refresh-jobs", icon: RefreshCw },
  { label: "Referral Management", href: "/referrals", icon: Gift },
  { label: "Feedback & Reports", href: "/reports", icon: MessageSquareWarning },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Notification Templates", href: "/notification-templates", icon: BellRing },
  { label: "CMS Management", href: "/cms", icon: FileText },
  { label: "FAQ Management", href: "/faq", icon: HelpCircle },
  { label: "Contact Enquiries", href: "/enquiries", icon: Mail },
  { label: "My Profile", href: "/profile", icon: UserCircle },
  { label: "Settings", href: "/settings/appearance", icon: Settings },
];
