
interface TranslateTextOptions {
  sourceLang: string; // Source language for translation
  targetLang: string; // Target language for translation
  text: string; // Text to be translated
}

export function getSupportedLanguages(): string[] {
  return [
    'en', // English
    'es', // Spanish
    'fr', // French
    'de', // German
    'it', // Italian
    'pt', // Portuguese
  ]
}

export async function translateText(options: TranslateTextOptions): Promise<string> {
  const { sourceLang, targetLang, text } = options;

  const endpoints = [
    "https://emergency-tas-backup1.uncoverclimatix.workers.dev/translate",
    "https://655.mtis.workers.dev/translate",
    "https://collonoid.tasport1.workers.dev/translate",
    "https://t72.mouth-ploy-evoke.workers.dev/translate",
  ];

  // Parameters for translation (customize as needed)
  const params = {
    text, // Text to be translated
    source_lang: sourceLang, // Source language code
    target_lang: targetLang, // Target language code
  };

  // Try each endpoint until one works
  let result = null;
  for (const endpoint of endpoints) {
    const url = new URL(endpoint);
    url.search = new URLSearchParams(params).toString();

    try {
      const response = await fetch(url);
      if (response.ok) {
        result = await response.json();
        break;
      } else {
        console.error(`Error at ${url}: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Request exception at ${url}:`, error);
    }
  }

  // Print the result or an error message
  if (result !== null) {
    return result;
  }
  throw new Error("Translation failed after trying all endpoints.");
}