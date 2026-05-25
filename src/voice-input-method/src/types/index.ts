export type Language = "zh" | "en" | "ja" | "fr" | "ko";

export interface LanguageOption {
  code: Language;
  label: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "zh", label: "中文" },
  { code: "en", label: "English" },
];

export const TARGET_LANGUAGES: LanguageOption[] = [
  { code: "zh", label: "中文" },
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "fr", label: "Français" },
  { code: "ko", label: "한국어" },
];
