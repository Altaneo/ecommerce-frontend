import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const categories = {
  homegoods: ['sofa', 'table', 'chair', 'bed', 'clock', 'cupboard'],
  electronics: ['phone', 'watch', 'laptop', 'tv', 'soundSystem', 'tablet', 'game'],
  beauty: ['makeup', 'cream', 'hairdryer', 'shampoo'],
  fashion: ['jacket', 'jeans', 'tshirt', 'shirt', 'hat', 'scarf', 'sweater', 'sunGlasses'],
};
const LivestreamForm = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const navigate = useNavigate();

  const apiBaseUrl =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const [broadcastId, setBroadcastId] = useState(null); // Store the broadcast ID
  const [liveChatId, setLiveChatId] = useState("");
  const [streamKey, setStreamKey] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
   const [categorySelections, setCategorySelections] = useState([""]);
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
      stock: "In Stock",
      category: "",
    },
  ]);
  useEffect(() => {
    // Retrieve broadcastId from local storage on component mount
    const id = localStorage.getItem("broadcastId");
    setBroadcastId(id);
  }, []);
  const handleInputChange = async (e) => {
    const { name, value, dataset, type, files } = e.target;
  
    if (name === "thumbnail" && type === "file") {
      const file = files[0];
      if (file) {
        const formData = new FormData();
        formData.append("profilePicture", file);
  
        try {
          const response = await axios.post(`${apiBaseUrl}/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
  
          if (response.data.success) {
            setLivestream((prev) => ({
              ...prev,
              ["thumbnail"]: response.data.imageUrl,
            }));
            alert(t("IMAGE_UPLOADED"));
          } else {
            alert(t("FAILED_TO_UPLOAD"));
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          alert(t("FAILED_TO_UPLOAD"));
        }
      }
    } else if (dataset.lang) {
      // Handling multilingual title and description updates
      const lang = dataset.lang;
  
      setLivestream((prev) => ({
        ...prev,
        [name]: {
          ...(prev[name] || {}), // Ensure the previous object exists
          [lang]: value,
        },
      }));
    } else {
      setLivestream((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  

  const handleManualProductChange = (index, e) => {
    const { name, value, dataset,files } = e.target;
    const updatedProducts = [...manualProducts];

    if (dataset.lang) {
      // Handle localized fields
      const lang = dataset.lang;
      updatedProducts[index] = {
        ...updatedProducts[index],
        [name]: {
          ...updatedProducts[index][name],
          [lang]: value,
        },
      };
    } else {
      if (name === "image" && files && files[0]) {
        const file = files[0];
        const formData = new FormData();
        formData.append("profilePicture", file);

        axios
          .post(`${apiBaseUrl}/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((response) => {
            if (response.data.success) {
              // Ensure manualProducts is correctly updated
              const newProducts = [...updatedProducts];
              newProducts[index] = {
                ...newProducts[index],
                image: response.data.imageUrl,
              };
              setManualProducts(newProducts);
            } else {
              alert("Failed to upload image.");
            }
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
            alert("Failed to upload image.");
          });

        return updatedProducts; // Return existing state to prevent React errors
      }
      updatedProducts[index] = {
        ...updatedProducts[index],
        [name]: value,
      };
    }

    setManualProducts(updatedProducts);
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
      },
    ]);
  };
  const handleProductSelect = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };
  const startLiveStream = async (e) => {
    e.preventDefault();
    console.log(e,livestream,"------------livestream")
    try {
      const response = await fetch(`${apiBaseUrl}/start-stream`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: {
            en: livestream.title.en,
            hi: livestream.title.hi,
            ta: livestream.title.ta,
            gu: livestream.title.gu,
          },
          description: {
            en: livestream.description.en,
            hi: livestream.description.hi,
            ta: livestream.description.ta,
            gu: livestream.description.gu,
          },
          scheduledStartTime: livestream.startTime,
          thumbnailUrl: e.target.thumbnail.files[0], // Schedule start time
        }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to start stream");
  
      setBroadcastId(data.broadcastId);
      setLiveChatId(data.liveChatId);
      setStreamUrl(data.streamUrl);
      setStreamKey(data.streamKey);
      localStorage.setItem("broadcastId", data.broadcastId);
      localStorage.setItem("streamKey", data.streamKey);
      localStorage.setItem("streamUrl", data.streamUrl);
    } catch (error) {
      alert(error.message);
    }
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
        status: "live",
        streamId: broadcastId,
        liveChatId:liveChatId,
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
      localStorage.removeItem("broadcastId");
      localStorage.removeItem("streamKey");
      localStorage.removeItem("streamUrl");
      
      navigate(`/video/live/${response.data.streamId}`);
    } catch (error) {
      console.error("Error creating livestream:", error);
    }
  };
  const scheduleLive = async (e) => {
    e.preventDefault();
    try {
      const allProducts = [
        ...manualProducts,
        ...selectedProducts.map((id) =>
          products.find((product) => product._id === id)
        ),
      ].filter(Boolean);

      const response = await axios.post(`${apiBaseUrl}/live/add`, {
        ...livestream,
        status: "upcoming",
        products: allProducts,
      });

      // Reset form
      setLivestream({
        title: { en: "", hi: "", ta: "", gu: "" },
        description: { en: "", hi: "", ta: "", gu: "" },
        streamId: "",
        thumbnail: "",
        startTime: "",
      });
      setSelectedProducts([]);
      setManualProducts([
        {
          name: { en: "", hi: "", ta: "", gu: "" },
          description: { en: "", hi: "", ta: "", gu: "" },
          price: "",
          stock: "",
          type: "",
          brand: "",
          image: "",
          category: "",
        },
      ]);
      localStorage.removeItem("broadcastId");
      localStorage.removeItem("streamKey");
      localStorage.removeItem("streamUrl");
      navigate(`/home`);
    } catch (error) {
      console.error("Error creating livestream:", error);
    }
  };
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
  return (
    <>
      {!broadcastId ? (
        <form
          onSubmit={startLiveStream}
          className="max-w-3xl mx-auto m-40 p-4 bg-white rounded shadow-md"
        >
          {["en", "hi", "ta", "gu"].map((lang) => (
            <div key={lang} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {t("TITLE")} ({lang.toUpperCase()})
              </label>
              <input
                type="text"
                name="title"
                data-lang={lang} // Add data attribute to identify the language
                value={livestream.title[lang]}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
              <label className="block text-sm font-medium text-gray-700">
                {t("DESCRIPTION")} ({lang.toUpperCase()})
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
              {t("THUMBNAIL_URL")}
            </label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
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
          <button
            type="submit"
            className="w-full mt-1 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800"
          >
            {t("START_LIVE_STREAM")}
          </button>
        </form>
      ) : (
        <div>
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto m-40 p-4 bg-white rounded shadow-md"
          >
            <h2 className="text-2xl font-bold mb-4">{t("GO_LIVE")}</h2>

            <h3>{t("USE_THESE_KEYS_FOR_STREAMING")}</h3>
            <p>
              {t("STREAM_KEY")}: {streamKey || ""}
            </p>
            <p>
              {t("STREAM_URL")}: {streamUrl || ""}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {t("STREAM_ID")}
              </label>
              <input
                type="text"
                name="streamId"
                value={broadcastId}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">
                {t("SELECT_EXISTING_PRODUCTS")}
              </h3>
              {products.map((product) => (
                <div key={product._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={product._id}
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => handleProductSelect(product._id)}
                    className="mr-2"
                  />
                  <label htmlFor={product._id} className="text-sm">
                    {product.name}
                  </label>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">
                {t("MANUAL_PRODUCT_ENTRY")}
              </h3>
              {manualProducts.map((product, index) => (
                <div key={index} className="border rounded p-4 mb-2">
                  {["en", "hi", "ta", "gu"].map((lang) => (
                    <div key={lang} className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {t("PRODUCT_NAME")} ({lang.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        name="name"
                        data-lang={lang}
                        value={product.name[lang]}
                        onChange={(e) => handleManualProductChange(index, e)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      />
                      <label className="block text-sm font-medium text-gray-700">
                        {t("DESCRIPTION")} ({lang.toUpperCase()})
                      </label>
                      <textarea
                        name="description"
                        data-lang={lang}
                        value={product.description[lang]}
                        onChange={(e) => handleManualProductChange(index, e)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  ))}
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
                        <option value="Out of Stock">
                          {t("OUT_OF_STOCK")}
                        </option>
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
                          ))}
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
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t("IMAGE_UPLOAD")}
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*" // Optional: This restricts file selection to images
                      onChange={(e) => handleManualProductChange(index, e)}
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
              className="w-full mt-1 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800"
            >
              {t("GO_LIVE")}
            </button>
            <button
              onClick={scheduleLive}
              className="w-full mt-3 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800"
            >
              {t("SCHEDULE_LIVE_STREAM")}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default LivestreamForm;
