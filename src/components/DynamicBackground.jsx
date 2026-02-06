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
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, ${mousePos.x < window.innerWidth / 2 ? 'rgba(255, 42, 42, 0.25)' : 'rgba(42, 42, 255, 0.25)'} 0%, rgba(0,0,0,0) 50%)`,
            pointerEvents: 'none',
            transition: 'background 0.2s ease-out'
        }} />
    );
}
