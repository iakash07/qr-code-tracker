import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import { FaEdit, FaSave, FaTimes, FaDownload, FaTrash } from 'react-icons/fa';
import { getQRCode, updateQRCode, deleteQRCode, getQRAnalytics } from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import './QRDetails.css';

const QRDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchData();
  }, [id, period]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [qrResponse, analyticsResponse] = await Promise.all([
        getQRCode(id),
        getQRAnalytics(id, { period })
      ]);
      setQrCode(qrResponse.data.data);
      setFormData(qrResponse.data.data);
      setAnalytics(analyticsResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load QR code details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateQRCode(id, formData);
      toast.success('QR Code updated successfully');
      setEditing(false);
      fetchData();
    } catch (error) {
      console.error('Error updating QR code:', error);
      toast.error('Failed to update QR code');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this QR code?')) {
      return;
    }

    try {
      await deleteQRCode(id);
      toast.success('QR Code deleted successfully');
      navigate('/qr-codes');
    } catch (error) {
      console.error('Error deleting QR code:', error);
      toast.error('Failed to delete QR code');
    }
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCode.qrCodeData;
    link.download = `qr-${qrCode.shortId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code downloaded!');
  };

  if (loading) {
    return <div className="loading">Loading QR code details...</div>;
  }

  if (!qrCode || !analytics) {
    return <div className="error">QR Code not found</div>;
  }

  const dailyTrendData = {
    labels: analytics.stats.dailyTrend.map(item => format(new Date(item._id), 'MMM dd')),
    datasets: [{
      label: 'Scans',
      data: analytics.stats.dailyTrend.map(item => item.count),
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const deviceData = {
    labels: analytics.stats.deviceBreakdown.map(item => item._id || 'Unknown'),
    datasets: [{
      data: analytics.stats.deviceBreakdown.map(item => item.count),
      backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe']
    }]
  };

  return (
    <div className="container">
      <div className="qr-details-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">QR Code Details</h2>
            <div className="header-actions">
              {editing ? (
                <>
                  <button onClick={handleUpdate} className="btn btn-sm btn-success">
                    <FaSave /> Save
                  </button>
                  <button onClick={() => setEditing(false)} className="btn btn-sm btn-secondary">
                    <FaTimes /> Cancel
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditing(true)} className="btn btn-sm btn-primary">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={downloadQR} className="btn btn-sm btn-success">
                    <FaDownload /> Download
                  </button>
                  <button onClick={handleDelete} className="btn btn-sm btn-danger">
                    <FaTrash /> Delete
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="qr-display">
            <img src={qrCode.qrCodeData} alt="QR Code" className="qr-image-large" />
          </div>

          <div className="qr-info-section">
            {editing ? (
              <>
                <div className="input-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label>Destination URL</label>
                  <input
                    type="url"
                    value={formData.originalUrl}
                    onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="info-row">
                  <strong>Title:</strong>
                  <span>{qrCode.title}</span>
                </div>
                <div className="info-row">
                  <strong>Short ID:</strong>
                  <code>{qrCode.shortId}</code>
                </div>
                <div className="info-row">
                  <strong>Short URL:</strong>
                  <code>{window.location.origin}/s/{qrCode.shortId}</code>
                </div>
                <div className="info-row">
                  <strong>Destination:</strong>
                  <a href={qrCode.originalUrl} target="_blank" rel="noopener noreferrer">
                    {qrCode.originalUrl}
                  </a>
                </div>
                <div className="info-row">
                  <strong>Description:</strong>
                  <span>{qrCode.description || 'No description'}</span>
                </div>
                <div className="info-row">
                  <strong>Total Scans:</strong>
                  <span className="scan-count">{analytics.stats.totalScans}</span>
                </div>
                <div className="info-row">
                  <strong>Created:</strong>
                  <span>{format(new Date(qrCode.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="analytics-section">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Analytics</h2>
              <div className="period-selector">
                <button className={period === '7d' ? 'active' : ''} onClick={() => setPeriod('7d')}>7d</button>
                <button className={period === '30d' ? 'active' : ''} onClick={() => setPeriod('30d')}>30d</button>
                <button className={period === '90d' ? 'active' : ''} onClick={() => setPeriod('90d')}>90d</button>
              </div>
            </div>

            <div className="stats-summary">
              <div className="stat-box">
                <h3>{analytics.stats.totalScans}</h3>
                <p>Total Scans</p>
              </div>
              <div className="stat-box">
                <h3>{analytics.stats.scansInPeriod}</h3>
                <p>Scans in Period</p>
              </div>
            </div>

            <div className="chart-section">
              <h3>Scan Trend</h3>
              <Line data={dailyTrendData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>

            <div className="chart-section">
              <h3>Device Breakdown</h3>
              <Doughnut data={deviceData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>

            {analytics.stats.locationBreakdown.length > 0 && (
              <div className="location-section">
                <h3>Top Locations</h3>
                <div className="location-list">
                  {analytics.stats.locationBreakdown.map((loc, index) => (
                    <div key={index} className="location-item">
                      <span>{loc._id.city}, {loc._id.country}</span>
                      <span className="location-count">{loc.count} scans</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRDetails;
