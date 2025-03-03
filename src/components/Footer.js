import React from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-1 bg-gradient-to-r from-purple-400 to-purple-600 pt-9 pb-6">
      <div className="mx-auto w-full max-w-[1166px] px-4 xl:px-0">
        <div className="flex flex-wrap justify-between items-start gap-8 md:gap-4">
          {/* Left Column */}
          <div className="flex flex-col w-full md:w-[316px] text-center md:text-left">
            <h1 className="text-white font-extrabold text-xl md:text-2xl">
              <span className="text-purple-800">{t("BRAND_NAME")}</span> {t("SHOP")}
            </h1>
            <p className="mt-4 text-sm text-white/80 leading-relaxed">
              {t("FOOTER_DESCRIPTION")}
            </p>
            <div className="mt-4 flex justify-center md:justify-start gap-4">
              <a className="hover:scale-110" target="_blank" rel="noopener noreferrer" href="#">
                <img alt={t("FACEBOOK")} width="36" height="36" src="https://img.icons8.com/fluent/30/000000/facebook-new.png" />
              </a>
              <a className="hover:scale-110" target="_blank" rel="noopener noreferrer" href="#">
                <img alt={t("INSTAGRAM")} width="36" height="36" src="https://img.icons8.com/fluent/30/000000/instagram-new.png" />
              </a>
              <a className="hover:scale-110" target="_blank" rel="noopener noreferrer" href="#">
                <img alt={t("TWITTER")} width="36" height="36" src="https://img.icons8.com/fluent/30/000000/twitter.png" />
              </a>
              <a className="hover:scale-110" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/">
                <img alt={t("YOUTUBE")} width="36" height="36" src="https://img.icons8.com/fluent/30/000000/youtube-play.png" />
              </a>
            </div>
          </div>

          {/* Center Column */}
          <div className="flex flex-col items-center md:items-start w-full md:w-[316px]">
            <h2 className="text-white text-lg font-semibold">{t("CONTACT_US")}</h2>
            <div className="mt-4 flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/20">
                  📞
                </div>
                <div>
                  <a href="tel:+911800123444" className="text-white text-sm font-medium">
                    {t("SUPPORT_PHONE")}
                  </a>
                  <p className="text-xs text-white/80">{t("SUPPORT_NUMBER")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/20">
                  ✉️
                </div>
                <div>
                  <a href="mailto:mail@example.com" className="text-white text-sm font-medium">
                    {t("SUPPORT_EMAIL")}
                  </a>
                  <p className="text-xs text-white/80">{t("EMAIL_ADDRESS")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col w-full md:w-[316px] text-center md:text-left">
            <h1 className="text-lg font-bold text-white">{t("USEFUL_LINKS")}</h1>
            <ul className="mt-4 flex flex-col items-center md:items-start gap-2">
              <li><a className="text-white text-sm" href="#">{t("ABOUT_US")}</a></li>
              <li><a className="text-white text-sm" href="#">{t("CONTACT")}</a></li>
              <li><a className="text-white text-sm" href="#">{t("TERMS_CONDITIONS")}</a></li>
              <li><a className="text-white text-sm" href="#">{t("PRIVACY_POLICY")}</a></li>
              <li><a className="text-white text-sm" href="#">{t("BLOGS")}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-6 pt-4 text-center">
          <p className="text-xs text-white/80">
            {t("COPYRIGHT")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
