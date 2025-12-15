import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { FaQrcode, FaMousePointer, FaChartLine, FaCheckCircle } from 'react-icons/fa';
import { getDashboardStats } from '../services/api';
import socketService from '../services/socket';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching dashboard stats...');
      const response = await getDashboardStats({ period });
      setStats(response.data.data);
      console.log('✅ Dashboard stats loaded');
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    console.log('🎯 Dashboard mounted, initializing...');
    fetchStats();
    
    // Connect to socket for real-time updates
    console.log('🔌 Connecting to socket for real-time updates...');
    const socket = socketService.connect();
    
    // Check if socket is connected
    if (socket.connected) {
      console.log('✅ Socket already connected');
    } else {
      console.log('⏳ Waiting for socket connection...');
    }
    
    socket.on('scan-update', (data) => {
      console.log('📡 Received scan-update event:', data);
      toast.info(`New scan detected! QR: ${data.shortId}`, {
        position: 'bottom-right',
        autoClose: 3000
      });
      console.log('🔄 Refreshing dashboard stats...');
      fetchStats(); // Refresh stats
    });

    return () => {
      console.log('🔌 Cleaning up socket listeners');
      socket.off('scan-update');
    };
  }, [fetchStats]);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="error">Failed to load dashboard data</div>;
  }

  // Prepare chart data
  const scanTrendData = {
    labels: stats.dailyScans.map(item => format(new Date(item._id), 'MMM dd')),
    datasets: [
      {
        label: 'Scans',
        data: stats.dailyScans.map(item => item.count),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const deviceData = {
    labels: stats.deviceStats.map(item => item._id || 'Unknown'),
    datasets: [
      {
        data: stats.deviceStats.map(item => item.count),
        backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
        borderWidth: 0
      }
    ]
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="period-selector">
          <button 
            className={period === '24h' ? 'active' : ''} 
            onClick={() => setPeriod('24h')}
          >
            24h
          </button>
          <button 
            className={period === '7d' ? 'active' : ''} 
            onClick={() => setPeriod('7d')}
          >
            7d
          </button>
          <button 
            className={period === '30d' ? 'active' : ''} 
            onClick={() => setPeriod('30d')}
          >
            30d
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e3f2fd' }}>
            <FaQrcode style={{ color: '#2196f3' }} />
          </div>
          <div className="stat-content">
            <h3>{stats.overview.totalQRCodes}</h3>
            <p>Total QR Codes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f3e5f5' }}>
            <FaMousePointer style={{ color: '#9c27b0' }} />
          </div>
          <div className="stat-content">
            <h3>{stats.overview.totalScans}</h3>
            <p>Total Scans</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e8f5e9' }}>
            <FaChartLine style={{ color: '#4caf50' }} />
          </div>
          <div className="stat-content">
            <h3>{stats.overview.scansInPeriod}</h3>
            <p>Scans in Period</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff3e0' }}>
            <FaCheckCircle style={{ color: '#ff9800' }} />
          </div>
          <div className="stat-content">
            <h3>{stats.overview.activeQRCodes}</h3>
            <p>Active QR Codes</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Scan Trend</h2>
          </div>
          <div className="chart-container">
            <Line data={scanTrendData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Device Breakdown</h2>
          </div>
          <div className="chart-container">
            <Doughnut data={deviceData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Most Scanned QR Codes</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Short ID</th>
                <th>URL</th>
                <th>Scans</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stats.mostScanned.map((qr) => (
                <tr key={qr._id}>
                  <td>{qr.title}</td>
                  <td><code>{qr.shortId}</code></td>
                  <td className="url-cell">{qr.originalUrl}</td>
                  <td><strong>{qr.scanCount}</strong></td>
                  <td>{format(new Date(qr.createdAt), 'MMM dd, yyyy')}</td>
                  <td>
                    <Link to={`/qr/${qr._id}`} className="btn btn-sm btn-primary">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Activity</h2>
        </div>
        <div className="activity-list">
          {stats.recentScans.map((scan, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">
                <FaMousePointer />
              </div>
              <div className="activity-content">
                <p className="activity-title">
                  Scan detected on <strong>{scan.qrCodeId?.title || 'Unknown'}</strong>
                </p>
                <p className="activity-time">
                  {format(new Date(scan.timestamp), 'MMM dd, yyyy HH:mm')} • 
                  {scan.deviceType} • {scan.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
