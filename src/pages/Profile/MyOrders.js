import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

function MyOrders() {
  const [cartItems, setCartItems] = useState([]);
  const { t ,i18n} = useTranslation();
   const currentLang = i18n.language || "en";
  
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
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <h2 className="text-2xl md:text-4xl mb-6 text-center font-bold text-black animate-slide-in">
        {t("MY_ORDERS")}
      </h2>
      <div className="space-y-6">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div 
              key={item.productId} 
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-[1.02]"
            >
              {/* Status Bar */}
              <div className="bg-purple-600 text-white text-center text-xs font-semibold py-2">
                {item.stage}
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start p-4 gap-4">
                {/* Product Image */}
                <img
                  src={`${apiBaseUrl}${item.image}`}
                  alt={item.name[currentLang]}
                  className="w-full sm:w-32 sm:h-32 object-cover rounded-lg"
                />
                
                {/* Product Info */}
                <div className="flex flex-col w-full">
                  <h6 className="text-lg font-semibold text-gray-800">{item.name[currentLang]}</h6>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>{t("PRICE")}: ₹{item.price}</span>
                    <span>{t("QUANTITY")}: {item.quantity}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Typography className="text-center text-gray-500">
            {t("YOUR_CART_IS_EMPTY")}
          </Typography>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
