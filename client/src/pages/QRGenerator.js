import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQrcode, FaLink, FaFileAlt, FaDownload } from 'react-icons/fa';
import { generateQR } from '../services/api';
import { toast } from 'react-toastify';
import './QRGenerator.css';

const QRGenerator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: ''
  });
  const [generatedQR, setGeneratedQR] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.url) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      setLoading(true);
      const response = await generateQR(formData);
      setGeneratedQR(response.data.data);
      toast.success('QR Code generated successfully!');
      
      // Reset form
      setFormData({ url: '', title: '', description: '' });
    } catch (error) {
      console.error('Error generating QR:', error);
      toast.error(error.response?.data?.message || 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!generatedQR) return;

    const link = document.createElement('a');
    link.href = generatedQR.qrCodeData;
    link.download = `qr-${generatedQR.shortId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code downloaded!');
  };

  const copyShortUrl = () => {
    const shortUrl = `${window.location.origin}/s/${generatedQR.shortId}`;
    navigator.clipboard.writeText(shortUrl);
    toast.success('Short URL copied to clipboard!');
  };

  return (
    <div className="container">
      <div className="qr-generator-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <FaQrcode /> Generate QR Code
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>
                <FaLink /> Destination URL *
              </label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://example.com"
                required
              />
            </div>

            <div className="input-group">
              <label>
                <FaFileAlt /> Title (Optional)
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="My QR Code"
              />
            </div>

            <div className="input-group">
              <label>Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add a description for this QR code..."
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate QR Code'}
            </button>
          </form>
        </div>

        {generatedQR && (
          <div className="card qr-preview-card">
            <div className="card-header">
              <h2 className="card-title">Generated QR Code</h2>
            </div>

            <div className="qr-preview">
              <img src={generatedQR.qrCodeData} alt="QR Code" className="qr-image" />
              
              <div className="qr-info">
                <div className="info-item">
                  <strong>Title:</strong>
                  <span>{generatedQR.title}</span>
                </div>
                <div className="info-item">
                  <strong>Short ID:</strong>
                  <code>{generatedQR.shortId}</code>
                </div>
                <div className="info-item">
                  <strong>Short URL:</strong>
                  <code>{window.location.origin}/s/{generatedQR.shortId}</code>
                </div>
                <div className="info-item">
                  <strong>Destination:</strong>
                  <a href={generatedQR.originalUrl} target="_blank" rel="noopener noreferrer">
                    {generatedQR.originalUrl}
                  </a>
                </div>
              </div>

              <div className="qr-actions">
                <button onClick={downloadQR} className="btn btn-primary">
                  <FaDownload /> Download PNG
                </button>
                <button onClick={copyShortUrl} className="btn btn-secondary">
                  Copy Short URL
                </button>
                <button 
                  onClick={() => navigate(`/qr/${generatedQR._id}`)} 
                  className="btn btn-success"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRGenerator;
