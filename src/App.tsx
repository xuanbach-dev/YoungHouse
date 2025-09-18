import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import BottomNavbar from './components/BottomNavbar';
import Footer from './components/Footer';
import './App.css';
const Home = React.lazy(() => import('./pages/Home'));
const PostDetail = React.lazy(() => import('./pages/PostDetail'));
const SystemHome = React.lazy(() => import('./pages/SystemHome'));
const RoomDetail = React.lazy(() => import('./pages/RoomDetail'));
const Contact = React.lazy(() => import('./pages/Contact'));
const RoommateFinder = React.lazy(() => import('./pages/RoommateFinder'));

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <React.Suspense fallback={<div />}> 
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
          </React.Suspense>
        </main>
        <BottomNavbar />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
