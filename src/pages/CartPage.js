import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthModal from '../components/AuthModal';
import RazorpayCheckout from '../components/RazorpayCheckout';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [authType, setAuthType] = useState('Login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
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
        }));

        setCartItems(itemsWithQuantities);
        calculatePriceDetails(itemsWithQuantities);

        const allItemsConfirmed = itemsWithQuantities.every(
          (item) => item.stage === 'OrderConfirmed'
        );
        setPaymentSuccessful(allItemsConfirmed);
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

  const handleAuthenticate = () => {
    setAuthType('Login');
    setModalOpen(true);
  };
  const paymentstatus = () => {
    setPaymentSuccessful(true)
  }
  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete(`${apiBaseUrl}/api/cart/${productId}`);
      const updatedCart = cartItems.filter((item) => item.productId !== productId);
      setCartItems(updatedCart);
      calculatePriceDetails(updatedCart);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    checkAuthToken();
  };

  const handlePayment = () => {
    alert('Order placed successfully with Cash on Delivery.');
  };

  const handleQuantityChange = async (productId, increment) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: Math.max(1, item.quantity + increment) }
        : item
    );

    const updatedItem = updatedCart.find((item) => item.productId === productId);
    const updatedQuantity = updatedItem?.quantity;

    try {
      await axios.put(`${apiBaseUrl}/api/cart/update/${productId}`, {
        quantity: updatedQuantity,
      });
      setCartItems(updatedCart);
      calculatePriceDetails(updatedCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const calculatePriceDetails = (items) => {
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = totalPrice * 0.1;
    const finalAmount = totalPrice - discount;
    setPriceDetails({
      totalPrice,
      discount,
      deliveryCharges: finalAmount > 0 ? 0 : 50,
      finalAmount,
    });
  };

  const handleConfirmOrder = async () => {
    try {
      const updatedProductsData = cartItems.map((item) => ({
        ...item,
        stage: 'OrderConfirmed',
      }));
      await axios.put(`${apiBaseUrl}/api/cart/update`, updatedProductsData);
      alert('Order Confirmed');
    } catch (error) {
      console.error('Error updating products stage:', error);
      alert('Failed to update products stage.');
    }
  };

  return (
    <div className="flex flex-wrap mt-24 p-5 gap-5 justify-between">
      <div className="flex-1 p-5 border rounded-lg bg-purple-100">
        <h2 className="text-lg font-semibold mb-4">Cart Items</h2>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.productId}
              className="group relative flex items-center gap-12 p-4 border rounded-lg bg-white mb-4 overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-40 h-40 object-cover rounded-lg"
              />
              <div className="flex-grow mr-8">
                <h3 className="text-base font-medium">{item.name}</h3>
                <p className="text-sm">Price: ₹{item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleQuantityChange(item.productId, -1)}
                    className="px-3 py-1 border rounded-lg"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.productId, 1)}
                    className="px-3 py-1 border rounded-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Right-side container */}
              <div className="relative">
                {/* Cross Icon */}
                <span className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-600 cursor-pointer transition-transform duration-300 group-hover:translate-x-[50px]">
                  ×
                </span>

                {/* Sliding Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="absolute top-1/2 right-[-60px] transform -translate-y-1/2 px-4 py-2 bg-red-500 text-white rounded-lg opacity-0 transition-all duration-300 group-hover:right-4 group-hover:opacity-100 group-hover:outline group-hover:outline-2 group-hover:outline-purple-500"
                >
                  Remove
                </button>
              </div>
            </div>



          ))
        ) : (
          <p>Your cart is empty.</p>
        )}

        {cartItems.length > 0 && (
          <div>
            {isAuthenticated ? (
              paymentSuccessful ? (
                <button
                  onClick={handleConfirmOrder}
                  className="w-full mt-2 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800"                >
                  Confirm Order
                </button>
              ) : (
                <div>
                  <h3 className="text-base font-medium">Select Payment Method:</h3>
                  <div className="mt-2">
                    <label className="block">
                      <input
                        type="radio"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      Cash on Delivery
                    </label>
                    <label className="block">
                      <input
                        type="radio"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      Online Payment
                    </label>
                  </div>
                  {paymentMethod === 'razorpay' ? (
                    <RazorpayCheckout
                      data={cartItems}
                      totalPrice={priceDetails.finalAmount}
                      paymentstatus={() => setPaymentSuccessful(true)}
                    />
                  ) : (
                    <button
                      onClick={handlePayment}
                      className="w-full mt-2 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800"                >
                      Place Order with Cash on Delivery
                    </button>
                  )}
                </div>
              )
            ) : (
              <button
                onClick={handleAuthenticate}
                className="w-full mt-2 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800"                >

                Place Order
              </button>
            )}
          </div>
        )}
      </div>

      <div className="w-1/3 p-6 border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
          Price Details
        </h2>
        <div className="text-sm mb-4 flex justify-between items-center">
          <span className="text-gray-600">Total Price:</span>
          <span className="text-gray-800 font-medium">₹{priceDetails.totalPrice}</span>
        </div>
        <div className="text-sm mb-4 flex justify-between items-center">
          <span className="text-gray-600">Discount:</span>
          <span className="text-red-500 font-medium">-₹{priceDetails.discount}</span>
        </div>
        <div className="text-sm mb-4 flex justify-between items-center">
          <span className="text-gray-600">Delivery Charges:</span>
          <span className="text-gray-800 font-medium">
            ₹{priceDetails.deliveryCharges > 0 ? priceDetails.deliveryCharges : 'Free'}
          </span>
        </div>
        <hr className="my-4 border-gray-300" />
        <div className="text-base font-semibold flex justify-between items-center text-gray-900 mb-4">
          <span>Final Amount:</span>
          <span className="text-purple-600">₹{priceDetails.finalAmount}</span>
        </div>
        <div className="mt-6">
        <h3 className="text-base font-semibold text-white mb-4 px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-purple-700 shadow text-center">
  Payment Methods
</h3>
          <div className="flex flex-wrap items-center justify-center gap-6 bg-purple-50 p-4 rounded-lg shadow-sm">
            {/* UPI Icon */}
            <div className="flex flex-col items-center">
              <img
                src="/images/upi.png"
                alt="UPI"
                className="w-24 h-12 transition-transform transform hover:scale-105"
              />
              <span className="text-sm text-gray-600 mt-2">UPI</span>
            </div>
            {/* Visa Icon */}
            <div className="flex flex-col items-center">
              <img
                src="/images/visa.png"
                alt="Visa"
                className="w-24 h-12 transition-transform transform hover:scale-105"
              />
              <span className="text-sm text-gray-600 mt-2">Visa</span>
            </div>
            {/* MasterCard Icon */}
            <div className="flex flex-col items-center">
              <img
                src="/images/mastercard.png"
                alt="MasterCard"
                className="w-24 h-12 transition-transform transform hover:scale-105"
              />
              <span className="text-sm text-gray-600 mt-2">MasterCard</span>
            </div>
            {/* RuPay Icon */}
            <div className="flex flex-col items-center">
              <img
                src="/images/rupay.png"
                alt="RuPay"
                className="w-24 h-12 transition-transform transform hover:scale-105"
              />
              <span className="text-sm text-gray-600 mt-2">RuPay</span>
            </div>
          </div>
        </div>
      </div>
      <AuthModal open={modalOpen} type={authType} onClose={handleCloseModal} />
    </div>
  );
}

export default CartPage;
