import React, { useState, useEffect } from 'react';

const CategorySelector = ({ onChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Handle error appropriately, e.g., display an error message
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    onChange(categoryId); // Notify parent component of the change
  };

  if (loading) {
    return <p>Loading categories...</p>;
  }

  return (
    <div>
      <p>Select a category:</p>
      <select value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">-- Select a category --</option> {/* Default option */}
        <option value="random">Random</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelector;
