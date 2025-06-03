// Maps Judge0 language ID to a display name
export function getLanguageNameFromId(languageId) {
  const LANGUAGE_NAMES = {
    63: "JavaScript",
    71: "Python",
    62: "Java",
    // Add more as needed
  };
  return LANGUAGE_NAMES[languageId] || "Unknown";
}

// Maps a language key (like "PYTHON") to Judge0 language ID
export function getLanguageIdByName(languageKey) {
  if (!languageKey || typeof languageKey !== "string") return null; // Basic validation
  const languageMap = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
  };
  return languageMap[languageKey.toUpperCase()];
}
