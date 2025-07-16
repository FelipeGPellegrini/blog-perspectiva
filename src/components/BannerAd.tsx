import React from 'react';
import './BannerAd.css';

interface BannerAdProps {
  imageDesktop: string;
  imageMobile: string;
  link: string;
  alt: string;
  className?: string;
  fallbackDesktop?: string;
  fallbackMobile?: string;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(() => window.matchMedia('(max-width: 767px)').matches);
  React.useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

const BannerAd: React.FC<BannerAdProps> = ({ imageDesktop, imageMobile, link, alt, className, fallbackDesktop, fallbackMobile }) => {
  const isMobile = useIsMobile();
  const [desktopSrc, setDesktopSrc] = React.useState(imageDesktop);
  const [mobileSrc, setMobileSrc] = React.useState(imageMobile);

  const handleImgError = () => {
    if (isMobile) {
      if (fallbackMobile && mobileSrc !== fallbackMobile) setMobileSrc(fallbackMobile);
    } else {
      if (fallbackDesktop && desktopSrc !== fallbackDesktop) setDesktopSrc(fallbackDesktop);
    }
  };

  return (
    <div className={`banner-ad ${className || ''}`}>
      <a href={link} target="_blank" rel="noopener noreferrer">
        <img
          src={isMobile ? mobileSrc : desktopSrc}
          alt={alt}
          className="banner-ad-img"
          onError={handleImgError}
        />
      </a>
    </div>
  );
};

export default BannerAd; 