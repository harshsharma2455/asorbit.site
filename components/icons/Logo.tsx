import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        aria-label="Asorbit Logo"
    >
        <defs>
            <filter id="logo-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="rgba(0, 0, 0, 0.15)" />
            </filter>
        </defs>
        
        <g transform="translate(4, -7)">
            <g filter="url(#logo-shadow)">
                {/* First bar (top-left blue) */}
                <rect x="25.19" y="34.83" width="22.41" height="14.93" rx="7.465" ry="7.465" fill="#0EA5E9" transform="rotate(-30 25.19 34.83)"/>
                
                {/* Second bar (middle-left light blue) */}
                <rect x="26.20" y="56.59" width="37.80" height="14.93" rx="7.465" ry="7.465" fill="#38BDF8" transform="rotate(-30 26.20 56.59)"/>
                
                {/* Third bar (bottom-left green) */}
                <rect x="25.70" y="80.50" width="55.55" height="14.93" rx="7.465" ry="7.465" fill="#34D399" transform="rotate(-30 25.70 80.50)"/>
                
                {/* Fourth bar (bottom-right dark green) */}
                <rect x="65.24" y="80.47" width="26.77" height="14.93" rx="7.465" ry="7.465" fill="#10B981" transform="rotate(-30 65.24 80.47)"/>
            </g>
        </g>
    </svg>
);