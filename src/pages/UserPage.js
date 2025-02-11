import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import LiveStreamCard from "../components/LiveStreamCard";

const UserPage = () => {
    const { id } = useParams();
    const [influencer, setInfluencer] = useState(null);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    
    useEffect(() => {
        const fetchInfluencer = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/api/auth/profiles/${id}`);
                setInfluencer(response.data);
            } catch (error) {
                console.error("Error fetching influencer details:", error);
            }
        };

        fetchInfluencer();
    }, [id]);

    if (!influencer) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    return (
        <div className=" mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg">
            {/* Profile Section */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Left - Profile Picture */}
                <div className="flex flex-col items-center">
                    <img 
                        src={`${apiBaseUrl}${influencer.user.profilePicture}`} 
                        alt={influencer.user.name} 
                        className="w-80 h-80 rounded-full border-4 border-purple-400 ml-20"
                    />
                </div>

                {/* Right - Influencer Info */}
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">{influencer.user.name}</h1>
                    <p className="text-gray-600 mt-2">{influencer.user.bio || "No bio available"}</p>

                    {/* Social Media Links */}
                    <div className="flex gap-4 mt-4">
                        {/* {influencer.instagram && ( */}
                            <a href={influencer.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 text-2xl">
                                <FaInstagram />
                            </a>
                        {/* )} */}
                        {/* {influencer.twitter && ( */}
                            <a href={influencer.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-2xl">
                                <FaTwitter />
                            </a>
                        {/* )} */}
                        {/* {influencer.youtube && ( */}
                            <a href={influencer.youtube} target="_blank" rel="noopener noreferrer" className="text-red-500 text-2xl">
                                <FaYoutube />
                            </a>
                        {/* )} */}
                    </div>
                </div>
            </div>

            {/* Video Section */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold border-b pb-2">Videos</h2>
                {influencer.livestreams && influencer.livestreams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        {influencer.livestreams.map((video) => (
                          <LiveStreamCard stream={video} apiBaseUrl={apiBaseUrl}/>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 mt-4">No videos available.</p>
                )}
            </div>
        </div>
    );
};

export default UserPage;
