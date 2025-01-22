import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ProductFilter({ products, categories }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isRatingsOpen, setIsRatingsOpen] = useState(false);
  const formatCategories = (category) => {
    // Your formatting function for categories
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  const [filters, setFilters] = useState({
    category: [],
    priceRange: [0, 1000], // [min, max]
    rating: '',
  });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // Stop observing after the first intersection
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
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

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      filters.category.length === 0 || filters.category.includes(product.type);
    const priceMatch =
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
    const ratingMatch =
      !filters.rating || product.rating >= parseInt(filters.rating, 10);
    return categoryMatch && priceMatch && ratingMatch;
  });

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
    <div className="flex gap-5 p-5 mt-24">
    <div
  className="bg-white text-black p-4 rounded-lg w-72 border border-purple-800 max-h-[100vh] min-h-[50vh] overflow-y-auto sticky top-4"
>
  <div className="font-bold mb-2 cursor-pointer flex justify-center items-center text-4xl">
    Filter
  </div>
  <hr className="border-purple-800 mb-2" />

  {/* Categories Section */}
  <div className="mb-5">
    <div className="mb-8">
      <img
        src="/images/sideImage.png"
        alt="Sidebar Banner"
        className="w-full h-auto rounded-lg"
      />
    </div>
    <div
      className="font-bold mb-2 cursor-pointer flex justify-between items-center"
      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
    >
      CATEGORIES
      <span className="text-purple-800">{isCategoriesOpen ? '-' : '+'}</span>
    </div>
    <hr className="border-purple-800 mb-2" />
    {isCategoriesOpen && (
      <div>
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => {
              const newCategories = filters.category.includes(category)
                ? filters.category.filter((c) => c !== category)
                : [...filters.category, category];
              setFilters((prev) => ({ ...prev, category: newCategories }));
            }}
            className="flex items-center cursor-pointer mb-2"
          >
            <input
              type="checkbox"
              checked={filters.category.includes(category)}
              readOnly
              className="mr-2"
            />
            <label className="text-black">{formatCategories(category)}</label>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Price Section */}
  <div className="mb-5">
    <div
      className="font-bold mb-2 cursor-pointer flex justify-between items-center"
      onClick={() => setIsPriceOpen(!isPriceOpen)}
    >
      PRICE
      <span className="text-purple-800">{isPriceOpen ? '-' : '+'}</span>
    </div>
    <hr className="border-purple-800 mb-2" />
    {isPriceOpen && (
      <div className="flex justify-between">
        <input
          type="number"
          value={filters.priceRange[0]}
          onChange={(e) => {
            const minPrice = Math.max(0, Number(e.target.value));
            setFilters((prev) => ({ ...prev, priceRange: [minPrice, prev.priceRange[1]] }));
          }}
          className="border border-purple-800 rounded-lg p-2 w-28"
          placeholder="Min"
        />
        <span className="mx-2">to</span>
        <input
          type="number"
          value={filters.priceRange[1]}
          onChange={(e) => {
            const maxPrice = Math.max(filters.priceRange[0], Number(e.target.value));
            setFilters((prev) => ({ ...prev, priceRange: [prev.priceRange[0], maxPrice] }));
          }}
          className="border border-purple-800 rounded-lg p-2 w-28"
          placeholder="Max"
        />
      </div>
    )}
  </div>

  {/* Customer Ratings Section */}
  <div>
    <div
      className="font-bold mb-2 cursor-pointer flex justify-between items-center"
      onClick={() => setIsRatingsOpen(!isRatingsOpen)}
    >
      Customer Ratings
      <span className="text-purple-800">{isRatingsOpen ? '-' : '+'}</span>
    </div>
    <hr className="border-purple-800 mb-2" />
    {isRatingsOpen && (
      <div>
        {['4', '3', '2', '1'].map((rating) => (
          <div
            key={rating}
            onClick={() => setFilters((prev) => ({ ...prev, rating }))}
            className="flex items-center cursor-pointer mb-2"
          >
            <input
              type="radio"
              name="rating"
              checked={filters.rating === rating}
              readOnly
              className="mr-2"
            />
            <label className="text-black">{rating}★ & above</label>
          </div>
        ))}
      </div>
    )}
  </div>
</div>



      <div className="flex-1 purple-white p-4">
        <div className="relative flex flex-col items-center justify-center min-h-screen">
          <div ref={sectionRef} className="flex flex-wrap justify-center">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div
                  key={product._id}
                  className={`m-4 max-w-xs w-full shadow-lg rounded-xl p-4 transition-transform transform 
                    ${isVisible ? 'animate-slide-in' : 'opacity-0'}
                    ${Math.floor(index / 3) % 2 === 0 ? (index % 3 === 0 ? 'translate-x-[-100%]' : 'translate-x-0') : (index % 3 === 0 ? 'translate-x-0' : 'translate-x-[100%]')}`}
                  style={{ animationDelay: `${(index % 3) * 0.2}s`, opacity: isVisible ? 1 : 0 }}
                >
                  <div className="relative h-72 w-full mb-3 overflow-hidden transition-transform duration-300 transform hover:scale-105">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full"
                    />
                    <div className="absolute flex flex-col top-0 right-0 p-3">
                      <button className="transition ease-in duration-300 bg-gray-800 hover:text-purple-500 shadow hover:shadow-md text-gray-500 rounded-full w-8 h-8 text-center p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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
                              className={`w-4 h-4 ${index < Math.floor(product.rating) ? 'text-yellow-300' : 'text-gray-300 dark:text-gray-500'} ms-1`}
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15.27L16.18 20 14.54 13.97 20 9.24l-6.91-.61L10 2 7.91 8.63 1 9.24l5.46 4.73L3.82 20z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/product/${product._id}`}>
                      <h2 className="text-lg text-black font-bold truncate">{product.name}</h2>
                    </Link>
                    <p className="text-gray-700">{product.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                      <button
                        class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No products found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductFilter;
