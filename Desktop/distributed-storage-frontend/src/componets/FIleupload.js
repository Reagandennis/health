import React, { useState } from 'react';
import './FileUpload.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setUploadStatus('');
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    setUploadStatus('Uploading...');
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate upload
    setUploadStatus(`File "${file.name}" uploaded successfully.`);
  };

  return (
    <div className="file-upload">
      <h2>Upload Your File</h2>
      <input type="file" onChange={handleFileChange} className="file-input" />
      <button onClick={handleUpload} className="upload-button">
        Upload
      </button>
      <p className="upload-status">{uploadStatus}</p>
    </div>
  );
};

export default FileUpload;
