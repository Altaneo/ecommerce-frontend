import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Importing icons
import { t } from "i18next";

export const VideoDisplayPage = () => {
  const { videoId } = useParams();
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showArrows, setShowArrows] = useState(false);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const productContainerRef = useRef(null);

  useEffect(() => {
    if (!videoId) return;

    const fetchStream = async () => {
      try {
        const { data } = await axios.get(`${apiBaseUrl}/live/${videoId}`);
        setStream(data);
      } catch (error) {
        console.error("Error fetching live stream:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStream();
  }, [videoId]);

  // Check if arrows are needed
  useEffect(() => {
    if (productContainerRef.current) {
      const container = productContainerRef.current;
      setShowArrows(container.scrollWidth > container.clientWidth);
    }
  }, [stream]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!stream) return <p className="text-center mt-20 text-lg text-red-500">{t("LIVE_NOT_FOUND")}</p>;

  const scrollProducts = (direction) => {
    if (productContainerRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 250 : 350; // Adjust scroll amount
      productContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="max-w-5xl mt-24 mx-auto p-4">
      {/* Video Section */}
      <div className="bg-black rounded-lg overflow-hidden mb-6">
        <iframe
          className="w-full h-[50vw] md:h-96 rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={stream.title}
        ></iframe>
      </div>

      {/* Product Section with Scrollable Feature */}
      <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">{t("PRODUCT_FEATURED")}</h2>
   <div className="relative w-full overflow-hidden p-4 flex items-center">
        {/* Left Scroll Button - Shown when scrolling is needed */}
        {showArrows && (
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition"
            onClick={() => scrollProducts("left")}
          >
            <ChevronLeft size={32} />
          </button>
        )}

        {/* Scrollable Influencers Container */}
        <div
          ref={productContainerRef}
          className="flex overflow-x-auto scrollbar-hide gap-6 p-4 w-full snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
        >
          {stream.products?.length > 0 ? (
             stream.products?.map((product, index) => (
                <div
                  key={product._id}
                  className="snap-start w-full md:w-1/5 min-w-[100%] md:min-w-[250px] flex justify-center"
                >
                  <ProductCard product={product} isVisible={true} />
                </div>
              ))
            ) : (
              <p className="text-black">{t("NO_FEATURE_PRODUCT")}</p>
            )}
          </div>
        

        {/* Right Scroll Button - Shown when scrolling is needed */}
        {showArrows && (
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition"
            onClick={() => scrollProducts("right")}
          >
            <ChevronRight size={32} />
          </button>
        )}
        </div>
    </div>
  );
};
