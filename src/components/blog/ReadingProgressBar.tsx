import React, { useState, useEffect } from 'react';

const ReadingProgressBar: React.FC = () => {
  const [width, setWidth] = useState(0);

  const scrollListener = () => {
    const element = document.documentElement;
    const totalHeight = element.scrollHeight - element.clientHeight;
    const windowScroll = element.scrollTop;
    if (windowScroll === 0) {
      return setWidth(0);
    }
    const scrolled = (windowScroll / totalHeight) * 100;
    setWidth(scrolled);
  };

  useEffect(() => {
    window.addEventListener('scroll', scrollListener);
    return () => window.removeEventListener('scroll', scrollListener);
  }, []);

  return (
    <div className="fixed top-0 left-0 z-50 w-full h-1">
      <div 
        className="h-1 bg-orange-500 transition-all duration-100 ease-linear" 
        style={{ width: `${width}%` }} 
      />
    </div>
  );
};

export default ReadingProgressBar;