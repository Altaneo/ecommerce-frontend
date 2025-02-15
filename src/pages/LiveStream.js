import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const LivestreamForm = () => {
  const navigate = useNavigate();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const [broadcastId, setBroadcastId] = useState(null); // Store the broadcast ID
  const [liveChatId, setLiveChatId] = useState("");
  const [streamKey, setStreamKey] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [livestream, setLivestream] = useState({
    title: "",
    description: "",
    streamId: "",
    thumbnail: "",
    startTime: "",
  });
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [manualProducts, setManualProducts] = useState([
    {
      name: "",
      description: "",
      price: "",
      type: "",
      brand: "",
      image: "",
      category: "",
    },
  ]);
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    if (name === "thumbnail") {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("profilePicture", file);

        try {
          const response = await axios.post(
            `${apiBaseUrl}/upload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.data.success) {
            setLivestream((prev) => ({
              ...prev,
              ["thumbnail"]: response.data.imageUrl,
            }));
            alert("Image uploaded successfully!");
          } else {
            alert("Failed to upload image.");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Failed to upload image.");
        }
      }
    }
    if (name !== "thumbnail") {
      setLivestream((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleManualProductChange = async (index, e) => {
    const { name, value, files } = e.target;

    setManualProducts((prevProducts) => {
      // Ensure prevProducts is always an array
      const updatedProducts = prevProducts ? [...prevProducts] : [];

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

      // For non-image fields, update normally
      updatedProducts[index] = { ...updatedProducts[index], [name]: value };
      return updatedProducts;
    });
  };
  const addManualProduct = () => {
    setManualProducts([
      ...manualProducts,
      {
        name: "",
        description: "",
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
    try {
      const response = await fetch(`${apiBaseUrl}/start-stream`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: livestream.title,
          description: livestream.description,
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
      localStorage.setItem("rtmpUrl", data.rtmpUrl);
      localStorage.setItem("liveChatId", data.liveChatId);

      console.log("Stream started:", data);
    } catch (error) {
      console.error("Error starting stream:", error);
      alert(error.message);
    }
  };
  const handleSubmit = async (e) => {
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
        status: "live",
        streamId: broadcastId,
        liveChatId:liveChatId,
        products: allProducts,
      });

      // Reset form
      setLivestream({
        title: "",
        description: "",
        streamId: "",
        thumbnail: "",
        startTime: "",
      });
      setSelectedProducts([]);
      setManualProducts([
        {
          name: "",
          description: "",
          price: "",
          _id: "",
          stock: "",
          type: "",
          brand: "",
          image: "",
          category: "",
        },
      ]);
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
        title: "",
        description: "",
        streamId: "",
        thumbnail: "",
        startTime: "",
      });
      setSelectedProducts([]);
      setManualProducts([
        {
          name: "",
          description: "",
          price: "",
          _id: "",
          stock: "",
          type: "",
          brand: "",
          image: "",
          category: "",
        },
      ]);
      navigate(`/home`);
    } catch (error) {
      console.error("Error creating livestream:", error);
    }
  };
  return (
    <>
      {!broadcastId ? (
        <form
          onSubmit={startLiveStream}
          className="max-w-3xl mx-auto m-40 p-4 bg-white rounded shadow-md"
        >
          {" "}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={livestream.title}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={livestream.description}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Thumbnail URL
            </label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*" // Optional: This restricts file selection to images
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Start Time
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
            Start Live Stream
          </button>
        </form>
      ) : (
        <div>
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto m-40 p-4 bg-white rounded shadow-md"
          >
            <h2 className="text-2xl font-bold mb-4">Go Live</h2>

            {/* Livestream Details */}
            <h3>Use These Key For Streaming</h3>
            <p>StreamKey:{streamKey || ""}</p>
            <p>StreamUrl:{streamUrl || ""}</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Stream ID
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

            {/* Select Existing Products */}
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">
                Select Existing Products
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

            {/* Manual Product Entry */}
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Manual Product Entry</h3>
              {manualProducts.map((product, index) => (
                <div key={index} className="border rounded p-4 mb-2">
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={product.name}
                      onChange={(e) => handleManualProductChange(index, e)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={product.description}
                      onChange={(e) => handleManualProductChange(index, e)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Product ID
                    </label>
                    <input
                      type="text"
                      name="_id"
                      value={product._id}
                      onChange={(e) => handleManualProductChange(index, e)}
                      required
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Stock
                    </label>
                    <input
                      type="text"
                      name="stock"
                      value={product.stock}
                      onChange={(e) => handleManualProductChange(index, e)}
                      required
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={product.price}
                      onChange={(e) => handleManualProductChange(index, e)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <input
                      type="text"
                      name="type"
                      value={product.type}
                      onChange={(e) => handleManualProductChange(index, e)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Brand
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
                      Image Upload
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*" // Optional: This restricts file selection to images
                      onChange={(e) => handleManualProductChange(index, e)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={product.category}
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
                Add Another Product
              </button>
            </div>

            <button
              type="submit"
              className="w-full mt-1 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800"
            >
              Go Live
            </button>
            <button
              onClick={scheduleLive}
              className="w-full mt-3 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800"
            >
              Schedule Live Stream
            </button>
          </form>
        </div>
      )}
      </>
  );
};

export default LivestreamForm;
