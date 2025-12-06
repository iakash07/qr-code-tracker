import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaSearch, FaDownload } from 'react-icons/fa';
import { getAllQRCodes, deleteQRCode } from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import './QRList.css';

const QRList = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    fetchQRCodes();
  }, [search, pagination.page]);

  const fetchQRCodes = async () => {
    try {
      setLoading(true);
      const response = await getAllQRCodes({
        search,
        page: pagination.page,
        limit: pagination.limit
      });
      setQrCodes(response.data.data);
      setPagination(prev => ({ ...prev, ...response.data.pagination }));
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      toast.error('Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this QR code?')) {
      return;
    }

    try {
      await deleteQRCode(id);
      toast.success('QR Code deleted successfully');
      fetchQRCodes();
    } catch (error) {
      console.error('Error deleting QR code:', error);
      toast.error('Failed to delete QR code');
    }
  };

  const downloadQR = (qrCode) => {
    const link = document.createElement('a');
    link.href = qrCode.qrCodeData;
    link.download = `qr-${qrCode.shortId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code downloaded!');
  };

  if (loading) {
    return <div className="loading">Loading QR codes...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All QR Codes</h2>
          <Link to="/generate" className="btn btn-primary">
            Generate New QR
          </Link>
        </div>

        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, URL, or short ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {qrCodes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>No QR codes found</h3>
            <p>Create your first QR code to get started!</p>
            <Link to="/generate" className="btn btn-primary">
              Generate QR Code
            </Link>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>QR Code</th>
                    <th>Title</th>
                    <th>Short ID</th>
                    <th>URL</th>
                    <th>Scans</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {qrCodes.map((qr) => (
                    <tr key={qr._id}>
                      <td>
                        <img 
                          src={qr.qrCodeData} 
                          alt="QR" 
                          className="qr-thumbnail"
                        />
                      </td>
                      <td><strong>{qr.title}</strong></td>
                      <td><code>{qr.shortId}</code></td>
                      <td className="url-cell">{qr.originalUrl}</td>
                      <td><span className="scan-badge">{qr.scanCount}</span></td>
                      <td>{format(new Date(qr.createdAt), 'MMM dd, yyyy')}</td>
                      <td>
                        <div className="action-buttons">
                          <Link 
                            to={`/qr/${qr._id}`} 
                            className="btn btn-sm btn-primary"
                            title="View Details"
                          >
                            <FaEye />
                          </Link>
                          <button 
                            onClick={() => downloadQR(qr)} 
                            className="btn btn-sm btn-success"
                            title="Download"
                          >
                            <FaDownload />
                          </button>
                          <button 
                            onClick={() => handleDelete(qr._id)} 
                            className="btn btn-sm btn-danger"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="btn btn-secondary"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QRList;
