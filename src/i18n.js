import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";

i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    lng: "en", // Default language
    fallbackLng: "en",
    backend: {
      loadPath: "http://localhost:5000/locales/{{lng}}.json", // Fetch from backend
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
