// Card suits and values
const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // 1 = Ace, 11 = Jack, 12 = Queen, 13 = King

// Create a standard deck of 52 cards
export const createDeck = () => {
  const deck = [];
  SUITS.forEach(suit => {
    VALUES.forEach(value => {
      deck.push({ suit, value });
    });
  });
  return deck;
};

// Shuffle deck using Fisher-Yates algorithm
export const shuffleDeck = (deck) => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Deal a card from the deck
export const dealCard = (deck) => {
  return deck.pop();
};

// Calculate hand value (handles Ace as 1 or 11)
export const calculateHandValue = (hand) => {
  let value = 0;
  let aces = 0;

  hand.forEach(card => {
    if (card.value === 1) {
      aces++;
      value += 11;
    } else if (card.value > 10) {
      value += 10;
    } else {
      value += card.value;
    }
  });

  // Adjust for Aces
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
};

// Get display string for hand
export const getHandDisplay = (hand) => {
  return hand.map(card => {
    const suit = card.suit.charAt(0).toUpperCase();
    let value = card.value;
    if (value === 1) value = 'A';
    else if (value === 11) value = 'J';
    else if (value === 12) value = 'Q';
    else if (value === 13) value = 'K';
    return `${value}${suit}`;
  }).join(' ');
};

// Basic strategy lookup
export const getBasicStrategy = (playerValue, dealerUpCard, isSoft = false) => {
  const dealerValue = dealerUpCard.value;
  
  if (isSoft) {
    // Soft hand strategy (with Ace)
    if (playerValue >= 19) return 'stand';
    if (playerValue === 18) {
      return dealerValue >= 2 && dealerValue <= 6 ? 'stand' : 'hit';
    }
    return 'hit';
  }
  
  // Hard hand strategy
  if (playerValue >= 17) return 'stand';
  if (playerValue >= 13) {
    return dealerValue >= 2 && dealerValue <= 6 ? 'stand' : 'hit';
  }
  if (playerValue === 12) {
    return dealerValue >= 4 && dealerValue <= 6 ? 'stand' : 'hit';
  }
  return 'hit';
};

// Check if hand is soft (contains Ace counted as 11)
export const isSoftHand = (hand) => {
  let value = 0;
  let hasAce = false;
  
  hand.forEach(card => {
    if (card.value === 1) {
      hasAce = true;
      value += 11;
    } else if (card.value > 10) {
      value += 10;
    } else {
      value += card.value;
    }
  });
  
  return hasAce && value <= 21;
};