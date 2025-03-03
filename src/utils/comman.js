import axios from "axios";
export const formatCategories = (category) => {
  const formatted = category
    .replace(/([A-Z])/g, ' $1') // Adds a space before each uppercase letter.
    .replace(/^./, (match) => match.toUpperCase()); // Capitalizes the first letter.
  return formatted;
};
export const translateText = async (text, targetLang) => {
  if (!text) return "";
  if (targetLang === "en") return text; // No translation needed for English

  try {
    const response = await axios.post("https://libretranslate.com/translate", {
      q: text,
      source: "en",
      target: targetLang,
      format: "text",
    });

    return response.data.translatedText;
  } catch (error) {
    console.error("Translation Error:", error);
    return text; // Fallback to original text
  }
};