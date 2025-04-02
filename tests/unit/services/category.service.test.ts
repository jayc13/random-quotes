import { promises as fs } from 'fs';
import { getAllCategories, getCategory } from '../../../src/services/category.service';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn()
  }
}));

jest.mock('path', () => ({
  join: jest.fn()
}));

describe('Category Service', () => {
  const mockCategories = {
    en: [
      { id: 'category1', name: 'Category 1' },
      { id: 'category2', name: 'Category 2' },
      { id: 'category3', name: 'Category 3' }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    it('returns categories when file exists', async () => {
      jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(mockCategories));

      const result = await getAllCategories();

      expect(result).toEqual(mockCategories['en']);
    });

    it('returns empty array when file does not exist', async () => {
      jest.spyOn(fs, 'readFile').mockRejectedValue(new Error('File not found'));

      const result = await getAllCategories();

      expect(result).toEqual([]);
    });
  });

  describe('getCategory', () => {
    beforeEach(() => {
      jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(mockCategories));
    });

    it('returns matching category when provided category exists', async () => {
      const result = await getCategory({
        expectedCategory: 'category2',
      });

      expect(result).toEqual({ id: 'category2', name: 'Category 2' });
    });

    it('returns matching category regardless of case', async () => {
      const result = await getCategory({
        expectedCategory: 'category1',
      });

      expect(result).toEqual({ id: 'category1', name: 'Category 1' });
    });

    it('returns random category when provided category does not exist', async () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.5);

      const result = await getCategory({
        expectedCategory: 'Nonexistent Category',
      });

      expect(result).toEqual({ id: 'category2', name: 'Category 2' });
    });

    it('returns random category when no category is provided', async () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.7);

      const result = await getCategory();

      expect(result).toEqual({ id: 'category3', name: 'Category 3' });
    });

    it('returns random category when empty string is provided', async () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0);

      const result = await getCategory({
        expectedCategory: '',
      });

      expect(result).toEqual({ id: 'category1', name: 'Category 1' });
    });

    it('handles empty categories array gracefully', async () => {
      jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify([]));

      const result = await getCategory({
        expectedCategory: 'Nonexistent Category',
      });

      expect(result).toBeUndefined();
    });
  });
});