import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ScanRedirect.css';

const ScanRedirect = () => {
  const { shortId } = useParams();

  useEffect(() => {
    // Get the backend URL
    const backendUrl = process.env.REACT_APP_API_URL 
      ? process.env.REACT_APP_API_URL.replace('/api', '') 
      : window.location.origin;
    
    // Redirect to the backend scan endpoint
    // The backend will track the scan and redirect to the destination URL
    const scanUrl = `${backendUrl}/api/scan/${shortId}`;
    
    console.log('🔄 Redirecting to scan endpoint:', scanUrl);
    window.location.href = scanUrl;
  }, [shortId]);

  return (
    <div className="redirect-container">
      <div className="redirect-card">
        <div className="spinner"></div>
        <h2>Redirecting...</h2>
        <p>Please wait while we redirect you to your destination</p>
      </div>
    </div>
  );
};

export default ScanRedirect;
