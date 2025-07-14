import React, { useState, useEffect } from 'react';
import { RefreshCw, Home, Brain, TrendingUp, LogOut } from 'lucide-react';
import Card from './Card';
import AIDecisionPanel from './AIDecisionPanel';
import ChipSelector from './ChipSelector';
import GameStatistics from './GameStatistics';
import { createDeck, shuffleDeck, dealCard, calculateHandValue, getHandDisplay } from '../utils/gameLogic';
import { AIDealer } from '../utils/aiDealer';

const GameBoard = ({ playerMoney, setPlayerMoney, onResetGame, gameStats, setGameStats }) => {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [currentBet, setCurrentBet] = useState(0);
  const [gameState, setGameState] = useState('betting'); // betting, playing, dealer, finished
  const [message, setMessage] = useState('Place your bet to start!');
  const [aiDealer] = useState(new AIDealer());
  const [aiDecision, setAiDecision] = useState(null);
  const [dealerRevealed, setDealerRevealed] = useState(false);
  const [isDealing, setIsDealing] = useState(false);
  const [showAIStats, setShowAIStats] = useState(true);
  const [cardAnimation, setCardAnimation] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Reset game state
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);
    setPlayerHand([]);
    setDealerHand([]);
    setCurrentBet(0);
    setGameState('betting');
    setMessage('Place your bet to start!');
    setDealerRevealed(false);
    setAiDecision(null);
    setCardAnimation(false);
  };

  const placeBet = (betAmount) => {
    if (betAmount > playerMoney) {
      setMessage('Insufficient funds!');
      return;
    }
    
    setCurrentBet(betAmount);
    setPlayerMoney(playerMoney - betAmount);
    
    // Update games played
    setGameStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1
    }));
    
    startNewRound();
  };

  const startNewRound = () => {
    setIsDealing(true);
    setGameState('playing');
    setMessage('Dealing cards...');
    
    // Deal initial cards with animation delay
    setTimeout(() => {
      const newDeck = [...deck];
      const newPlayerHand = [dealCard(newDeck), dealCard(newDeck)];
      const newDealerHand = [dealCard(newDeck), dealCard(newDeck)];
      
      setDeck(newDeck);
      setPlayerHand(newPlayerHand);
      setDealerHand(newDealerHand);
      
      const playerValue = calculateHandValue(newPlayerHand);
      const dealerUpCard = newDealerHand[0];
      
      // AI analyzes the situation
      const decision = aiDealer.analyzeHand(newPlayerHand, dealerUpCard);
      setAiDecision(decision);
      
      if (playerValue === 21) {
        setMessage('Blackjack! You win!');
        const winAmount = currentBet * 2.5;
        setPlayerMoney(prev => prev + winAmount);
        updateGameStats('win', winAmount - currentBet);
        setGameState('finished');
      } else {
        setMessage('Your turn: Hit or Stand?');
      }
      
      setIsDealing(false);
    }, 1000);
  };

  const hit = () => {
    const newDeck = [...deck];
    const newCard = dealCard(newDeck);
    const newPlayerHand = [...playerHand, newCard];
    
    setDeck(newDeck);
    setPlayerHand(newPlayerHand);
    
    const playerValue = calculateHandValue(newPlayerHand);
    
    if (playerValue > 21) {
      setMessage('Bust! You lose!');
      updateGameStats('loss', -currentBet);
      setGameState('finished');
    } else if (playerValue === 21) {
      setMessage('21! Standing automatically...');
      setTimeout(dealerTurn, 1000);
    } else {
      // Update AI decision for new hand
      const decision = aiDealer.analyzeHand(newPlayerHand, dealerHand[0]);
      setAiDecision(decision);
      setMessage('Hit or Stand?');
    }
  };

  const stand = () => {
    setMessage('Dealer\'s turn...');
    dealerTurn();
  };

  const dealerTurn = () => {
    setGameState('dealer');
    setDealerRevealed(true);
    
    const dealerPlay = () => {
      const dealerValue = calculateHandValue(dealerHand);
      const playerValue = calculateHandValue(playerHand);
      
      if (dealerValue < 17) {
        // AI dealer makes decision
        const decision = aiDealer.makeDecision(dealerHand, playerHand);
        setAiDecision(decision);
        
        setTimeout(() => {
          const newDeck = [...deck];
          const newCard = dealCard(newDeck);
          const newDealerHand = [...dealerHand, newCard];
          
          setDeck(newDeck);
          setDealerHand(newDealerHand);
          
          const newDealerValue = calculateHandValue(newDealerHand);
          
          if (newDealerValue > 21) {
            setMessage('Dealer busts! You win!');
            const winAmount = currentBet * 2;
            setPlayerMoney(prev => prev + winAmount);
            updateGameStats('win', winAmount - currentBet);
            setGameState('finished');
          } else {
            dealerPlay();
          }
        }, 1500);
      } else {
        // Final comparison
        setTimeout(() => {
          if (dealerValue > playerValue) {
            setMessage('Dealer wins!');
            updateGameStats('loss', -currentBet);
          } else if (playerValue > dealerValue) {
            setMessage('You win!');
            const winAmount = currentBet * 2;
            setPlayerMoney(prev => prev + winAmount);
            updateGameStats('win', winAmount - currentBet);
          } else {
            setMessage('Push! It\'s a tie!');
            setPlayerMoney(prev => prev + currentBet);
            updateGameStats('tie', 0);
          }
          setGameState('finished');
        }, 1000);
      }
    };
    
    setTimeout(dealerPlay, 1000);
  };

  const updateGameStats = (result, netAmount) => {
    setGameStats(prev => ({
      ...prev,
      [result === 'win' ? 'wins' : result === 'loss' ? 'losses' : 'ties']: prev[result === 'win' ? 'wins' : result === 'loss' ? 'losses' : 'ties'] + 1,
      totalWinnings: prev.totalWinnings + (netAmount > 0 ? netAmount : 0),
      totalLosses: prev.totalLosses + (netAmount < 0 ? Math.abs(netAmount) : 0),
      netProfit: prev.netProfit + netAmount,
      biggestWin: Math.max(prev.biggestWin, netAmount > 0 ? netAmount : 0),
      biggestLoss: Math.max(prev.biggestLoss, netAmount < 0 ? Math.abs(netAmount) : 0)
    }));
  };
  const nextRound = () => {
    if (playerMoney <= 0) {
      setShowStatistics(true);
    } else {
      initializeGame();
    }
  };

  const handleExit = () => {
    setShowStatistics(true);
  };

  const handleNewGame = () => {
    // Reset everything for a completely new game
    setPlayerMoney(1000);
    setGameStats({
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      ties: 0,
      totalWinnings: 0,
      totalLosses: 0,
      netProfit: 0,
      biggestWin: 0,
      biggestLoss: 0
    });
    initializeGame();
  };

  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  if (showStatistics) {
    return (
      <GameStatistics 
        stats={gameStats}
        finalMoney={playerMoney}
        onPlayAgain={handleNewGame}
        onGoHome={onResetGame}
      />
    );
  }

  return (
    <div className="game-board">
      <div className="game-header">
        <div className="money-display">
          <span className="money-amount">${playerMoney}</span>
          <span className="money-label">Balance</span>
        </div>
        
        <div className="ai-toggle-container">
          <button 
            className={`ai-toggle-button ${showAIStats ? 'active' : ''}`}
            onClick={() => setShowAIStats(!showAIStats)}
          >
            <Brain size={20} />
            <span>AI Statistics</span>
            <div className="toggle-indicator"></div>
          </button>
        </div>
        
        <div className="game-controls">
          <button className="control-button" onClick={onResetGame}>
            <Home size={20} />
            <span>Home</span>
          </button>
          <button className="control-button" onClick={handleNewGame}>
            <RefreshCw size={20} />
            <span>New Game</span>
          </button>
        </div>
      </div>

      <div className="game-content">
        <div className="dealer-section">
          <div className="player-label">
            <Brain className="player-icon" />
            <span>AI Dealer</span>
            <span className="hand-value">
              {dealerRevealed ? dealerValue : '?'}
            </span>
          </div>
          <div className={`hand ${cardAnimation ? 'dealing' : ''}`}>
            {dealerHand.map((card, index) => (
              <Card
                key={index}
                card={card}
                isHidden={index === 1 && !dealerRevealed}
                delay={index * 200}
              />
            ))}
          </div>
        </div>

        <div className="game-center">
          <div className="game-message">
            {message}
          </div>
          
          {currentBet > 0 && (
            <div className="current-bet">
              <span>Current Bet: ${currentBet}</span>
            </div>
          )}
        </div>

        <div className="player-section">
          <div className="player-label">
            <span>Player</span>
            <span className="hand-value">{playerValue}</span>
          </div>
          <div className={`hand ${cardAnimation ? 'dealing' : ''}`}>
            {playerHand.map((card, index) => (
              <Card
                key={index}
                card={card}
                delay={index * 200}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="game-actions">
        {gameState === 'betting' && (
          <ChipSelector
            playerMoney={playerMoney}
            onPlaceBet={placeBet}
          />
        )}
        
        {gameState === 'playing' && !isDealing && (
          <div className="action-buttons">
            <button className="action-button hit-button" onClick={hit}>
              Hit
            </button>
            <button className="action-button stand-button" onClick={stand}>
              Stand
            </button>
          </div>
        )}
        
        {gameState === 'finished' && (
          <div className="action-buttons">
            {playerMoney > 0 ? (
              <>
                <button className="action-button next-button" onClick={nextRound}>
                  Next Round
                </button>
                <button className="action-button exit-button" onClick={handleExit}>
                  <LogOut size={20} />
                  Exit Game
                </button>
              </>
            ) : (
              <button className="action-button restart-button" onClick={nextRound}>
                View Statistics
              </button>
            )}
          </div>
        )}
      </div>

      {showAIStats && <AIDecisionPanel decision={aiDecision} />}
    </div>
  );
};

export default GameBoard;