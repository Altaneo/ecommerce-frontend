import React, { useState } from 'react';
import { Range } from 'react-range';
import { makeStyles } from '@mui/styles';
import axios from 'axios';

// Styles
const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: '20px',
    padding: '20px',
  },
  button: {
    marginTop: '10px',
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  sidebar: {
    width: '250px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  products: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    flexGrow: 1,
  },
  productCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center',
  },
  productImage: {
    width: '100%',
    height: '250px',
    borderRadius: '8px',
  },
  filterSection: {
    marginBottom: '20px',
  },
  filterTitle: {
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  sliderTrack: {
    width: '100%',
    height: '6px',
    backgroundColor: '#ddd',
    borderRadius: '4px',
    position: 'relative',
  },
  sliderThumb: {
    width: '16px',
    height: '16px',
    backgroundColor: '#007bff',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  rangeValues: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
});

function ProductFilter({ products, categories }) {
  const classes = useStyles();

  const [filters, setFilters] = useState({
    category: [],
    priceRange: [0, 1000], // [min, max]
    rating: '',
  });
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
      const response = await axios.post(`${apiBaseUrl}/api/cart/add`, {
        productId: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        type: product.type,
        rating: product.rating,
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  return (
    <div className={classes.container}>
     
      <div className={classes.sidebar}>
        <div className={classes.filterSection}>
          <div className={classes.filterTitle}>CATEGORIES</div>
          {categories.map((category) => (
            <div
              key={category}
              onClick={() => {
                const newCategories = filters.category.includes(category)
                  ? filters.category.filter((c) => c !== category)
                  : [...filters.category, category];
                setFilters((prev) => ({ ...prev, category: newCategories }));
              }}
            >
              <input
                type="checkbox"
                checked={filters.category.includes(category)}
                readOnly
              />
              <label>{category}</label>
            </div>
          ))}
        </div>

        <div className={classes.filterSection}>
          <div className={classes.filterTitle}>PRICE</div>
          <Range
            step={10}
            min={0}
            max={1000}
            values={filters.priceRange}
            onChange={(values) => setFilters((prev) => ({ ...prev, priceRange: values }))}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className={classes.sliderTrack}
                style={{
                  ...props.style,
                  background: `linear-gradient(to right, #ddd ${
                    (filters.priceRange[0] / 1000) * 100
                  }%, #007bff ${
                    (filters.priceRange[0] / 1000) * 100
                  }%, #007bff ${
                    (filters.priceRange[1] / 1000) * 100
                  }%, #ddd ${(filters.priceRange[1] / 1000) * 100}%)`,
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div {...props} className={classes.sliderThumb} />
            )}
          />
          <div className={classes.rangeValues}>
            <span>Min: ${filters.priceRange[0]}</span>
            <span>Max: ${filters.priceRange[1]}</span>
          </div>
        </div>

        <div className={classes.filterSection}>
          <div className={classes.filterTitle}>Customer Ratings</div>
          {['4', '3', '2', '1'].map((rating) => (
            <div
              key={rating}
              onClick={() => setFilters((prev) => ({ ...prev, rating }))}
            >
              <input
                type="radio"
                name="rating"
                checked={filters.rating === rating}
                readOnly
              />
              <label>{rating}★ & above</label>
            </div>
          ))}
        </div>
      </div>

      {/* Product Cards */}
      <div className={classes.products}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className={classes.productCard}>
              <img
                src={product.image}
                alt={product.name}
                className={classes.productImage}
              />
              <h3>{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>
              <p>Rating: {product.rating} ★</p>
              <button
                className={classes.button}
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
}

export default ProductFilter;
