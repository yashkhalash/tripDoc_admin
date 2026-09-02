export const BREADCRUMB_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  users: "User Management",
  "source-health": "Source Health",
  "content-overrides": "Content Overrides",
  "refresh-jobs": "Refresh Jobs",
  referrals: "Referral Management",
  reports: "Feedback & Reports",
  analytics: "Analytics",
  "notification-templates": "Notification Templates",
  cms: "CMS Management",
  faq: "FAQ Management",
  enquiries: "Contact Enquiries",
  profile: "My Profile",
  settings: "Settings",
  appearance: "Appearance",
  general: "General",
  "api-configuration": "API Configuration",
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function labelForSegment(segment: string): string {
  if (BREADCRUMB_LABELS[segment]) return BREADCRUMB_LABELS[segment];
  if (UUID_PATTERN.test(segment)) return "Details";
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
