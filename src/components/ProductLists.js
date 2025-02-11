import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

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
         <ProductCard imageUrl={product.image} product={product} index={index} isVisible={isVisible} handleAddToCart={handleAddToCart}/>
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
