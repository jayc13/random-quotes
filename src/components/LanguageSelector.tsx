import React from 'react';

const LanguageSelector: React.FC = () => {
  return (
    <select>
      <option value="en">🇬🇧 English</option>
      <option value="fr">🇫🇷 Français</option>
      <option value="es">🇪🇸 Español</option>
    </select>
  );
};

export default LanguageSelector;
