import React, { useState, useEffect } from 'react';
import {Category} from "../services/category.service.ts";
import {FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import {useLanguage} from "../context/LanguageContext.tsx";

const CategorySelector = ({ onChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('random');
  const [loading, setLoading] = useState(true);
  const { language, translate } = useLanguage();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/categories?lang=${language}`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories().then();
  }, [language]);

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    onChange(categoryId); // Notify parent component of the change
  };

  if (loading || !Array.isArray(categories) || categories.length === 0) {
    return null;
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="category-label">{translate('Category')}</InputLabel>
      <Select
        onChange={handleCategoryChange}
        labelId="category-select"
        id="category-select"
        data-testid="category-select"
        label={translate('Category')}
        value={selectedCategory}
        defaultValue='random'
        sx={{
          "& fieldset": {
            border: "none",
          },
        }}
      >
        <MenuItem value="random" defaultChecked>{translate('Random')}</MenuItem>
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategorySelector;
