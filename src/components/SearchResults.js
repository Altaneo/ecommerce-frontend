import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import ProductFilter from './ProductLists';

// Styles
const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: '20px',
    padding: '20px',
  },
  sidebar: {
    width: '250px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  filterSection: {
    marginBottom: '20px',
  },
  filterTitle: {
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  filterOption: {
    marginBottom: '10px',
    cursor: 'pointer',
  },
  products: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    flexGrow: 1,
  },
  productCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  productImage: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  addToCartButton: {
    marginTop: '10px',
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
});

function SearchResults() {
  const classes = useStyles();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
  const [filters, setFilters] = useState({
    category: [],
    minPrice: '',
    maxPrice: '',
    rating: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/products`);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on query and applied filters
    const filtered = products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(query.toLowerCase());
      const categoryMatch =
        filters.category.length === 0 || filters.category.includes(product.category);
      const priceMatch =
        (!filters.minPrice || product.price >= parseFloat(filters.minPrice)) &&
        (!filters.maxPrice || product.price <= parseFloat(filters.maxPrice));
      const ratingMatch =
        !filters.rating || product.rating >= parseInt(filters.rating, 10);
      return nameMatch && categoryMatch && priceMatch && ratingMatch;
    });

    setFilteredProducts(filtered);
  }, [query, products, filters]);

  const updateFilters = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const categories = ['phone', 'watch', 'laptop', 'tv','jacket', 'jeans', 'tshirt', 'shirt', 'hat','sofa', 'table', 'chair', 'bed', 'cupboard'];
  return <ProductFilter products={filteredProducts} categories={categories}/>;
}

export default SearchResults;
