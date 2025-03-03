import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

const ProductDetails = () => {
  const { id } = useParams();
 const { t, i18n } = useTranslation();
 const currentLang = i18n.language || "en";
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBaseUrl =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${apiBaseUrl}/api/products/${id}`
        );
        setProduct(response.data);
        setReviews(response.data.reviews || []);
        setAverageRating(response.data.averageRating || response.data.rating);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async (product) => {
        try {
          const existingItemResponse = await axios.get(`${apiBaseUrl}/api/cart/${product._id}`);
          const existingItem = existingItemResponse.data;
          if (existingItem) {
            const updatedQuantity = existingItem.quantity + 1;
            const updateResponse = await axios.put(`${apiBaseUrl}/api/cart/update/${product._id}`, {
              quantity: updatedQuantity,
            });
            alert(updateResponse.data.message || `${t("PRODUCT_QUANTITY")}`);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            try {
              const addResponse = await axios.post(`${apiBaseUrl}/api/cart/add`, {
                id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image,
                type: product.type,
                rating: product.rating,
                stage: 'AddedToCart',
                quantity: 1,
              });
              alert(addResponse.data.message || `${t("PRODUCT_ADDED")}`);
            } catch (addError) {
              alert(`${t("FAILED_ADD_CART")}`);
            }
          } else {
            console.error(`${t("FAILED_ADD_CART")}`, error);
            alert(`${t("FAILED_ADD_CART")}`);
          }
        }
  };

  const handleAddReview = async () => {
        try {
            const response = await axios.post(`${apiBaseUrl}/api/products/${id}/reviews`, {
                review: newReview,
                rating: newRating,
            });
            const updatedReview = response.data;

            // Update the reviews and average rating in state
            setReviews((prevReviews) => [...prevReviews, updatedReview]);
            setAverageRating(updatedReview.newAverageRating);

            // Clear input fields
            setNewReview('');
            setNewRating(0);

            alert(`${t('REVIEW_SUBMITTED')}`);
        } catch (err) {
            console.error(err);
            alert(`${t('REVIEW_FAILED')}`);
        }
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <svg
          key={index}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 ${
            index < rating ? "text-yellow-500" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927a1 1 0 011.902 0l1.285 4.153a1 1 0 00.95.69h4.373a1 1 0 01.592 1.806l-3.542 2.58a1 1 0 00-.364 1.118l1.285 4.153a1 1 0 01-1.541 1.118L10 14.347l-3.542 2.58a1 1 0 01-1.541-1.118l1.285-4.153a1 1 0 00-.364-1.118L2.796 9.576a1 1 0 01.592-1.806h4.373a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto mt-32 p-6 overflow-hidden">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <img
            src={`${apiBaseUrl}${product.image}`}
            alt={product.name[currentLang]}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold">{product.name[currentLang]}</h1>
          <p className="text-lg text-gray-600 mt-2">{product.description[currentLang]}</p>
          <p className="text-2xl font-semibold mt-4">₹{product.price}</p>
          <button
            className="mt-4 bg-purple-600 text-white py-2 px-4 rounded w-full md:w-auto"
            onClick={() => handleAddToCart(product)}
          >
            {t("ADD_TO_CART")}
          </button>
          <div className="mt-8">
            <h2 className="text-2xl font-bold">{t("REVIEWS")}</h2>
            <div className="mt-2 flex items-center">
              <span className="mr-2">{t("AVERAGE_RATING")}:</span>
              <div className="flex">
                {Array.from({ length: 5 }, (_, index) => (
                  <svg
                    key={index}
                    className={`h-6 w-6 ${
                      index < Math.round(averageRating)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927a1 1 0 011.902 0l1.285 4.153a1 1 0 00.95.69h4.373a1 1 0 01.592 1.806l-3.542 2.58a1 1 0 00-.364 1.118l1.285 4.153a1 1 0 01-1.541 1.118L10 14.347l-3.542 2.58a1 1 0 01-1.541-1.118l1.285-4.153a1 1 0 00-.364-1.118L2.796 9.576a1 1 0 01.592-1.806h4.373a1 1 0 00.95-.69L9.049 2.927z" />
                  </svg>
                ))}
              </div>
            </div>
            <div className="mt-4">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="py-4 border-b">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{review.userName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="mt-1">{review.review}</p>
                    <div className="flex mt-2">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                ))
              ) : (
                <p>{t("NO_REVIEWS")}</p>
              )}
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold">{t("ADD_REVIEW")}</h3>
              <textarea
                className="w-full border p-2 rounded mt-2"
                rows="4"
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder={t("WRITE_YOUR_REVIEW")}
              ></textarea>
              <div className="flex mt-4">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <svg
                      key={index}
                      onClick={() => setNewRating(index + 1)}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 cursor-pointer ${
                        index < newRating ? "text-yellow-500" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927a1 1 0 011.902 0l1.285 4.153a1 1 0 00.95.69h4.373a1 1 0 01.592 1.806l-3.542 2.58a1 1 0 00-.364 1.118l1.285 4.153a1 1 0 01-1.541 1.118L10 14.347l-3.542 2.58a1 1 0 01-1.541-1.118l1.285-4.153a1 1 0 00-.364-1.118L2.796 9.576a1 1 0 01.592-1.806h4.373a1 1 0 00.95-.69L9.049 2.927z" />
                    </svg>
                  ))}
              </div>
              <button
                className="mt-4 bg-purple-600 text-white py-2 px-4 rounded w-full md:w-auto"
                onClick={handleAddReview}
              >
                {t("SUBMIT_REVIEW")}
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
  );
  
};

export default ProductDetails;
