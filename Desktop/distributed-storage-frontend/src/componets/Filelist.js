import React, { useEffect, useState } from 'react';
import { fetchFiles } from '../api/files';

const FileList = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchFiles();
      setFiles(response.data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Your Files</h1>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            {file.name} - {file.size} bytes
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
