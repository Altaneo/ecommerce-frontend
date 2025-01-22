import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';

const carouselImages = [
  '/images/poster1.jpg',
  '/images/poster5.png',
  '/images/poster2.png',
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

function LandingPage() {
  const [liveStreams, setLiveStreams] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
  const [currentWord, setCurrentWord] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["Welcome to Altaneofin Shop!", "Discover amazing products!", "Experience seamless shopping!"];
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/featureProducts`);
        setFeaturedProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    const authenticateWithYouTube = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/auth/youtube`, {
          withCredentials: true, // Important if you're using sessions
        });
        // Redirect the user to the auth URL
        window.location.href = response.data.authUrl; // Assuming your backend sends the auth URL
      } catch (error) {
        console.error('Error initiating authentication:', error);
      }
    };

    const fetchLiveStreams = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/live-stream`);
        setLiveStreams(response.data);
      } catch (err) {
        console.error('Error fetching live streams:', err);
      }
    };

    fetchFeaturedProducts();
    authenticateWithYouTube().then(() => {
      fetchLiveStreams();
    });
  }, [apiBaseUrl]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const type = () => {
      const word = words[wordIndex];

      if (isDeleting) {
        setCurrentWord((prev) => word.substring(0, prev.length - 1));
        if (currentWord.length === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        setCurrentWord((prev) => word.substring(0, prev.length + 1));
        if (currentWord === word) {
          setIsDeleting(true);
        }
      }
    };

    const typingSpeed = isDeleting ? 50 : 100;
    const timer = setTimeout(type, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentWord, isDeleting, wordIndex, words]);

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
    <>
      <div className="flex justify-center items-center bg-purple-50 h-[200px] mt-24">
        <h1 className="text-5xl font-bold text-black">
          {currentWord.split(' ').slice(0, -1).join(' ')}{' '}
          <span className="text-purple-500">{currentWord.split(' ').slice(-1)}</span>
        </h1>
      </div>
      <div className="mb-12 mt-20">
        <Slider {...sliderSettings}>
          {carouselImages.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Banner ${index + 1}`} className="w-full h-[500px] object-cover rounded-lg" />
            </div>
          ))}
        </Slider>
      </div>

      <header className="bg-white p-5 rounded-lg mb-5">
        <div className="flex justify-center overflow-hidden">
          <h2 className="text-4xl font-bold text-black animate-slide-in whitespace-nowrap">
            Upcoming Live Stream
          </h2>
        </div>
        <div className="flex justify-center">
          {liveStreams.length > 0 ? (
            liveStreams.map((stream) => (
              <div key={stream.id} className="rounded-lg shadow-lg bg-white max-w-sm m-4">
                <a href={`https://www.youtube.com/watch?v=${stream.id.videoId}`} target="_blank" rel="noopener noreferrer">
                  <iframe
                    className="w-full rounded-t-lg"
                    src={`https://www.youtube.com/embed/${stream.id.videoId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={stream.snippet.title}
                    style={{ height: '240px' }} // Set the height for the iframe
                  ></iframe>
                </a>
                <div className="p-6">
                  <h5 className="text-gray-900 text-xl font-medium mb-2">{stream.snippet.title}</h5>
                  <p className="text-gray-700 text-base mb-4">{stream.snippet.description}</p>
                  <p className="text-gray-600 text-sm mb-4">Start Time: {new Date(stream.snippet.publishTime).toLocaleString()}</p>
                  <button
                    type="button"
                    className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800">
                    Join Live
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center overflow-hidden">
              <p>No upcoming live streams available.</p>
            </div>
          )}
        </div>

        <div className="flex justify-center overflow-hidden">
          <h2 className="text-4xl font-bold text-black animate-slide-in whitespace-nowrap">
            Featured Products
          </h2>
        </div>
        <div className="relative flex flex-col items-center justify-center min-h-screen">
          <div
            ref={sectionRef}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center"
          >
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (

                <div
                  key={product._id}
                  className={`shadow-lg rounded-xl p-4 transition-transform transform 
                      ${isVisible ? 'animate-slide-in' : 'opacity-0'}
                      ${Math.floor(index / 3) % 2 === 0 ? (index % 3 === 0 ? 'translate-x-[-100%]' : 'translate-x-0') : (index % 3 === 0 ? 'translate-x-0' : 'translate-x-[100%]')}`}
                  style={{
                    animationDelay: `${(index % 3) * 0.2}s`,
                    opacity: isVisible ? 1 : 0,
                  }}
                >
                  <div className="relative w-full aspect-square mb-3 overflow-hidden transition-transform duration-300 transform hover:scale-105">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full"
                    />
                    <div className="absolute flex flex-col top-0 right-0 p-3">
                      <button className="transition ease-in duration-300 bg-gray-800 hover:text-purple-500 shadow hover:shadow-md text-gray-500 rounded-full w-8 h-8 text-center p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex-auto justify-evenly">
                    <div className="flex flex-wrap">
                      <div className="w-full flex-none text-sm flex items-center text-gray-600">
                        <div className="flex items-center mb-2 mt-2">
                          {Array.from({ length: 5 }, (_, index) => (
                            <svg
                              key={index}
                              className={`w-4 h-4 ${index < Math.floor(product.rating)
                                  ? 'text-yellow-300'
                                  : 'text-gray-300 dark:text-gray-500'
                                } ms-1`}
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <Link
      to={`/product/${product._id}`}
    >
                      <div className="flex items-center w-full justify-between min-w-0">
                        <h2 className="text-lg mr-auto cursor-pointer text-black-200 hover:text-purple-500 truncate">
                          {product.name}
                        </h2>
                      </div>
                      </Link>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ₹{product.price}
                      </span>
                      <button
                        className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white">No featured products available.</p>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default LandingPage;
