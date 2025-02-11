import React, { useEffect, useState,useRef } from "react";
import { useParams,Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

const LivestreamDetails = () => {
  const { streamId } = useParams();
  const [livestream, setLivestream] = useState(null);
  const scrollRef = useRef(null);

  // Scroll left function
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  // Scroll right function
  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
  useEffect(() => {
    const fetchLivestream = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/live/${streamId}`);
        setLivestream(response.data);
      } catch (error) {
        console.error("Error fetching livestream:", error);
      }
    };
    fetchLivestream();
  }, [streamId]);

  if (!livestream) return <div className="text-purple-700 text-center mt-20 text-2xl">Loading...</div>;
  const handleAddToCart = async (product) => {
    try {
      const existingItemResponse = await axios.get(`${apiBaseUrl}/api/cart/${product._id}`);
      const existingItem = existingItemResponse.data;
      if (existingItem) {
        const updatedQuantity = existingItem.quantity + 1;
        const updateResponse = await axios.put(`${apiBaseUrl}/api/cart/update/${product._id}`, {
          quantity: updatedQuantity,
        });
        alert(updateResponse.data.message || 'Product quantity updated in the cart.');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        try {
          const addResponse = await axios.post(`${apiBaseUrl}/api/cart/add`, {
            productId: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            type: product.type,
            rating: product.rating,
            stage: 'AddedToCart',
            quantity: 1,
          });
          alert(addResponse.data.message || 'Product added to the cart.');
        } catch (addError) {
          console.error('Error adding product to the cart:', addError);
          alert('Failed to add product to cart.');
        }
      } else {
        console.error('Error checking cart:', error);
        alert('Failed to check product in cart.');
      }
    }
  };

  return (
    <div className="mx-auto mt-24 p-6 text-gray-900 rounded-lg shadow-xl">
      {/* Livestream Title & Description */}
      <h2 className="text-4xl font-bold text-purple-800">{livestream.title}</h2>
      <p className="text-gray-600 mt-2">{livestream.description}</p>

      {/* YouTube Video Embed */}
      <div className="mt-6">
        <iframe
          width="100%"
          height="400"
          src={`https://www.youtube.com/embed/${livestream.streamId}?autoplay=1`}
          title="Livestream"
          className="rounded-xl shadow-md border border-purple-300"
        ></iframe>
      </div>

      {/* Product Section */}
      <h3 className="text-3xl font-semibold text-purple-900 mt-8 mb-4">Products</h3>
      <div className="relative max-w-6xl mx-auto p-6">
      {/* Scroll Left Button */}
      {livestream.products.length > 4 && (
        <button 
          onClick={scrollLeft} 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Product Container */}
      <div 
        ref={scrollRef} 
        className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide p-2"
      >
        {livestream.products.map((product) => (
          <div 
            key={product._id} 
            className="min-w-[250px] max-w-[250px] bg-white shadow-lg rounded-xl p-4 border border-purple-300 transform transition hover:scale-105 hover:shadow-xl"
          >
            {/* Product Image */}
            <div className="relative h-48 w-full mb-3 overflow-hidden rounded-lg">
              <img 
                src={`${apiBaseUrl}${product.image}`} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              {/* Stock Label */}
              <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
                {product.stock}
              </div>
            </div>

            {/* Product Details */}
            <Link to={`/product/${product._id}`}>
              <h2 className="text-lg font-bold text-black truncate">{product.name}</h2>
            </Link>
            <p className="text-gray-600 text-sm">{product.description}</p>

            {/* Price & Add to Cart */}
            <div className="flex justify-between items-center mt-3">
              <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
              <button
                className={`text-white font-medium rounded-lg text-sm px-4 py-2 
                  ${product.stock === "Out Of Stock" ? "bg-gray-300 border border-black" : 
                  "bg-purple-600 hover:bg-purple-700"}`}
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === "Out Of Stock"}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Right Button */}
      {livestream.products.length > 4 && (
        <button 
          onClick={scrollRight} 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
    </div>
  );
};

export default LivestreamDetails;
