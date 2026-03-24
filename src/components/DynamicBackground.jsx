import { useState, useEffect } from 'react';

export default function DynamicBackground() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            {/* Darker base overlay */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -2,
                background: 'rgba(0, 0, 0, 0.6)',
                pointerEvents: 'none'
            }} />

            {/* Enhanced mouse gradient effect */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                background: `radial-gradient(circle 600px at ${mousePos.x}px ${mousePos.y}px, ${mousePos.x < window.innerWidth / 2 ? 'rgba(255, 71, 87, 0.4)' : 'rgba(46, 145, 255, 0.4)'} 0%, rgba(0,0,0,0) 70%)`,
                pointerEvents: 'none',
                transition: 'background 0.15s ease-out'
            }} />
        </>
    );
}
