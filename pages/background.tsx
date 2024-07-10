// Background.tsx
import React from 'react';

interface BackgroundProps {
    children?: React.ReactNode;
  }

const Background: React.FC<BackgroundProps> = ({ children }) => {
  const backgroundStyle: React.CSSProperties = {
    backgroundImage: 'url(/image/image.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 0,
  };

  return <div style={backgroundStyle}>{children}</div>;
};

export default Background;
