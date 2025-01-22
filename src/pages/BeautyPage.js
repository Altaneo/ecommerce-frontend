import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductFilter from '../components/ProductLists';
import { formatCategories } from '../utils/comman';

function BeautyPage() {
  const [products, setProducts] = useState([]); // State to store the products
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
  useEffect(() => {
    // Fetch products from the API
    axios
      .get(`${apiBaseUrl}/api/products`)
      .then((response) => {
        setProducts(response.data); // Set the fetched products to state
        setLoading(false); // Set loading to false
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products.'); // Set error message
        setLoading(false); // Set loading to false
      });
  }, []); // Empty dependency array ensures the effect runs only once

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>; // Show error message if fetch fails
  }

  // Filter products by category where it equals 'beauty'
  const beautyProducts = products.filter((product) => product.category === 'beauty');

  // Define the categories array to pass as props
  const categories = ['makeup', 'cream', 'hairdryer', 'shampoo'];
  return <ProductFilter products={beautyProducts} categories={categories} />;
}

export default BeautyPage;
