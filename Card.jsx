import React from 'react';

const Card = ({ card, isHidden = false, delay = 0 }) => {
  const getSuitSymbol = (suit) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  const getSuitColor = (suit) => {
    return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
  };

  const getDisplayValue = (value) => {
    switch (value) {
      case 1: return 'A';
      case 11: return 'J';
      case 12: return 'Q';
      case 13: return 'K';
      default: return value.toString();
    }
  };

  if (isHidden) {
    return (
      <div 
        className="card card-hidden"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="card-back">
          <div className="card-pattern"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`card card-${getSuitColor(card.suit)}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="card-front">
        <div className="card-corner top-left">
          <div className="card-value">{getDisplayValue(card.value)}</div>
          <div className="card-suit">{getSuitSymbol(card.suit)}</div>
        </div>
        <div className="card-center">
          <div className="card-suit-large">{getSuitSymbol(card.suit)}</div>
        </div>
        <div className="card-corner bottom-right">
          <div className="card-value">{getDisplayValue(card.value)}</div>
          <div className="card-suit">{getSuitSymbol(card.suit)}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;