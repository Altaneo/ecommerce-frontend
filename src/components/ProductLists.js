import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useTranslation } from "react-i18next";

function ProductFilter({ products, categories }) {
  const {t}=useTranslation()
  const [isVisible, setIsVisible] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isRatingsOpen, setIsRatingsOpen] = useState(false);
  const formatCategories = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  const [filters, setFilters] = useState({
    category: [],
    priceRange: [0, 1000],
    rating: "",
  });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const apiBaseUrl =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      filters.category.length === 0 || filters.category.includes(product.type);
    const priceMatch =
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1];
    const ratingMatch =
      !filters.rating || product.rating >= parseInt(filters.rating, 10);
    return categoryMatch && priceMatch && ratingMatch;
  });
  return (
    <div className="p-5 mt-24">
      <div className="block md:hidden">
        <div
          className="bg-purple-800 text-white p-4 rounded-lg flex justify-between items-center cursor-pointer"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <span className="text-xl font-bold">{t("FILTER")}</span>
          <span>{isFilterOpen ? "-" : "+"}</span>
        </div>
        {isFilterOpen && (
          <div className="bg-white text-black p-4 rounded-lg w-full border border-purple-800 mt-2">
            <div className="mb-5">
              <div className="mb-8">
                <img
                  src="/images/sideImage.png"
                  alt={t("SIDEBAR_BANNER")}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div
                className="font-bold mb-2 cursor-pointer flex justify-between items-center"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              >
                {t("CATEGORIES")}
                <span className="text-purple-800">
                  {isCategoriesOpen ? "-" : "+"}
                </span>
              </div>
              <hr className="border-purple-800 mb-2" />
              {isCategoriesOpen && (
                <div>
                  {categories.map((category) => (
                    <div
                      key={category}
                      onClick={() => {
                        const newCategories = filters.category.includes(
                          category
                        )
                          ? filters.category.filter((c) => c !== category)
                          : [...filters.category, category];
                        setFilters((prev) => ({
                          ...prev,
                          category: newCategories,
                        }));
                      }}
                      className="flex items-center cursor-pointer mb-2"
                    >
                      <input
                        type="checkbox"
                        checked={filters.category.includes(category)}
                        readOnly
                        className="mr-2"
                      />
                      <label className="text-black">
                        {formatCategories(category)}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price Section */}
            <div className="mb-5">
              <div
                className="font-bold mb-2 cursor-pointer flex justify-between items-center"
                onClick={() => setIsPriceOpen(!isPriceOpen)}
              >
                 {t("PRICE")}
                <span className="text-purple-800">
                  {isPriceOpen ? "-" : "+"}
                </span>
              </div>
              <hr className="border-purple-800 mb-2" />
              {isPriceOpen && (
                <div className="flex justify-between">
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) => {
                      const minPrice = Math.max(0, Number(e.target.value));
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: [minPrice, prev.priceRange[1]],
                      }));
                    }}
                    className="border border-purple-800 rounded-lg p-2 w-28"
                    placeholder={t("MIN")}
                  />
                  <span className="mx-2">{t("TO")}</span>
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) => {
                      const maxPrice = Math.max(
                        filters.priceRange[0],
                        Number(e.target.value)
                      );
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: [prev.priceRange[0], maxPrice],
                      }));
                    }}
                    className="border border-purple-800 rounded-lg p-2 w-28"
                    placeholder={t("MAX")}
                  />
                </div>
              )}
            </div>

            {/* Customer Ratings Section */}
            <div>
              <div
                className="font-bold mb-2 cursor-pointer flex justify-between items-center"
                onClick={() => setIsRatingsOpen(!isRatingsOpen)}
              >
                {t("CUSTOMER_RATING")}
                <span className="text-purple-800">
                  {isRatingsOpen ? "-" : "+"}
                </span>
              </div>
              <hr className="border-purple-800 mb-2" />
              {isRatingsOpen && (
                <div>
                  {["4", "3", "2", "1"].map((rating) => (
                    <div
                      key={rating}
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, rating }))
                      }
                      className="flex items-center cursor-pointer mb-2"
                    >
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === rating}
                        readOnly
                        className="mr-2"
                      />
                      <label className="text-black">{rating}★ & {t("ABOVE")}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-5">
      <div className="hidden md:block bg-white text-black p-4 rounded-lg w-72 border border-purple-800 h-screen sticky top-0 overflow-y-auto">
          <div className="font-bold mb-2 text-4xl text-center">{t("FILTER")}</div>
          <hr className="border-purple-800 mb-2" />
          <div className="mb-5">
            <div className="mb-8">
              <img
                src="/images/sideImage.png"
                alt={t("SIDEBAR_BANNER")}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div
              className="font-bold mb-2 cursor-pointer flex justify-between items-center"
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            >
              {t("CATEGORIES")}
              <span className="text-purple-800">
                {isCategoriesOpen ? "-" : "+"}
              </span>
            </div>
            <hr className="border-purple-800 mb-2" />
            {isCategoriesOpen && (
              <div>
                {categories.map((category) => (
                  <div
                    key={category}
                    onClick={() => {
                      const newCategories = filters.category.includes(category)
                        ? filters.category.filter((c) => c !== category)
                        : [...filters.category, category];
                      setFilters((prev) => ({
                        ...prev,
                        category: newCategories,
                      }));
                    }}
                    className="flex items-center cursor-pointer mb-2"
                  >
                    <input
                      type="checkbox"
                      checked={filters.category.includes(category)}
                      readOnly
                      className="mr-2"
                    />
                    <label className="text-black">
                      {t(formatCategories(category).toUpperCase())}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Section */}
          <div className="mb-5">
            <div
              className="font-bold mb-2 cursor-pointer flex justify-between items-center"
              onClick={() => setIsPriceOpen(!isPriceOpen)}
            >
              {t("PRICE")}
              <span className="text-purple-800">{isPriceOpen ? "-" : "+"}</span>
            </div>
            <hr className="border-purple-800 mb-2" />
            {isPriceOpen && (
              <div className="flex justify-between">
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => {
                    const minPrice = Math.max(0, Number(e.target.value));
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: [minPrice, prev.priceRange[1]],
                    }));
                  }}
                  className="border border-purple-800 rounded-lg p-2 w-28"
                  placeholder={t("MIN")}
                />
                <span className="mx-2">to</span>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => {
                    const maxPrice = Math.max(
                      filters.priceRange[0],
                      Number(e.target.value)
                    );
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: [prev.priceRange[0], maxPrice],
                    }));
                  }}
                  className="border border-purple-800 rounded-lg p-2 w-28"
                  placeholder={t("MAX")}
                />
              </div>
            )}
          </div>

          {/* Customer Ratings Section */}
          <div>
            <div
              className="font-bold mb-2 cursor-pointer flex justify-between items-center"
              onClick={() => setIsRatingsOpen(!isRatingsOpen)}
            >
              {t("CUSTOMER_RATING")}
              <span className="text-purple-800">
                {isRatingsOpen ? "-" : "+"}
              </span>
            </div>
            <hr className="border-purple-800 mb-2" />
            {isRatingsOpen && (
              <div>
                {["4", "3", "2", "1"].map((rating) => (
                  <div
                    key={rating}
                    onClick={() => setFilters((prev) => ({ ...prev, rating }))}
                    className="flex items-center cursor-pointer mb-2"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === rating}
                      readOnly
                      className="mr-2"
                    />
                    <label className="text-black">{rating}★ & {t("ABOVE")}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="relative flex flex-col items-center justify-center min-h-screen">
            <div ref={sectionRef} className="flex flex-wrap justify-center">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <ProductCard
                    imageUrl={product.image}
                    product={product}
                    key={index}
                    isVisible={isVisible}
                  />
                ))
              ) : (
                <p className="text-gray-500">{t("NO_PRODUCTS_FOUND")}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductFilter;
