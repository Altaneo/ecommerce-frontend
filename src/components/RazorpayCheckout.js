import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const RazorpayCheckout = ({ data, totalPrice,paymentstatus }) => {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
  const updateAllProductsStageToPaymentCompleted = async () => {
    try {
      const updatedProductsData = data.map(item => ({
        _id: item._id,
        productId: item.productId,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        rating: item.rating,
        stage: 'PaymentCompleted', // Update stage to PaymentCompleted
        quantity: item.quantity,
        __v: item.__v,
      }));
      const updateResponse = await axios.put(`${apiBaseUrl}/api/cart/update`, updatedProductsData);
      alert(updateResponse.data.message || 'All products stage updated to PaymentCompleted successfully.');
    } catch (error) {
      console.error('Error updating products stage:', error);
      alert('Failed to update products stage.');
    }
  };
  const createOrder = async () => {
    try {
      const response = await axios.post(`${apiBaseUrl}/create-order`, {
        amount: totalPrice, // Amount in INR
      });
      console.log(response.data,"----------response")
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error("Failed to create order");
    }
  };

  const verifyPayment = async (paymentData) => {
    try {
      await axios.post(`${apiBaseUrl}/verify-signature`, paymentData);
      alert('Payment verified successfully!');
      await updateAllProductsStageToPaymentCompleted();
      await paymentstatus()
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert('Payment verification failed!');
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const order = await createOrder();

      const options = {
        key: 'rzp_test_sViQfriq16A7IA', // Replace with your Razorpay key ID
        amount: order.amount,
        currency: 'INR',
        name: 'abc',
        description: 'Test transaction',
        order_id: order.id,
        handler: async (response) => {
          const paymentData = {
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          };
          await verifyPayment(paymentData);
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
        },
        theme: {
          color: '#3944bc',
        },
        method: {
          upi: true,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      alert('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    
      <button  className="w-full mt-2 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800" onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
  
  );
};

export default RazorpayCheckout;