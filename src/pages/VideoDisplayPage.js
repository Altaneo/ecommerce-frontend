import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export const VideoDisplayPage = () => {
  const { videoId } = useParams();
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
  useEffect(() => {
    if (!videoId) return; // Prevent running if videoId is undefined

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
  }, [videoId]); // ✅ Fix: Now re-fetches when videoId changes

  if (loading) return <p>Loading...</p>;
  if (!stream) return <p>Live stream not found.</p>;

  return (
    <div className="max-w-5xl mt-24 mx-auto p-4">
      <div className="bg-black rounded-lg overflow-hidden mb-6">
        <iframe
          className="w-full h-80 md:h-96"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={stream.title}
        ></iframe>
      </div>
      <h2 className="text-xl font-semibold mb-4">Products Featured in This Live</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stream.products?.map((product,index) => (
          <ProductCard imageUrl={`${apiBaseUrl}${product.image}`} product={product} index={index} isVisible={true}/>
        ))}
      </div>
    </div>
  );
};
