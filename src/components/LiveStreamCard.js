import { Link } from "react-router-dom";

const LiveStreamCard = ({ stream, apiBaseUrl,link }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <a
        href={`https://www.youtube.com/watch?v=${stream.streamId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="relative w-full h-56 bg-black overflow-hidden group">
          <iframe
            className="absolute top-0 left-0 w-full h-full transition-transform duration-300 transform group-hover:scale-105"
            src={`https://www.youtube.com/embed/${stream.streamId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={stream.title}
          ></iframe>
        </div>
      </a>
      <div className="p-4">
        <Link to={link} className="hover:underline text-lg font-semibold">
          {stream.title}
        </Link>
        <p className="text-gray-700 text-sm mb-2 line-clamp-3">{stream.description}</p>
        <p className="text-gray-600 text-xs">
          Start Time: {new Date(stream.startTime).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default LiveStreamCard;
