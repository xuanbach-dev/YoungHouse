import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import BottomNavbar from './components/BottomNavbar';
import Footer from './components/Footer';
import Home from './pages/Home';

import PostDetail from './pages/PostDetail';
import SystemHome from './pages/SystemHome';
import RoomDetail from './pages/RoomDetail';
import Contact from './pages/Contact';
import RoommateFinder from './pages/RoommateFinder';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/system-home" element={<SystemHome />} />
              <Route path="/rooms/:id" element={<RoomDetail />} />
              <Route path="/room/:slug" element={<RoomDetail />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/roommate-finder" element={<RoommateFinder />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </main>
        <BottomNavbar />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
