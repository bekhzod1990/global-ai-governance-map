/**
 * Detect Cyrillic characters in a string. Used by the dev-mode validator
 * to ensure no Russian seed text leaked into the displayed dataset.
 */
const CYRILLIC_RE = /[Ѐ-ӿԀ-ԯ]/;

export function hasCyrillic(value: string): boolean {
  return CYRILLIC_RE.test(value);
}

/**
 * Curated translation table for residual seed-data strings.
 * The actual dataset in `src/data/*` is already authored in English;
 * this map exists so that future imports from the seed DOCX can be
 * normalised through a single function.
 */
const TRANSLATION_TABLE: Record<string, string> = {
  "Республика Корея": "Republic of Korea",
  "Корея": "Korea",
  "Япония": "Japan",
  "Германия": "Germany",
  "Великобритания": "United Kingdom",
  "США": "United States",
  "Канада": "Canada",
  "Франция": "France",
  "Италия": "Italy",
  "Сингапур": "Singapore",
  "Австралия": "Australia",
  "Швейцария": "Switzerland",
  "Украина": "Ukraine",
  "Турция": "Türkiye",
  "Бразилия": "Brazil",
  "Чили": "Chile",
  "Индия": "India",
  "Индонезия": "Indonesia",
  "Ирландия": "Ireland",
  "Израиль": "Israel",
  "Кения": "Kenya",
  "Саудовская Аравия": "Saudi Arabia",
  "Нидерланды": "Netherlands",
  "Нигерия": "Nigeria",
  "Филиппины": "Philippines",
  "Руанда": "Rwanda",
  "Испания": "Spain",
  "Объединенные Арабские Эмираты": "United Arab Emirates",
  "ЕС": "European Union",
  "Европейский союз": "European Union",
  "Африканский союз": "African Union",
  "Африканская комиссия Союза": "African Union Commission",
  "Новая Зеландия": "New Zealand",
};

export function translateToEnglish(value: string): string {
  let out = value;
  for (const [ru, en] of Object.entries(TRANSLATION_TABLE)) {
    out = out.split(ru).join(en);
  }
  return out;
}
