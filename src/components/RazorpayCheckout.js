import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  button: {
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
const RazorpayCheckout = ({ data, totalPrice }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const removeAllCartItems = async () => {
    try {
      await axios.delete("http://localhost:5000/api/cart");
    } catch (error) {
      console.error("Error removing all items:", error);
    }
  };

  const createOrder = async () => {
    try {
      const response = await axios.post('http://localhost:5000/create-order', {
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
      await axios.post('http://localhost:5000/verify-signature', paymentData);
      alert('Payment verified successfully!');
      await removeAllCartItems();
      navigate('/home');
      
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
    
      <button className={classes.button} onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
  
  );
};

export default RazorpayCheckout;