import { promises as fs } from 'fs';
import path from 'path';
import { getSupportedLanguages } from '../../../src/services/translate.service';

// Load all translation files
const supportedLanguages = getSupportedLanguages();

describe('Translation files consistency', () => {
  const translationsDir = path.join(process.cwd(), 'src/translations');
  const translationFiles: Record<string, Record<string, string>> = {};

  beforeAll(async () => {
    for (const lang of supportedLanguages) {
      try {
        const filePath = path.join(translationsDir, `${lang}.json`);
        const fileContent = await fs.readFile(filePath, 'utf8');
        translationFiles[lang] = JSON.parse(fileContent);
      } catch (error) {
        console.error(`Error loading translation file for ${lang}:`, error);
      }
    }
  });

  it.each(supportedLanguages)('should have translation files for %s language', (lang) => {
    expect(translationFiles[lang]).toBeDefined();
  });

  it('should have the same root-level keys in all translation files', () => {
    const languages = Object.keys(translationFiles);
    if (languages.length === 0) return;

    const referenceLanguage = languages[0];
    const referenceKeys = Object.keys(translationFiles[referenceLanguage]).sort();

    for (let i = 1; i < languages.length; i++) {
      const currentLanguage = languages[i];
      const currentKeys = Object.keys(translationFiles[currentLanguage]).sort();

      expect(currentKeys).toEqual(referenceKeys);
    }
  });

  it('should have the same nested keys in all translation files', () => {
    const languages = Object.keys(translationFiles);
    if (languages.length === 0) return;

    const referenceLanguage = languages[0];

    // Recursively collect all keys from an object
    const collectKeys = (obj: Record<string, string>, prefix = ''): string[] => {
      return Object.entries(obj).flatMap(([key, value]) => {
        const currentKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null) {
          return collectKeys(value, currentKey);
        }
        return [currentKey];
      });
    };

    const referenceNestedKeys = collectKeys(translationFiles[referenceLanguage]).sort();

    for (let i = 1; i < languages.length; i++) {
      const currentLanguage = languages[i];
      const currentNestedKeys = collectKeys(translationFiles[currentLanguage]).sort();

      expect(currentNestedKeys).toEqual(referenceNestedKeys);
    }
  });

  it('should have no extra or missing keys in nested objects', () => {
      const languages = Object.keys(translationFiles);
      if (languages.length === 0) return;

      const referenceLanguage = languages[0];
      const compareStructure = (refObj: Record<string, string>, targetObj: string, path = '') => {
        const refKeys = Object.keys(refObj);
        const targetKeys = Object.keys(targetObj);
        // Check that both objects have the same keys at the current level
        expect(targetKeys.sort()).toEqual(refKeys.sort());

        refKeys.forEach((key) => {
          const newPath = path ? `${path}.${key}` : key;
          if (typeof refObj[key] === 'object' && refObj[key] !== null) {
            expect(typeof targetObj[key]).toBe('object');
            compareStructure(refObj[key], targetObj[key], newPath);
          }
        });
      };

      const refTranslations = translationFiles[referenceLanguage];

      for (let i = 1; i < languages.length; i++) {
        const currentTranslations = translationFiles[languages[i]];
        compareStructure(refTranslations, currentTranslations);
      }
  });
});