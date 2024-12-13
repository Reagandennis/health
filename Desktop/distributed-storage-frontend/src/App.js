import React, { useRef } from 'react';
import navbar from './componets/navbar';
import Header from './componets/Header';
import Hero from './componets/Hero';
import Features from './componets/Features';
import Graphs from './componets/Graphs';
import Testimonials from './componets/Testimonials';
import Footer from './componets/Footer';
import './styles/App.css';

function App() {
  const uploadSectionRef = useRef(null);

  const scrollToUpload = () => {
    if (uploadSectionRef.current) {
      uploadSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="App font-poppins text-white">
      <navbar />
      <Header />
      <Hero scrollToUpload={scrollToUpload} />
      <div ref={uploadSectionRef} className="py-16 bg-gray-800">
        <h2 className="text-3xl font-bold mb-4">Upload Your Files</h2>
        <p className="mb-4">Start uploading files to the cloud storage system.</p>
        {/* Add file uploading form or feature here */}
        <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Upload Now
        </button>
      </div>
      <Features />
      <Graphs />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default App;
