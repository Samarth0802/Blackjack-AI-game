import React, { useState, useEffect } from 'react';

const AnimatedChips = () => {
  const [chips, setChips] = useState([]);

  useEffect(() => {
    const createChip = () => {
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffd93d', '#6c5ce7'];
      const values = [5, 10, 25, 50, 100, 500];
      
      return {
        id: Math.random(),
        color: colors[Math.floor(Math.random() * colors.length)],
        value: values[Math.floor(Math.random() * values.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 30 + 40,
        speed: Math.random() * 2 + 1,
        direction: Math.random() * 360,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 4 - 2,
      };
    };

    const initialChips = Array.from({ length: 15 }, createChip);
    setChips(initialChips);

    const interval = setInterval(() => {
      setChips(prevChips => 
        prevChips.map(chip => ({
          ...chip,
          x: (chip.x + Math.cos(chip.direction) * chip.speed * 0.5) % 100,
          y: (chip.y + Math.sin(chip.direction) * chip.speed * 0.5) % 100,
          rotation: chip.rotation + chip.rotationSpeed,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animated-chips">
      {chips.map(chip => (
        <div
          key={chip.id}
          className="floating-chip"
          style={{
            left: `${chip.x}%`,
            top: `${chip.y}%`,
            width: `${chip.size}px`,
            height: `${chip.size}px`,
            backgroundColor: chip.color,
            transform: `rotate(${chip.rotation}deg)`,
          }}
        >
          <div className="chip-inner">
            <span className="chip-value">${chip.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimatedChips;