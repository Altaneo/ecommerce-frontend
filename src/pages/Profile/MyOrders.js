import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { Button, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    gap: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  productCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.2s',
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
  },
  productImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  productInfo: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  priceSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
  },
  quantityButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  button: {
    backgroundColor: "#1976d2",
    color: '#fff',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  deleteButton: {
    marginLeft: '10px',
    color: '#f44336',
  },
  emptyCartMessage: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#666',
  },
});

function MyOrders() {
  const classes = useStyles();
  const [cartItems, setCartItems] = useState([]);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/cart`);
        const itemsWithQuantities = response.data.map((item) => ({
          ...item,
          quantity: 1,
        }));
        setCartItems(itemsWithQuantities);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };
    fetchCartItems();
  }, [apiBaseUrl]);



  return (
    <div className={classes.container}>
      <Typography variant="h5" className={classes.title}>
        Cart Items
      </Typography>
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item.productId} className={classes.productCard}>
            <img
              src={item.image}
              alt={item.name}
              className={classes.productImage}
            />
            <Box className={classes.productInfo}>
              <Typography variant="h6">{item.name}</Typography>
              <div className={classes.priceSection}>
                <Typography variant="body2">
                  Price: ₹{item.price}
                </Typography>
              </div>
            </Box>
          </div>
        ))
      ) : (
        <Typography className={classes.emptyCartMessage}>
          Your cart is empty.
        </Typography>
      )}
    </div>
  );
}

export default MyOrders;
