import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductFilter from '../components/ProductLists';

function Electronics() {
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
    return <p>Loading products...</p>; // Show loading message while fetching
  }

  if (error) {
    return <p>{error}</p>; // Show error message if fetch fails
  }

  // Filter products by category where it equals 'electronics'
  const electronicsProduct = products.filter((product) => product.category === 'electronics');

  // Define the categories array to pass as props
  const categories = ['phone', 'watch', 'laptop', 'tv'];

  return <ProductFilter products={electronicsProduct} categories={categories} />;
}

export default Electronics;
