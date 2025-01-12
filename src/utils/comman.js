export const formatCategories = (categories) => {
    return categories.map((category) => {
      // Add spaces before capital letters and capitalize the first letter
      const formatted = category
        .replace(/([A-Z])/g, ' $1') // Add a space before each capital letter
        .replace(/^./, (match) => match.toUpperCase()); // Capitalize the first letter
      return formatted;
    });
  };