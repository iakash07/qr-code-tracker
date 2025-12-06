import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQRByShortId } from '../services/api';
import './ScanRedirect.css';

const ScanRedirect = () => {
  const { shortId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const redirect = async () => {
      try {
        // Fetch QR code details
        const response = await getQRByShortId(shortId);
        const qrCode = response.data.data;

        if (!qrCode.isActive) {
          setError('This QR code has been deactivated');
          setLoading(false);
          return;
        }

        // Redirect to the scan tracking endpoint which will log the scan and redirect
        window.location.href = `/api/scan/${shortId}`;
      } catch (err) {
        console.error('Error:', err);
        setError('QR code not found');
        setLoading(false);
      }
    };

    redirect();
  }, [shortId]);

  if (loading) {
    return (
      <div className="redirect-container">
        <div className="redirect-card">
          <div className="spinner"></div>
          <h2>Redirecting...</h2>
          <p>Please wait while we redirect you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="redirect-container">
        <div className="redirect-card error-card">
          <h2>❌ Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default ScanRedirect;
