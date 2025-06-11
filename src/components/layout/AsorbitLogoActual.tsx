import React from 'react';

interface AsorbitLogoActualProps {
  className?: string; // Parent applies transform classes here
}

const AsorbitLogoActual: React.FC<AsorbitLogoActualProps> = ({ className = "" }) => {
  return (
    <div
      className={className} // Tailwind classes like transform, scale, origin will be applied here
      style={{
        width: '120px', // Intrinsic width of the logo design before scaling
        height: '120px', // Intrinsic height of the logo design before scaling
      }}
      aria-label="ASORBIT Logo"
    >
      {/* Inner div for the actual logo elements */}
      <div style={{ width: '100%', height: '100%', position: 'relative', background: 'transparent', overflow: 'hidden' }}>
        <div style={{ width: '22.41px', height: '14.93px', left: '25.19px', top: '34.83px', position: 'absolute', transform: 'rotate(-30deg)', transformOrigin: 'top left', background: '#1A00FF', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '20px' }}></div>
        <div style={{ width: '37.80px', height: '14.93px', left: '26.20px', top: '56.59px', position: 'absolute', transform: 'rotate(-30deg)', transformOrigin: 'top left', background: '#7393FE', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '20px' }}></div>
        <div style={{ width: '55.55px', height: '14.93px', left: '25.70px', top: '80.50px', position: 'absolute', transform: 'rotate(-30deg)', transformOrigin: 'top left', background: '#BAFFB1', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '20px' }}></div>
        <div style={{ width: '26.77px', height: '14.93px', left: '65.24px', top: '80.47px', position: 'absolute', transform: 'rotate(-30deg)', transformOrigin: 'top left', background: '#57FF7B', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: '20px' }}></div>
      </div>
    </div>
  );
};

export default AsorbitLogoActual;