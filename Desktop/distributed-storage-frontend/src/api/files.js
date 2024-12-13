import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const fetchFiles = async () => {
  return await axios.get(`${API_BASE_URL}/files`);
};
