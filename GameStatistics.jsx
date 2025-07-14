import React from 'react';
import { Home, RotateCcw, TrendingUp, TrendingDown, Target, Award, DollarSign, BarChart3 } from 'lucide-react';

const GameStatistics = ({ stats, finalMoney, onPlayAgain, onGoHome }) => {
  const winRate = stats.gamesPlayed > 0 ? ((stats.wins / stats.gamesPlayed) * 100).toFixed(1) : 0;
  const profitColor = stats.netProfit >= 0 ? '#4ecdc4' : '#ff6b6b';
  
  return (
    <div className="statistics-page">
      <div className="statistics-container">
        <div className="statistics-header">
          <BarChart3 className="stats-icon" />
          <h1 className="statistics-title">Game Statistics</h1>
          <div className="stats-decoration"></div>
        </div>

        <div className="final-money-display">
          <DollarSign className="money-icon" />
          <span className="final-amount">${finalMoney}</span>
          <span className="money-label">Final Balance</span>
        </div>

        <div className="statistics-grid">
          <div className="stat-card games-played">
            <div className="stat-icon-wrapper">
              <Target className="stat-icon" />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.gamesPlayed}</span>
              <span className="stat-label">Games Played</span>
            </div>
            <div className="stat-animation"></div>
          </div>

          <div className="stat-card win-rate">
            <div className="stat-icon-wrapper">
              <Award className="stat-icon" />
            </div>
            <div className="stat-content">
              <span className="stat-value">{winRate}%</span>
              <span className="stat-label">Win Rate</span>
            </div>
            <div className="stat-progress">
              <div 
                className="progress-fill win-progress"
                style={{ width: `${winRate}%` }}
              ></div>
            </div>
          </div>

          <div className="stat-card wins">
            <div className="stat-icon-wrapper win-icon">
              <TrendingUp className="stat-icon" />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.wins}</span>
              <span className="stat-label">Wins</span>
            </div>
            <div className="win-particles">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="stat-card losses">
            <div className="stat-icon-wrapper loss-icon">
              <TrendingDown className="stat-icon" />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.losses}</span>
              <span className="stat-label">Losses</span>
            </div>
          </div>

          <div className="stat-card ties">
            <div className="stat-icon-wrapper tie-icon">
              <Target className="stat-icon" />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.ties}</span>
              <span className="stat-label">Ties</span>
            </div>
          </div>

          <div className="stat-card net-profit">
            <div className="stat-icon-wrapper">
              <DollarSign className="stat-icon" />
            </div>
            <div className="stat-content">
              <span 
                className="stat-value"
                style={{ color: profitColor }}
              >
                {stats.netProfit >= 0 ? '+' : ''}${stats.netProfit}
              </span>
              <span className="stat-label">Net Profit</span>
            </div>
            <div className="profit-indicator">
              <div 
                className={`profit-bar ${stats.netProfit >= 0 ? 'positive' : 'negative'}`}
                style={{ 
                  width: `${Math.min(Math.abs(stats.netProfit) / 100, 100)}%`,
                  backgroundColor: profitColor 
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="detailed-stats">
          <div className="detail-row">
            <span className="detail-label">Total Winnings:</span>
            <span className="detail-value win-color">${stats.totalWinnings}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Total Losses:</span>
            <span className="detail-value loss-color">${stats.totalLosses}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Biggest Win:</span>
            <span className="detail-value win-color">${stats.biggestWin}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Biggest Loss:</span>
            <span className="detail-value loss-color">${stats.biggestLoss}</span>
          </div>
        </div>

        <div className="statistics-actions">
          <button className="stats-button play-again" onClick={onPlayAgain}>
            <RotateCcw size={20} />
            <span>Play Again</span>
            <div className="button-shine"></div>
          </button>
          <button className="stats-button go-home" onClick={onGoHome}>
            <Home size={20} />
            <span>Home</span>
          </button>
        </div>

        <div className="performance-message">
          {stats.netProfit > 0 ? (
            <div className="success-message">
              <Award className="message-icon" />
              <span>Excellent performance! You beat the house!</span>
            </div>
          ) : stats.netProfit === 0 ? (
            <div className="neutral-message">
              <Target className="message-icon" />
              <span>Perfect balance! You broke even with the house!</span>
            </div>
          ) : (
            <div className="loss-message">
              <TrendingDown className="message-icon" />
              <span>The house had the edge this time. Try again!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameStatistics;