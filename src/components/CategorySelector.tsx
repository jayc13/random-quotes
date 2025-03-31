import React, { useState, useEffect } from 'react';
import {Category} from "../services/category.service.ts";
import {FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const CategorySelector = ({ onChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('random');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories().then();
  }, []);

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
      <InputLabel id="category-label">Category</InputLabel>
      <Select
        onChange={handleCategoryChange}
        labelId="category-select"
        id="category-select"
        data-testid="category-select"
        label="Category"
        value={selectedCategory}
        defaultValue='random'
      >
        <MenuItem value="random" defaultChecked>Random</MenuItem>
        {categories.map((category) => (
          <MenuItem key={category.name.toLowerCase()} value={category.name.toLowerCase()}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategorySelector;
