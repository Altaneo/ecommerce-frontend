import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AuthModal from "../components/AuthModal";
import LiveStreamCard from "../components/LiveStreamCard";
import ProductCard from "../components/ProductCard";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const apiBaseUrl =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const LandingPage = () => {
  const { role, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const productScrollRef = useRef(null);
  const [liveStreams, setLiveStreams] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showArrows, setShowArrows] = useState(false);
  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        setShowArrows(scrollRef.current.scrollWidth > scrollRef.current.clientWidth);
      }
    };
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [influencers])
  const words = ["Welcome to your", "social-selling", "Network!"];
  useEffect(() => {
    if (isAuthenticated !== null) {
      setIsLoading(false);
    }
  }, [isAuthenticated]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profilesRes, productsRes, streamsRes] = await Promise.all([
          axios.get(`${apiBaseUrl}/api/auth/profiles`),
          axios.get(`${apiBaseUrl}/api/selected-products`),
          axios.get(`${apiBaseUrl}/live`),
        ]);

        setInfluencers(
          profilesRes.data.filter((user) => user.role === "influencer")
        );
        setFeaturedProducts(productsRes.data);
        setLiveStreams(streamsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const typeEffect = () => {
      const word = words[wordIndex];
      setCurrentWord((prev) =>
        isDeleting
          ? word.substring(0, prev.length - 1)
          : word.substring(0, prev.length + 1)
      );
      if (!isDeleting && currentWord === word) {
        setIsDeleting(true);
      } else if (isDeleting && currentWord === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    };

    const typingSpeed = isDeleting ? 50 : 100;
    const timer = setTimeout(typeEffect, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentWord, isDeleting, wordIndex]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.7;
      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };
  const scrollProducts = (direction) => {
    if (productScrollRef.current) {
      const scrollAmount = productScrollRef.current.offsetWidth * 0.8;
      productScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  const scrollInfluencers = (direction) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstChild?.offsetWidth || 0;
      scrollRef.current.scrollBy({ left: direction === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
    }
  };
  return (
    <>
      <div className="flex justify-center items-center bg-purple-50 h-48 mt-24">
        <h1 className="text-5xl font-bold text-black">
          {currentWord.split(" ").slice(0, -1).join(" ")}{" "}
          <span className="text-purple-500">
            {currentWord.split(" ").slice(-1)}
          </span>
        </h1>
      </div>

      <div className="bg-purple-100 p-4 md:p-8 flex flex-col md:flex-row justify-between items-center">
        <div className="w-full md:w-1/2 mb-4 text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-bold leading-relaxed max-w-md">
            We've built the first online platform for live streaming and home
            shopping shows with a built-in buying experience that anyone can
            use.
          </h1>
          {isAuthenticated && role?.trim().toLowerCase() === "influencer" && (
            <div className="flex flex-col md:flex-row gap-4 mt-4 justify-center md:justify-start">
              <button
                onClick={() => navigate("/live")}
                className="text-white bg-gradient-to-r from-purple-500 to-purple-700 hover:bg-purple-600 font-medium rounded-lg text-sm px-5 py-2.5 w-full md:w-auto"
              >
                Go Live
              </button>

              <button
                onClick={() => navigate("/manual-live")}
                className="text-white bg-gradient-to-r from-purple-500 to-purple-700 hover:bg-purple-600 font-medium rounded-lg text-sm px-5 py-2.5 w-full md:w-auto"
              >
                Add Live From Youtube
              </button>
            </div>
          )}
        </div>
        <div className="w-full md:w-1/2 overflow-hidden rounded-lg">
          <iframe
            width="100%"
            height="250"
            src="https://assets.talkshop.live/uploads/homepage_sizzle_reel.mp4"
            title="Live Stream"
            frameBorder="0"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
      </div>

      {[
        { title: "Live Stream", status: "live" },
        { title: "Upcoming Live Stream", status: "upcoming" || "ready" },
        { title: "Past Live Stream", status: "complete" },
        { title: "Recent Live Stream", status: "complete" },
      ].map(({ title, status }) => (
        <section key={title} className="container mx-auto p-4">
          <h2 className="text-4xl font-bold text-black text-center mb-5">
            {title}
          </h2>
          {liveStreams.filter((stream) => stream.status === status).length >
          0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {liveStreams
                .filter((stream) => stream.status === status)
                .map((stream) => (
                  <LiveStreamCard
                    key={stream._id}
                    link={`/video${stream.status === "live" ? "/live" : ""}/${
                      stream.streamId
                    }`}
                    stream={stream}
                    apiBaseUrl={apiBaseUrl}
                  />
                ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              No {title.toLowerCase()} available.
            </p>
          )}
        </section>
      ))}
<section className="container mx-auto p-4">
      <h2 className="text-4xl font-bold text-black text-center mb-5">
        Top Influencers
      </h2>

      <div className="relative w-full overflow-hidden p-4 flex items-center">
        {/* Left Scroll Button - Shown when scrolling is needed */}
        {showArrows && (
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition"
            onClick={() => scrollInfluencers("left")}
          >
            <ChevronLeft size={32} />
          </button>
        )}

        {/* Scrollable Influencers Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide gap-6 p-4 w-full snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
        >
          {influencers.map((influencer) => (
            <div
              key={influencer._id}
              className="snap-center w-full sm:w-auto flex flex-col items-center min-w-[80vw] sm:min-w-[200px]"
            >
              <img
                src={`${apiBaseUrl}${influencer.profilePicture}`}
                alt={influencer.name}
                className="w-52 h-52 rounded-full border-2 border-purple-300 transition-transform duration-300 ease-in-out transform hover:scale-110"
              />
              <button
                onClick={() => navigate(`/influencer/${influencer._id}`)}
                className="mt-2 text-md font-semibold text-black hover:text-purple-400"
              >
                {influencer.name}
              </button>
            </div>
          ))}
        </div>

        {/* Right Scroll Button - Shown when scrolling is needed */}
        {showArrows && (
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition"
            onClick={() => scrollInfluencers("right")}
          >
            <ChevronRight size={32} />
          </button>
        )}
      </div>
    </section>

      <div className="bg-white p-5 rounded-lg mb-5">
        <div className="flex justify-center overflow-hidden">
          <h2 className="text-4xl font-bold text-black animate-slide-in whitespace-nowrap">
            Featured Products
          </h2>
        </div>

        <div className="relative flex flex-col items-center justify-center w-full mt-4">
          {/* Scroll Left Button */}
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition"
            onClick={() => scrollProducts("left")}
          >
            <ChevronLeft size={32} />
          </button>

          {/* Scrollable Products Container */}
          <div
            ref={productScrollRef}
            className="flex overflow-x-scroll scrollbar-hide space-x-7 p-1 w-full snap-x snap-mandatory"
            style={{ scrollBehavior: "smooth", display: "flex" }}
          >
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div
                  key={product._id}
                  className="snap-start w-full md:w-1/5 min-w-[100%] md:min-w-[250px] flex justify-center"
                >
                  <ProductCard product={product} isVisible={true} />
                </div>
              ))
            ) : (
              <p className="text-black">No featured products available.</p>
            )}
          </div>

          {/* Scroll Right Button */}
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition"
            onClick={() => scrollProducts("right")}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>

      <AuthModal />
    </>
  );
};

export default LandingPage;
