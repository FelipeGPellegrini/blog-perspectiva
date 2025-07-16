// src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
// import AdminPage from './pages/AdminPage'; // REMOVA ESTA LINHA

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/tag/:tag" element={<HomePage />} />
      </Routes>
    </Layout>
  );
}

export default App;