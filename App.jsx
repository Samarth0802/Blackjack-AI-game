import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import GameBoard from './components/GameBoard';
import './styles/App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerMoney, setPlayerMoney] = useState(1000);
  const [gameStats, setGameStats] = useState({
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

  const startGame = () => {
    setGameStarted(true);
  };

  const resetGame = () => {
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
    setGameStarted(false);
  };

  return (
    <div className="app">
      {!gameStarted ? (
        <LandingPage onStartGame={startGame} />
      ) : (
        <GameBoard 
          playerMoney={playerMoney}
          setPlayerMoney={setPlayerMoney}
          gameStats={gameStats}
          setGameStats={setGameStats}
          onResetGame={resetGame}
        />
      )}
    </div>
  );
}

export default App;