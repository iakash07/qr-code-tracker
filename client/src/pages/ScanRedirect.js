import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ScanRedirect.css';

const ScanRedirect = () => {
  const { shortId } = useParams();

  useEffect(() => {
    // Directly redirect to the backend scan endpoint
    // The backend will track the scan and redirect to the destination URL
    window.location.href = `/api/scan/${shortId}`;
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
