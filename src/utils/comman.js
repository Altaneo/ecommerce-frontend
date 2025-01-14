export const formatCategories = (category) => {
  const formatted = category
    .replace(/([A-Z])/g, ' $1') // Adds a space before each uppercase letter.
    .replace(/^./, (match) => match.toUpperCase()); // Capitalizes the first letter.
  return formatted;
};