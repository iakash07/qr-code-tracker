import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import QRGenerator from './pages/QRGenerator';
import QRList from './pages/QRList';
import QRDetails from './pages/QRDetails';
import ScanRedirect from './pages/ScanRedirect';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/generate" element={<QRGenerator />} />
          <Route path="/qr-codes" element={<QRList />} />
          <Route path="/qr/:id" element={<QRDetails />} />
          <Route path="/s/:shortId" element={<ScanRedirect />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
