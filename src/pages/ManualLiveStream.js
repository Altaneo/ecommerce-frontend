import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";

const categories = {
  homegoods: ['sofa', 'table', 'chair', 'bed', 'clock', 'cupboard'],
  electronics: ['phone', 'watch', 'laptop', 'tv', 'soundSystem', 'tablet', 'game'],
  beauty: ['makeup', 'cream', 'hairdryer', 'shampoo'],
  fashion: ['jacket', 'jeans', 'tshirt', 'shirt', 'hat', 'scarf', 'sweater', 'sunGlasses'],
};

const LivestreamForm = () => {
  const navigate = useNavigate();
  const apiBaseUrl =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const [livestream, setLivestream] = useState({
    title: { en: "", hi: "", ta: "", gu: "" },
    description: { en: "", hi: "", ta: "", gu: "" },
    streamId: "",
    thumbnail: "",
    startTime: "",
  });
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [manualProducts, setManualProducts] = useState([
    {
      name: { en: "", hi: "", ta: "", gu: "" },
      description: { en: "", hi: "", ta: "", gu: "" },
      price: "",
      type: "",
      brand: "",
      image: "",
      category: "",
      stock: "In Stock",
    },
  ]);
  
  const [categorySelections, setCategorySelections] = useState([""]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [apiBaseUrl]);

  const handleCategoryChange = (index, e) => {
    const newCategory = e.target.value;
    
    // Update category selections
    const newCategorySelections = [...categorySelections];
    newCategorySelections[index] = newCategory;
    setCategorySelections(newCategorySelections);
    
    // Update product with new category
    const updatedProducts = [...manualProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      category: newCategory,
      // Reset type when category changes
      type: ""
    };
    setManualProducts(updatedProducts);
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    if (name === "thumbnail") {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("profilePicture", file);

        try {
          const response = await axios.post(`${apiBaseUrl}/upload`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.data.success) {
            setLivestream((prev) => ({
              ...prev,
              ["thumbnail"]: response.data.imageUrl,
            }));
            alert(t("IMAGE_UPLODED"));
          } else {
            alert(t("FAILED_TO_UPLOAD"));
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          alert(t("FAILED_TO_UPLOAD"));
        }
      }
    }
    if (name !== "thumbnail") {
      setLivestream((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e) => {
    const { name, files } = e.target;
    if (!files || !files[0]) return;
    
    const file = files[0];
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const response = await axios.post(`${apiBaseUrl}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setLivestream(prev => ({
          ...prev,
          [name]: response.data.imageUrl,
        }));
        alert(t("IMAGE_UPLOADED"));
      } else {
        alert(t("FAILED_TO_UPLOADED"));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(t("FAILED_TO_UPLOADED"));
    }
  };

  const handleManualProductChange = (index, e) => {
    const { name, value, dataset } = e.target;
    const updatedProducts = [...manualProducts];
    
    if (dataset.lang) {
      // Handle localized fields
      const lang = dataset.lang;
      updatedProducts[index] = {
        ...updatedProducts[index],
        [name]: {
          ...updatedProducts[index][name],
          [lang]: value
        }
      };
    } else {
      // Handle regular fields
      updatedProducts[index] = {
        ...updatedProducts[index],
        [name]: value
      };
    }
    
    setManualProducts(updatedProducts);
  };

  const handleProductImageUpload = async (index, e) => {
    const { files } = e.target;
    if (!files || !files[0]) return;
    
    const file = files[0];
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const response = await axios.post(`${apiBaseUrl}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        const updatedProducts = [...manualProducts];
        updatedProducts[index] = {
          ...updatedProducts[index],
          image: response.data.imageUrl,
        };
        setManualProducts(updatedProducts);
        alert(t("IMAGE_UPLOADED"));
      } else {
        alert(t("FAILED_TO_UPLOADED"));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(t("FAILED_TO_UPLOADED"));
    }
  };

  const addManualProduct = () => {
    setManualProducts([
      ...manualProducts,
      {
        name: { en: "", hi: "", ta: "", gu: "" },
        description: { en: "", hi: "", ta: "", gu: "" },
        price: "",
        type: "",
        brand: "",
        image: "",
        category: "",
        stock: "In Stock",
      },
    ]);
    setCategorySelections([...categorySelections, ""]);
  };

  const handleProductSelect = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Combine manual and selected products
      const allProducts = [
        ...manualProducts.map(product => ({
          ...product,
          price: parseFloat(product.price) // Ensure price is a number
        })),
        ...selectedProducts.map(id => 
          products.find(product => product._id === id)
        ),
      ].filter(Boolean);

      const livestreamPayload = {
        ...livestream,
        products: allProducts,
      };

      const response = await axios.post(`${apiBaseUrl}/live/add`, livestreamPayload);

      // Reset form on success
      setLivestream({
        title: { en: "", hi: "", ta: "", gu: "" },
        description: { en: "", hi: "", ta: "", gu: "" },
        streamId: "",
        thumbnail: "",
        startTime: "",
        endTime: "",
      });
      setSelectedProducts([]);
      setManualProducts([
        {
          name: { en: "", hi: "", ta: "", gu: "" },
          description: { en: "", hi: "", ta: "", gu: "" },
          price: "",
          type: "",
          brand: "",
          image: "",
          category: "",
          stock: "In Stock",
        },
      ]);
      setCategorySelections([""]);
      
      // Navigate to the created livestream
      navigate(`/livestream/${response.data.streamId}`);
    } catch (error) {
      console.error("Error creating livestream:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto m-40 p-4 bg-white rounded shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">{t("GO_LIVE")}</h2>

      {/* Livestream Details */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">{t("LIVESTREAM_DETAILS")}</h3>
        
        {/* Title & Description in multiple languages */}
        {["en", "hi", "ta", "gu"].map((lang) => (
          <div key={lang} className="mb-4 p-3 border rounded">
            <h4 className="font-medium mb-2">{t(`LANGUAGE_${lang.toUpperCase()}`)}</h4>
            
            <label className="block text-sm font-medium text-gray-700">
              {t("TITLE")}
            </label>
            <input
              type="text"
              name="title"
              data-lang={lang}
              value={livestream.title[lang]}
              onChange={handleInputChange}
              required={lang === "en"} // Only English is required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            
            <label className="block text-sm font-medium text-gray-700 mt-2">
              {t("DESCRIPTION")}
            </label>
            <textarea
              name="description"
              data-lang={lang}
              value={livestream.description[lang]}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {t("STREAM_ID")}
          </label>
          <input
            type="text"
            name="streamId"
            value={livestream.streamId}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {t("THUMBNAIL")}
          </label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleFileUpload}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {livestream.thumbnail && (
            <div className="mt-2">
              <img 
                src={livestream.thumbnail} 
                alt="Thumbnail preview" 
                className="h-20 w-auto object-cover"
              />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {t("START_TIME")}
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={livestream.startTime}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>



      {/* Manual Product Entry */}
      <div className="mb-4">
      <h3 className="text-lg font-medium mb-2">
                {t("MANUAL_PRODUCT_ENTRY")}
              </h3>
        
        {manualProducts.map((product, index) => (
          <div key={index} className="border rounded p-4 mb-4">
            <h4 className="font-medium mb-2">{t("PRODUCT")} #{index + 1}</h4>
            
            {/* Product details in multiple languages */}
            {["en", "hi", "ta", "gu"].map((lang) => (
              <div key={lang} className="mb-4 p-3 border rounded">
                <h5 className="font-medium mb-1">{t(`LANGUAGE_${lang.toUpperCase()}`)}</h5>
                
                <label className="block text-sm font-medium text-gray-700">
                  {t("PRODUCT_NAME")}
                </label>
                <input
                  type="text"
                  name="name"
                  data-lang={lang}
                  value={product.name[lang] || ""}
                  onChange={(e) => handleManualProductChange(index, e)}
                  required={lang === "en"} // Only English is required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
                
                <label className="block text-sm font-medium text-gray-700 mt-2">
                  {t("DESCRIPTION")}
                </label>
                <textarea
                  name="description"
                  data-lang={lang}
                  value={product.description[lang] || ""}
                  onChange={(e) => handleManualProductChange(index, e)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            ))}
            
            {/* Product common details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t("PRICE")}
                </label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={(e) => handleManualProductChange(index, e)}
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t("STOCK")}
                </label>
                <select
                  name="stock"
                  value={product.stock}
                  onChange={(e) => handleManualProductChange(index, e)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="In Stock">{t("IN_STOCK")}</option>
                  <option value="Out of Stock">{t("OUT_OF_STOCK")}</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("CATEGORY")}
                </label>
                <select
                  name="category"
                  value={categorySelections[index] || ""}
                  onChange={(e) => handleCategoryChange(index, e)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">{t("SELECT_CATEGORY")}</option>
                  {Object.keys(categories).map((cat) => (
                    <option key={cat} value={cat}>
                      {t(cat.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("TYPE")}
                </label>
                <select
                  name="type"
                  value={product.type}
                  onChange={(e) => handleManualProductChange(index, e)}
                  required
                  disabled={!categorySelections[index]}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">{t("SELECT_TYPE")}</option>
                  {categorySelections[index] && 
                    categories[categorySelections[index]].map((type) => (
                      <option key={type} value={type}>
                        {t(type.toUpperCase())}
                      </option>
                    ))
                  }
                </select>
              </div>
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("BRAND")}
              </label>
              <input
                type="text"
                name="brand"
                value={product.brand}
                onChange={(e) => handleManualProductChange(index, e)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("PRODUCT_IMAGE")}
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => handleProductImageUpload(index, e)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addManualProduct}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          {t("ADD_ANOTHER_PRODUCT")}
        </button>
      </div>

      <button
        type="submit"
        className="w-full mt-4 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        {t("GO_LIVE")}
      </button>
    </form>
  );
};

export default LivestreamForm;