import axios from 'axios';
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${apiBaseUrl}/api/messages/`;

const sendMessage = async (sender, receiver, content) => {
  const response = await axios.post(API_URL, { sender, receiver, content });
  return response.data;
};
const getMessages = async (sender, receiver) => {
  const response = await axios.get(`${API_URL}${sender}/${receiver}`);
  return response.data;
};
export default { sendMessage, getMessages };