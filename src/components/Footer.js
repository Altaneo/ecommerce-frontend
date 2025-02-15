import React from "react";

const Footer = () => {
  return (
    <div className="mt-1 bg-gradient-to-r from-purple-400 to-purple-600 pt-9 pb-6">
      <div className="mx-auto w-full max-w-[1166px] px-4 xl:px-0">
        <div className="flex flex-wrap justify-between items-start gap-8 md:gap-4">
          {/* Left Column */}
          <div className="flex flex-col w-full md:w-[316px] text-center md:text-left">
            <h1 className="text-white font-extrabold text-xl md:text-2xl">
              <span className="text-purple-800">Altaneofin</span> Shop
            </h1>
            <p className="mt-4 text-sm text-white/80 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, fugit non. Incidunt dolorum adipisci, tempore asperiores nemo odio facere officiis enim animi placeat eaque nesciunt alias beatae id, at dicta.
            </p>
            <div className="mt-4 flex justify-center md:justify-start gap-4">
              <a className="hover:scale-110" target="_blank" rel="noopener noreferrer" href="#">
                <img alt="facebook icon" width="36" height="36" src="https://img.icons8.com/fluent/30/000000/facebook-new.png" />
              </a>
              <a className="hover:scale-110" target="_blank" rel="noopener noreferrer" href="/">
                <img alt="instagram icon" width="36" height="36" src="https://img.icons8.com/fluent/30/000000/instagram-new.png" />
              </a>
              <a className="hover:scale-110" target="_blank" rel="noopener noreferrer" href="#">
                <img alt="twitter icon" width="36" height="36" src="https://img.icons8.com/fluent/30/000000/twitter.png" />
              </a>
              <a className="hover:scale-110" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/">
                <img alt="youtube icon" width="36" height="36" src="https://img.icons8.com/fluent/30/000000/youtube-play.png" />
              </a>
            </div>
          </div>

          {/* Center Column */}
          <div className="flex flex-col items-center md:items-start w-full md:w-[316px]">
            <h2 className="text-white text-lg font-semibold">Contact Us</h2>
            <div className="mt-4 flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/20">
                  📞
                </div>
                <div>
                  <a href="tel:+911800123444" className="text-white text-sm font-medium">
                    +91 1800123444
                  </a>
                  <p className="text-xs text-white/80">Support Number</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/20">
                  ✉️
                </div>
                <div>
                  <a href="mailto:mail@example.com" className="text-white text-sm font-medium">
                    mail@example.com
                  </a>
                  <p className="text-xs text-white/80">Email Address</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col w-full md:w-[316px] text-center md:text-left">
            <h1 className="text-lg font-bold text-white">Useful Links</h1>
            <ul className="mt-4 flex flex-col items-center md:items-start gap-2">
              <li>
                <a className="text-white text-sm" href="#">About Us</a>
              </li>
              <li>
                <a className="text-white text-sm" href="#">Contact</a>
              </li>
              <li>
                <a className="text-white text-sm" href="#">Terms and Conditions</a>
              </li>
              <li>
                <a className="text-white text-sm" href="#">Privacy Policy</a>
              </li>
              <li>
                <a className="text-white text-sm" href="#">Blogs</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-6 pt-4 text-center">
          <p className="text-xs text-white/80">
            Copyright © 2025 Altaneofin Shop. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
