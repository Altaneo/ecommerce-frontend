import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@mui/styles';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { formatCategories } from '../utils/comman';

// Define the styles using makeStyles
const useStyles = makeStyles((theme) => ({
  landingPage: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  heading: {
    color: '#333',
    fontSize: '2rem',
    marginBottom: '20px',
  },
  sectionHeading: {
    color: '#444',
    fontSize: '1.5rem',
    marginBottom: '10px',
  },
  imageCarousel: {
    marginBottom: '30px',
    '& img': {
      width: '100%',
      height: '500px',
      objectFit: 'cover',
      borderRadius: '8px',
    },
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    flexGrow: 1,
  },
  item: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    width: '100%', // Ensure responsiveness
    maxWidth: '300px', // Limit the max width of the card
    textAlign: 'center',
    boxSizing: 'border-box',
    margin: '0 auto', // Center the card
  },
  iframe: {
    width: '100%',
    height: '200px',
    borderRadius: '8px',
    border: 'none',
  },
  cardHeader: {
    backgroundColor: '#007bff', // Blue background
    color: 'white', // White text
    padding: '10px 15px',
    fontSize: '1.25rem',
    borderRadius: '5px 5px 0 0', // Rounded corners at the top
  },
  button: {
    marginTop: '10px',
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  image: {
    width: '200px',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  rating: {
    color: '#ffb400',
    fontSize: '1rem',
    marginBottom: '5px',
  },
  productCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center',
  },
  productImage: {
    width: '100%',
    height: '250px',
    borderRadius: '8px',
  },
}));
const carouselImages = [
  '/images/poster1.jpg', // Replace with your image URLs
  '/images/poster5.png',
  '/images/poster2.png',
];
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};
function LandingPage() {
  const classes = useStyles(); // Using the useStyles hook
  const [liveStreams, setLiveStreams] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const authenticateWithYouTube = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/auth/youtube`, {
          withCredentials: true, // Important if you're using sessions
        });
        // Redirect the user to the auth URL
        window.location.href = response.data.authUrl; // Assuming your backend sends the auth URL
      } catch (error) {
        console.error('Error initiating authentication:', error);
      }
    };

    const fetchLiveStreams = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/live-stream`);
        setLiveStreams(response.data);
      } catch (err) {
        console.error('Error fetching live streams:', err);
      }
    };

    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/featureProducts`);
        setFeaturedProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    // First authenticate with YouTube
    authenticateWithYouTube()
      .then(() => {
        // After successful authentication, fetch live streams and featured products
        fetchLiveStreams();
        fetchFeaturedProducts();
      });
  }, [apiBaseUrl]);


  const handleAddToCart = async (product) => {
    try {
      const response = await axios.post('http://localhost:5000/api/cart/add', {
        productId: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        rating: product.rating,
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };
  console.log(liveStreams, "-----------liveStreams")
  return (
    <div className={classes.landingPage}>
      <header className={classes.header}>
        <h1 className={classes.heading}>Welcome to Altaneofin Shop</h1>
        <div className={classes.imageCarousel}>
          <Slider {...sliderSettings}>
            {carouselImages.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Banner ${index + 1}`} />
              </div>
            ))}
          </Slider>
        </div>
        <h2 className={classes.sectionHeading}>Upcoming Live Streams</h2>

        <div className={classes.container}>
          {liveStreams.length > 0 ? (
            liveStreams.map((stream) => (
              <div key={stream.id} className={classes.item}>
                <div className={classes.cardHeader}>
                  Live Status: {formatCategories(stream.snippet.liveBroadcastContent)}
                </div>
                <h3>{stream.snippet.title}</h3>
                <p>{stream.snippet.description}</p>
                <p>Start Time: {new Date(stream.snippet.publishTime).toLocaleString()}</p>
                <iframe
                  className={classes.iframe}
                  src={`https://www.youtube.com/embed/${stream.id.videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ))
          ) : (
            <p>No upcoming live streams available.</p>
          )}
        </div>
        <h2 className={classes.sectionHeading}>Featured Products</h2>

        <div className={classes.container}>
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <div key={product._id} className={classes.productCard}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={classes.productImage}
                />
                <h3>{product.name}</h3>
                <p>₹{product.price.toFixed(2)}</p>
                <p>Rating: {product.rating} ★</p>
                <button
                  className={classes.button}
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p>No featured products available.</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default LandingPage;
