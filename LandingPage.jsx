import React from 'react';
import { Play, Coins, Sparkles, Brain, Cpu } from 'lucide-react';
import AnimatedChips from './AnimatedChips';

const LandingPage = ({ onStartGame }) => {
  return (
    <div className="landing-page">
      <AnimatedChips />
      
      <div className="landing-content">
        <div className="title-section">
          <div className="title-wrapper">
            <Brain className="title-icon brain-icon" />
            <h1 className="main-title">
              <span className="title-part">Blackjack</span>
              <span className="title-highlight">AI</span>
            </h1>
            <Cpu className="title-icon cpu-icon" />
          </div>
          <p className="subtitle">
            Challenge the smartest dealer powered by Monte Carlo & Q-Learning
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <Brain className="feature-icon" />
            <h3>Monte Carlo AI</h3>
            <p>Advanced simulation-based decision making</p>
          </div>
          <div className="feature-card">
            <Cpu className="feature-icon" />
            <h3>Q-Learning</h3>
            <p>Reinforcement learning for optimal strategy</p>
          </div>
          <div className="feature-card">
            <Coins className="feature-icon" />
            <h3>Realistic Casino</h3>
            <p>Authentic blackjack experience</p>
          </div>
        </div>

        <div className="game-info">
          <div className="starting-money">
            <Coins className="money-icon" />
            <span>Starting Money: $1,000</span>
          </div>
        </div>

        <button className="start-button" onClick={onStartGame}>
          <Play className="play-icon" />
          <span>Start Game</span>
          <div className="button-glow"></div>
        </button>

        <div className="ai-indicator">
          <div className="ai-pulse"></div>
          <span>AI Dealer Ready</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;