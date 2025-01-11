import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LiveStream = () => {
  const [stream, setStream] = useState(null);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
  useEffect(() => {
    axios.get(`${apiBaseUrl}/api/live-stream`)
      .then(response => setStream(response.data))
      .catch(err => console.error('Error fetching live stream:', err));
    
  }, []);

  if (!stream) return <div>Loading live stream...</div>;

  return (
    <div>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${stream.id}`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <div>
        <h3>{stream.title}</h3>
        <button>Buy Now</button>
      </div>
    </div>
  );
};

export default LiveStream;
