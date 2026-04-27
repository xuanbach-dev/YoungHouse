import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

import Navbar from './components/Navbar';
import BottomNavbar from './components/BottomNavbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import MessengerChat from './components/MessengerChat';
import './App.css';
const Home = React.lazy(() => import('./pages/Home'));
const PostDetail = React.lazy(() => import('./pages/PostDetail'));
const SystemHome = React.lazy(() => import('./pages/SystemHome'));
const RoomDetail = React.lazy(() => import('./pages/RoomDetail'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Admin = React.lazy(() => import('./pages/Admin'));

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
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </React.Suspense>
        </main>
        <BottomNavbar />
        <Footer />
        
        {/* Floating Widgets */}
        <BackToTop />
        <MessengerChat />
        
        <SpeedInsights />
        <Analytics />
      </div>
    </Router>
  );
}

export default App;
