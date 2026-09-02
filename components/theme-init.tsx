"use client";

import { useEffect } from "react";
import { applyThemeOverrides, loadThemeOverrides } from "@/lib/theme";

export function ThemeInit() {
  useEffect(() => {
    applyThemeOverrides(loadThemeOverrides());
  }, []);

  return null;
}
