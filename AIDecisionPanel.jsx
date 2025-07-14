import React from 'react';
import { Brain, TrendingUp, Target, Zap } from 'lucide-react';

const AIDecisionPanel = ({ decision }) => {
  if (!decision) return null;

  return (
    <div className="ai-decision-panel animated-panel">
      <div className="ai-header">
        <Brain className="ai-icon" />
        <span>AI Decision Analysis</span>
        <div className="ai-pulse-indicator"></div>
      </div>
      
      <div className="ai-content">
        <div className="decision-item">
          <TrendingUp className="decision-icon" />
          <span className="decision-label">Recommendation:</span>
          <span className={`decision-value ${decision.recommendation.toLowerCase()}`}>
            {decision.recommendation}
          </span>
        </div>
        
        <div className="decision-item">
          <Target className="decision-icon" />
          <span className="decision-label">Confidence:</span>
          <span className="decision-value confidence">
            {decision.confidence}%
            <div className="confidence-bar">
              <div 
                className="confidence-fill"
                style={{ width: `${decision.confidence}%` }}
              ></div>
            </div>
          </span>
        </div>
        
        <div className="decision-item">
          <Zap className="decision-icon" />
          <span className="decision-label">Method:</span>
          <span className="decision-value">{decision.method}</span>
        </div>
      </div>
      
      <div className="ai-explanation">
        <div className="explanation-header">AI Reasoning:</div>
        <p>{decision.explanation}</p>
      </div>
      
      <div className="ai-simulation">
        <div className="simulation-header">
          <span>Monte Carlo Simulation</span>
          <div className="simulation-spinner"></div>
        </div>
        <div className="simulation-results">
          <div className="result-item">
            <span>Win Rate: {decision.simulation.winRate}%</span>
            <div className="result-bar">
              <div 
                className="result-fill win-fill"
                style={{ width: `${decision.simulation.winRate}%` }}
              ></div>
            </div>
          </div>
          <div className="result-item">
            <span>Simulations: {decision.simulation.trials.toLocaleString()}</span>
            <div className="trials-indicator">
              <div className="trial-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDecisionPanel;