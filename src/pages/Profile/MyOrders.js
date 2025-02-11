import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography } from '@mui/material';

function MyOrders() {
  const [cartItems, setCartItems] = useState([]);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/cart`);
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };
    fetchCartItems();
  }, [apiBaseUrl]);

  return (
    <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-4xl mb-3 flex justify-center font-bold text-black animate-slide-in whitespace-nowrap">
      
        My Orders
     </h2>
      <div className="space-y-4">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.productId} className="flex items-start bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300">
              <img
                src={`${apiBaseUrl}${item.image}`}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg mr-4"
              />
              <div className="flex-grow">
                <h6 className="text-lg font-semibold text-gray-800">{item.name}</h6>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-600">Price: ₹{item.price}</span>
                  <span className="text-gray-600">Quantity: {item.quantity}</span>
                </div>
                <span className="inline-block mt-2 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white text-xs font-bold rounded-full px-2 py-1">
                  {item.stage}
                </span>
              </div>
            </div>
          ))
        ) : (
          <Typography className="text-center text-gray-500">
            Your cart is empty.
          </Typography>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
