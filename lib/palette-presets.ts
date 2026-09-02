import { ThemeOverrides } from "./theme";

export interface PalettePreset {
  id: string;
  name: string;
  colors: Required<ThemeOverrides>;
}

export const PALETTE_PRESETS: PalettePreset[] = [
  {
    id: "default",
    name: "Default (TripDoc Blue)",
    colors: {
      "--color-primary": "#0b5394",
      "--color-primary-hover": "#094578",
      "--color-accent": "#f2994a",
      "--color-bg": "#f5f7fa",
      "--color-surface": "#ffffff",
      "--color-text": "#171923",
    },
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    colors: {
      "--color-primary": "#1d7be0",
      "--color-primary-hover": "#1866ba",
      "--color-accent": "#22c1a4",
      "--color-bg": "#f2f8ff",
      "--color-surface": "#ffffff",
      "--color-text": "#101828",
    },
  },
  {
    id: "forest-green",
    name: "Forest Green",
    colors: {
      "--color-primary": "#1f9d55",
      "--color-primary-hover": "#187e43",
      "--color-accent": "#f2b134",
      "--color-bg": "#f3faf5",
      "--color-surface": "#ffffff",
      "--color-text": "#0f2417",
    },
  },
  {
    id: "slate-dark",
    name: "Slate Dark",
    colors: {
      "--color-primary": "#5b5ce4",
      "--color-primary-hover": "#4746c4",
      "--color-accent": "#22c1a4",
      "--color-bg": "#f5f5fb",
      "--color-surface": "#ffffff",
      "--color-text": "#1c1c28",
    },
  },
  {
    id: "midnight-indigo",
    name: "Midnight Indigo",
    colors: {
      "--color-primary": "#4338ca",
      "--color-primary-hover": "#362d9e",
      "--color-accent": "#0ea5e9",
      "--color-bg": "#f4f4fd",
      "--color-surface": "#ffffff",
      "--color-text": "#1a1a2e",
    },
  },
  {
    id: "sunset-coral",
    name: "Sunset Coral",
    colors: {
      "--color-primary": "#e2542b",
      "--color-primary-hover": "#bd431f",
      "--color-accent": "#4a7ad8",
      "--color-bg": "#fff6f2",
      "--color-surface": "#ffffff",
      "--color-text": "#2a1a12",
    },
  },
  {
    id: "emerald-corporate",
    name: "Emerald Corporate",
    colors: {
      "--color-primary": "#0c8a5f",
      "--color-primary-hover": "#0a6f4c",
      "--color-accent": "#2563eb",
      "--color-bg": "#f2faf6",
      "--color-surface": "#ffffff",
      "--color-text": "#0d1f18",
    },
  },
  {
    id: "charcoal-minimal",
    name: "Charcoal Minimal",
    colors: {
      "--color-primary": "#111827",
      "--color-primary-hover": "#000000",
      "--color-accent": "#5b5ce4",
      "--color-bg": "#f6f6f7",
      "--color-surface": "#ffffff",
      "--color-text": "#111111",
    },
  },
  {
    id: "royal-purple",
    name: "Royal Purple",
    colors: {
      "--color-primary": "#7c3aed",
      "--color-primary-hover": "#6425c9",
      "--color-accent": "#ec4899",
      "--color-bg": "#f8f5ff",
      "--color-surface": "#ffffff",
      "--color-text": "#1f1533",
    },
  },
  {
    id: "teal-professional",
    name: "Teal Professional",
    colors: {
      "--color-primary": "#0d9488",
      "--color-primary-hover": "#0b756c",
      "--color-accent": "#f59e0b",
      "--color-bg": "#f1faf9",
      "--color-surface": "#ffffff",
      "--color-text": "#0d1f1e",
    },
  },
  {
    id: "warm-neutral",
    name: "Warm Neutral",
    colors: {
      "--color-primary": "#92400e",
      "--color-primary-hover": "#78350c",
      "--color-accent": "#1d7be0",
      "--color-bg": "#faf6f1",
      "--color-surface": "#ffffff",
      "--color-text": "#241a10",
    },
  },
  {
    id: "crimson-executive",
    name: "Crimson Executive",
    colors: {
      "--color-primary": "#b91c1c",
      "--color-primary-hover": "#941414",
      "--color-accent": "#334cd8",
      "--color-bg": "#fdf5f5",
      "--color-surface": "#ffffff",
      "--color-text": "#241010",
    },
  },
  {
    id: "brand-cart-orange",
    name: "Brand Cart Orange",
    colors: {
      "--color-primary": "#f2994a",
      "--color-primary-hover": "#d97e30",
      "--color-accent": "#111827",
      "--color-bg": "#fff8f2",
      "--color-surface": "#ffffff",
      "--color-text": "#231a10",
    },
  },
  {
    id: "sky-corporate",
    name: "Sky Corporate",
    colors: {
      "--color-primary": "#2f8fdc",
      "--color-primary-hover": "#2373b8",
      "--color-accent": "#7c3aed",
      "--color-bg": "#f2f9ff",
      "--color-surface": "#ffffff",
      "--color-text": "#10202e",
    },
  },
  {
    id: "mint-fresh",
    name: "Mint Fresh",
    colors: {
      "--color-primary": "#16a37e",
      "--color-primary-hover": "#0f7e61",
      "--color-accent": "#2f8fdc",
      "--color-bg": "#f1fbf7",
      "--color-surface": "#ffffff",
      "--color-text": "#0e211b",
    },
  },
  {
    id: "steel-blue",
    name: "Steel Blue",
    colors: {
      "--color-primary": "#475569",
      "--color-primary-hover": "#374151",
      "--color-accent": "#0ea5e9",
      "--color-bg": "#f5f6f8",
      "--color-surface": "#ffffff",
      "--color-text": "#161c24",
    },
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    colors: {
      "--color-primary": "#e11d74",
      "--color-primary-hover": "#b8165e",
      "--color-accent": "#92400e",
      "--color-bg": "#fff5f8",
      "--color-surface": "#ffffff",
      "--color-text": "#2a1420",
    },
  },
];
