import React from 'react';
import { Link } from "react-router-dom";
import axios from "axios";

const ProductCard = ({ product, index, isVisible }) => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    const handleAddToCart = async (product) => {
        try {
            const existingItemResponse = await axios.get(
                `${apiBaseUrl}/api/cart/${product._id}`
            );
            const existingItem = existingItemResponse.data;
            if (existingItem) {
                const updatedQuantity = existingItem.quantity + 1;
                const updateResponse = await axios.put(
                    `${apiBaseUrl}/api/cart/update/${product._id}`,
                    { quantity: updatedQuantity }
                );
                alert(updateResponse.data.message || "Product quantity updated in the cart.");
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                try {
                    const addResponse = await axios.post(`${apiBaseUrl}/api/cart/add`, {
                        productId: product._id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        image: product.image,
                        type: product.type,
                        rating: product.rating,
                        stage: "AddedToCart",
                        quantity: 1,
                    });
                    alert(addResponse.data.message || "Product added to the cart.");
                } catch (addError) {
                    console.error("Error adding product to the cart:", addError);
                    alert("Failed to add product to cart.");
                }
            } else {
                console.error("Error checking cart:", error);
                alert("Failed to check product in cart.");
            }
        }
    };

    return (
        <div
            key={product._id}
            className={`m-4 max-w-xs sm:max-w-sm md:max-w-md w-full sm:w-72 md:w-80 lg:w-60 xl:w-64 shadow-lg rounded-xl p-4 transition-transform transform 
                ${isVisible ? 'animate-slide-in' : 'opacity-0'}
                ${Math.floor(index / 3) % 2 === 0 ? (index % 3 === 0 ? 'translate-x-[-100%]' : 'translate-x-0') : (index % 3 === 0 ? 'translate-x-0' : 'translate-x-[100%]')}
                ${product.stock === "Out Of Stock" ? 'opacity-50 pointer-events-none bg-gray-300' : ''}`}
            style={{ animationDelay: `${(index % 3) * 0.2}s`, opacity: isVisible ? 1 : 0 }}
        >
            <div className="relative h-56 sm:h-72 w-full mb-3 overflow-hidden transition-transform duration-300 transform hover:scale-105">
            <img src={`${apiBaseUrl}${product.image}`} alt={product.name} className="w-full h-full object-contain" />
                <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.stock}
                </div>
            </div>
            <div className="flex-auto justify-evenly">
                <div className="w-full text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                            <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-300' : 'text-gray-300 dark:text-gray-500'} ms-1`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 15.27L16.18 20 14.54 13.97 20 9.24l-6.91-.61L10 2 7.91 8.63 1 9.24l5.46 4.73L3.82 20z" />
                            </svg>
                        ))}
                    </div>
                </div>
                <Link to={`/product/${product._id}`}>
                    <h2 className="text-lg text-black font-bold truncate">{product.name}</h2>
                </Link>
                <p className="text-gray-700 text-sm sm:text-base">{product.description}</p>
                <div className="flex justify-between items-center mt-3">
                    <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                    <button
                        className={`text-white font-medium rounded-lg text-sm px-3 sm:px-5 py-2 sm:py-2.5 text-center ${product.stock === "Out Of Stock" ? 'bg-gray-300 border border-black' : 'bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800'}`}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === "Out Of Stock"}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
