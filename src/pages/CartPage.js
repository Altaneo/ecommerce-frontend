import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { Button, Typography, Box, IconButton, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AuthModal from '../components/AuthModal';
import ProfileModal from '../components/ProfileModal';
import RazorpayCheckout from '../components/RazorpayCheckout';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '20px',
    gap: '20px',
    justifyContent: 'space-between',
  },
  productSection: {
    flex: '0 0 63%',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  priceSection: {
    flex: '0 0 28%',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  productCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '15px',
    backgroundColor: '#fff',
  },
  productImage: {
    width: '250px',
    height: '250px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  button: {
    marginTop: '10px',
    backgroundColor: "#1976d2",
    color: '#fff',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  quantityButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  placeOrderButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    marginTop: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    textAlign: "center",
    "&:hover": {
      backgroundColor: "#394bc",
    },
    "&:disabled": {
      backgroundColor: "#ddd",
      cursor: "not-allowed",
    },
  },
});

function CartPage() {
  const classes = useStyles();
  const [cartItems, setCartItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [authType, setAuthType] = useState('Login'); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(false);
  const [priceDetails, setPriceDetails] = useState({
    totalPrice: 0,
    discount: 0,
    deliveryCharges: 0,
    finalAmount: 0,
  });
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' for Cash on Delivery

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
        calculatePriceDetails(itemsWithQuantities);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };
    fetchCartItems();
  }, []);

  const checkAuthToken = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/auth/check-auth`, {
        withCredentials: true,
      });
      setIsAuthenticated(response.data.authenticated);
    } catch (error) {
      console.error('Error checking auth token:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthToken();
  }, []);

  const handleOpenModal = (type) => {
    if (!isAuthenticated) {
      setAuthType(type);
      setModalOpen(true);
    } else {
      // Proceed with payment or other actions
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`);
      const updatedCart = cartItems.filter((item) => item.productId !== productId);
      setCartItems(updatedCart);
      calculatePriceDetails(updatedCart);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    checkAuthToken(); // Recheck auth status after login/signup
  };

  const handleCloseProfileModal = () => {
    setProfileModalOpen(false);
  };

  const handlePayment = () => {
    if (paymentMethod === 'razorpay') {
      const options = {
        key: 'YOUR_RAZORPAY_KEY',
        amount: priceDetails.finalAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'Your Company',
        description: 'Test Transaction',
        handler: function (response) {
          alert(`Payment successful. Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // Handle Cash on Delivery
      alert('Order placed successfully with Cash on Delivery.');
    }
  };

  const handleQuantityChange = (productId, increment) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: Math.max(1, item.quantity + increment) }
        : item
    );
    setCartItems(updatedCart);
    calculatePriceDetails(updatedCart);
  };

  const calculatePriceDetails = (items) => {
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = totalPrice * 0.1; // Assuming 10% discount
    const finalAmount = totalPrice - discount;
    setPriceDetails({
      totalPrice,
      discount,
      deliveryCharges: finalAmount > 0 ? 0 : 50, // Free delivery if finalAmount > 0
      finalAmount,
    });
  };

  return (
    <div className={classes.container}>
      {/* Product Details Section */}
      <div className={classes.productSection}>
        <Typography variant="h5" gutterBottom>
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
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2">
                  Price: ₹{item.price}
                </Typography>
                <div className={classes.quantityButtons}>
                  <Button
                    variant="outlined"
                    onClick={() => handleQuantityChange(item.productId, -1)}
                  >
                    −
                  </Button>
                  <Typography>{item.quantity}</Typography>
                  <Button
                    variant="outlined"
                    onClick={() => handleQuantityChange(item.productId, 1)}
                  >
                    +
                  </Button>
                </div>
                <Button
                  startIcon={<DeleteIcon />}
                  className={classes.button}
                  onClick={() => handleRemoveItem(item.productId)}
                >
                  Remove
                </Button>
              </Box>
            </div>
          ))
        ) : (
          <Typography variant="body1">Your cart is empty.</Typography>
        )}
        {cartItems.length > 0 && (
          <Box>
            <Typography variant="h6">Select Payment Method:</Typography>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
              <FormControlLabel value="razorpay" control={<Radio />} label="Online Payment" />
            </RadioGroup>
            {paymentMethod === 'razorpay' ? (
              <RazorpayCheckout data={cartItems} totalPrice={priceDetails.finalAmount} />
            ) : (
              <button className={classes.placeOrderButton} onClick={handlePayment}>
                Place Order with Cash on Delivery
              </button>
            )}
            {isAuthenticated && !deliveryAddress && (
          <button className={classes.placeOrderButton} onClick={() => setProfileModalOpen(true)}>
            Add New Delivery Address
          </button>
        )}
          </Box>
        )}
      </div>

      {/* Price Details Section */}
      <div className={classes.priceSection}>
        <Typography variant="h5" gutterBottom>
          Price Details
        </Typography>
        <Box sx={{ marginBottom: '10px' }}>
          <Typography>Price ({cartItems.length} item): ₹{priceDetails.totalPrice}</Typography>
        </Box>
        <Box sx={{ marginBottom: '10px' }}>
          <Typography>Discount: − ₹{priceDetails.discount.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ marginBottom: '10px' }}>
          <Typography>Delivery Charges: ₹{priceDetails.deliveryCharges}</Typography>
        </Box>
        <Box sx={{ fontWeight: 'bold', marginTop: '20px' }}>
          <Typography>Total Amount: ₹{priceDetails.finalAmount.toFixed(2)}</Typography>
        </Box>
        <Typography sx={{ color: 'green', marginTop: '10px' }}>
          You will save ₹{priceDetails.discount.toFixed(2)} on this order.
        </Typography>
      </div>
      <AuthModal open={modalOpen} onClose={handleCloseModal} authType={authType} />
      <ProfileModal open={profileModalOpen} onClose={handleCloseProfileModal} />
    </div>
  );
}

export default CartPage;
