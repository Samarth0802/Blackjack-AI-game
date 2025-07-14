import React, { useState } from 'react';
import { Coins, DollarSign, TrendingUp } from 'lucide-react';

const ChipSelector = ({ playerMoney, onPlaceBet }) => {
  const [selectedChip, setSelectedChip] = useState(null);
  const [customBet, setCustomBet] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [flyingChips, setFlyingChips] = useState([]);

  const chipValues = [
    { value: 5, color: '#ff6b6b' },
    { value: 10, color: '#4ecdc4' },
    { value: 25, color: '#45b7d1' },
    { value: 50, color: '#96ceb4' },
    { value: 100, color: '#ffd93d' },
    { value: 500, color: '#6c5ce7' }
  ];

  const availableChips = chipValues.filter(chip => chip.value <= playerMoney);

  const handleChipSelect = (chip) => {
    setSelectedChip(chip);
    setShowCustomInput(false);
    
    // Create flying chip animation
    const newFlyingChip = {
      id: Math.random(),
      value: chip.value,
      color: chip.color,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
    };
    
    setFlyingChips(prev => [...prev, newFlyingChip]);
    
    setTimeout(() => {
      setFlyingChips(prev => prev.filter(fc => fc.id !== newFlyingChip.id));
      onPlaceBet(chip.value);
    }, 800);
  };

  const handleCustomBet = () => {
    const betAmount = parseInt(customBet);
    if (betAmount && betAmount > 0 && betAmount <= playerMoney) {
      const customChip = {
        value: betAmount,
        color: '#ff9500'
      };
      
      const newFlyingChip = {
        id: Math.random(),
        value: betAmount,
        color: '#ff9500',
        startX: 50,
        startY: 50,
      };
      
      setFlyingChips(prev => [...prev, newFlyingChip]);
      
      setTimeout(() => {
        setFlyingChips(prev => prev.filter(fc => fc.id !== newFlyingChip.id));
        onPlaceBet(betAmount);
      }, 800);
      
      setCustomBet('');
      setShowCustomInput(false);
    }
  };

  const handleAllIn = () => {
    const allInChip = {
      value: playerMoney,
      color: '#e74c3c'
    };
    
    const newFlyingChip = {
      id: Math.random(),
      value: playerMoney,
      color: '#e74c3c',
      startX: 50,
      startY: 50,
    };
    
    setFlyingChips(prev => [...prev, newFlyingChip]);
    
    setTimeout(() => {
      setFlyingChips(prev => prev.filter(fc => fc.id !== newFlyingChip.id));
      onPlaceBet(playerMoney);
    }, 800);
  };

  return (
    <div className="chip-selector">
      <div className="chip-instruction">
        <Coins className="instruction-icon" />
        <span>Select your bet amount</span>
      </div>
      
      <div className="betting-options">
        <div className="chips-container">
          {availableChips.map(chip => (
            <button
              key={chip.value}
              className={`chip-button ${selectedChip?.value === chip.value ? 'selected' : ''}`}
              style={{ backgroundColor: chip.color }}
              onClick={() => handleChipSelect(chip)}
            >
              <div className="chip-inner">
                <span className="chip-value">${chip.value}</span>
              </div>
              <div className="chip-glow"></div>
            </button>
          ))}
        </div>

        <div className="custom-betting">
          <button 
            className="custom-bet-button"
            onClick={() => setShowCustomInput(!showCustomInput)}
          >
            <DollarSign size={20} />
            <span>Custom Bet</span>
          </button>
          
          <button 
            className="all-in-button"
            onClick={handleAllIn}
          >
            <TrendingUp size={20} />
            <span>All In (${playerMoney})</span>
          </button>
        </div>

        {showCustomInput && (
          <div className="custom-input-container">
            <input
              type="number"
              value={customBet}
              onChange={(e) => setCustomBet(e.target.value)}
              placeholder="Enter amount"
              min="1"
              max={playerMoney}
              className="custom-bet-input"
            />
            <button 
              className="place-custom-bet"
              onClick={handleCustomBet}
              disabled={!customBet || parseInt(customBet) <= 0 || parseInt(customBet) > playerMoney}
            >
              Place Bet
            </button>
          </div>
        )}
      </div>
      
      {/* Flying chips animation */}
      {flyingChips.map(chip => (
        <div
          key={chip.id}
          className="flying-chip"
          style={{
            backgroundColor: chip.color,
            left: `${chip.startX}%`,
            top: `${chip.startY}%`,
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

export default ChipSelector;