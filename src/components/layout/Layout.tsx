import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ReadingProgressBar from '../blog/ReadingProgressBar';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <ReadingProgressBar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;