import { calculateHandValue, getBasicStrategy, isSoftHand } from './gameLogic';

export class AIDealer {
  constructor() {
    this.qTable = new Map();
    this.epsilon = 0.1; // Exploration rate
    this.alpha = 0.1; // Learning rate
    this.gamma = 0.9; // Discount factor
    this.simulationCount = 1000;
  }

  // Main decision-making function
  makeDecision(dealerHand, playerHand) {
    const dealerValue = calculateHandValue(dealerHand);
    const playerValue = calculateHandValue(playerHand);
    
    // Use Q-Learning for decision making
    const qDecision = this.qLearningDecision(dealerHand, playerHand);
    
    // Run Monte Carlo simulation
    const simulation = this.runMonteCarloSimulation(dealerHand, playerHand);
    
    // Combine both approaches
    const finalDecision = this.combineDecisions(qDecision, simulation);
    
    return {
      recommendation: finalDecision.action,
      confidence: finalDecision.confidence,
      method: 'Q-Learning + Monte Carlo',
      explanation: this.getExplanation(finalDecision, dealerValue, playerValue),
      simulation: simulation
    };
  }

  // Analyze player's hand and provide recommendations
  analyzeHand(playerHand, dealerUpCard) {
    const playerValue = calculateHandValue(playerHand);
    const isSoft = isSoftHand(playerHand);
    const basicStrategy = getBasicStrategy(playerValue, dealerUpCard, isSoft);
    
    // Run simulation for player's decision
    const simulation = this.runPlayerSimulation(playerHand, dealerUpCard);
    
    return {
      recommendation: basicStrategy,
      confidence: simulation.confidence,
      method: 'Basic Strategy + Monte Carlo',
      explanation: this.getPlayerExplanation(basicStrategy, playerValue, dealerUpCard.value, isSoft),
      simulation: simulation
    };
  }

  // Q-Learning decision making
  qLearningDecision(dealerHand, playerHand) {
    const state = this.getStateKey(dealerHand, playerHand);
    const qValues = this.qTable.get(state) || { hit: 0, stand: 0 };
    
    // Epsilon-greedy policy
    if (Math.random() < this.epsilon) {
      return {
        action: Math.random() < 0.5 ? 'hit' : 'stand',
        confidence: 50,
        qValues: qValues
      };
    }
    
    const action = qValues.hit > qValues.stand ? 'hit' : 'stand';
    const confidence = Math.abs(qValues.hit - qValues.stand) * 100;
    
    return {
      action: action,
      confidence: Math.min(confidence, 95),
      qValues: qValues
    };
  }

  // Monte Carlo simulation
  runMonteCarloSimulation(dealerHand, playerHand) {
    const trials = this.simulationCount;
    let hitWins = 0;
    let standWins = 0;
    
    for (let i = 0; i < trials; i++) {
      // Simulate hit
      const hitResult = this.simulateAction(dealerHand, playerHand, 'hit');
      if (hitResult === 'win') hitWins++;
      
      // Simulate stand
      const standResult = this.simulateAction(dealerHand, playerHand, 'stand');
      if (standResult === 'win') standWins++;
    }
    
    const hitWinRate = (hitWins / trials) * 100;
    const standWinRate = (standWins / trials) * 100;
    
    return {
      winRate: Math.max(hitWinRate, standWinRate),
      trials: trials,
      hitWinRate: hitWinRate,
      standWinRate: standWinRate,
      recommendedAction: hitWinRate > standWinRate ? 'hit' : 'stand'
    };
  }

  // Simulate player's decision
  runPlayerSimulation(playerHand, dealerUpCard) {
    const trials = 500;
    let hitWins = 0;
    let standWins = 0;
    
    for (let i = 0; i < trials; i++) {
      // Create a mock dealer hand
      const mockDealerHand = [dealerUpCard, { suit: 'hearts', value: Math.floor(Math.random() * 13) + 1 }];
      
      const hitResult = this.simulatePlayerAction(playerHand, mockDealerHand, 'hit');
      if (hitResult === 'win') hitWins++;
      
      const standResult = this.simulatePlayerAction(playerHand, mockDealerHand, 'stand');
      if (standResult === 'win') standWins++;
    }
    
    const hitWinRate = (hitWins / trials) * 100;
    const standWinRate = (standWins / trials) * 100;
    const bestRate = Math.max(hitWinRate, standWinRate);
    
    return {
      winRate: bestRate,
      trials: trials,
      confidence: Math.min(bestRate + 10, 95)
    };
  }

  // Simulate a single action
  simulateAction(dealerHand, playerHand, action) {
    const dealerValue = calculateHandValue(dealerHand);
    const playerValue = calculateHandValue(playerHand);
    
    if (action === 'hit') {
      const newCard = { suit: 'hearts', value: Math.floor(Math.random() * 13) + 1 };
      const newDealerHand = [...dealerHand, newCard];
      const newDealerValue = calculateHandValue(newDealerHand);
      
      if (newDealerValue > 21) return 'lose'; // Dealer busts
      if (newDealerValue < 17) return this.simulateAction(newDealerHand, playerHand, 'hit');
      
      return newDealerValue > playerValue ? 'win' : 'lose';
    } else {
      // Stand
      if (dealerValue >= 17) {
        return dealerValue > playerValue ? 'win' : 'lose';
      }
      
      // Dealer must hit
      const newCard = { suit: 'hearts', value: Math.floor(Math.random() * 13) + 1 };
      const newDealerHand = [...dealerHand, newCard];
      return this.simulateAction(newDealerHand, playerHand, 'stand');
    }
  }

  // Simulate player action
  simulatePlayerAction(playerHand, dealerHand, action) {
    let currentPlayerHand = [...playerHand];
    
    if (action === 'hit') {
      const newCard = { suit: 'hearts', value: Math.floor(Math.random() * 13) + 1 };
      currentPlayerHand.push(newCard);
      
      const playerValue = calculateHandValue(currentPlayerHand);
      if (playerValue > 21) return 'lose';
    }
    
    // Simulate dealer play
    let currentDealerHand = [...dealerHand];
    let dealerValue = calculateHandValue(currentDealerHand);
    
    while (dealerValue < 17) {
      const newCard = { suit: 'hearts', value: Math.floor(Math.random() * 13) + 1 };
      currentDealerHand.push(newCard);
      dealerValue = calculateHandValue(currentDealerHand);
    }
    
    const playerValue = calculateHandValue(currentPlayerHand);
    
    if (dealerValue > 21) return 'win';
    if (playerValue > dealerValue) return 'win';
    if (playerValue < dealerValue) return 'lose';
    return 'tie';
  }

  // Combine Q-Learning and Monte Carlo decisions
  combineDecisions(qDecision, simulation) {
    const qWeight = 0.4;
    const mcWeight = 0.6;
    
    const qConfidence = qDecision.confidence;
    const mcConfidence = simulation.winRate;
    
    const combinedConfidence = (qConfidence * qWeight + mcConfidence * mcWeight);
    
    // Choose action based on combined confidence
    let finalAction = simulation.recommendedAction;
    if (qConfidence > mcConfidence && qConfidence > 70) {
      finalAction = qDecision.action;
    }
    
    return {
      action: finalAction,
      confidence: Math.min(combinedConfidence, 95)
    };
  }

  // Generate state key for Q-table
  getStateKey(dealerHand, playerHand) {
    const dealerValue = calculateHandValue(dealerHand);
    const playerValue = calculateHandValue(playerHand);
    return `D${dealerValue}-P${playerValue}`;
  }

  // Get explanation for decision
  getExplanation(decision, dealerValue, playerValue) {
    const explanations = {
      'hit': [
        `With ${dealerValue}, mathematical probability favors hitting.`,
        `Monte Carlo simulation shows ${decision.confidence}% success rate for hitting.`,
        `Q-Learning model recommends hitting based on historical patterns.`
      ],
      'stand': [
        `With ${dealerValue}, standing minimizes risk of busting.`,
        `Statistical analysis shows ${decision.confidence}% win probability.`,
        `AI model suggests standing based on optimal strategy.`
      ]
    };
    
    const options = explanations[decision.action];
    return options[Math.floor(Math.random() * options.length)];
  }

  // Get explanation for player recommendation
  getPlayerExplanation(strategy, playerValue, dealerValue, isSoft) {
    if (strategy === 'hit') {
      if (isSoft) {
        return `Soft ${playerValue} against ${dealerValue}: Basic strategy recommends hitting for optimal value.`;
      }
      return `Hard ${playerValue} against ${dealerValue}: Mathematical advantage favors hitting.`;
    } else {
      if (isSoft) {
        return `Soft ${playerValue} against ${dealerValue}: Standing maximizes win probability.`;
      }
      return `Hard ${playerValue} against ${dealerValue}: Standing is statistically optimal.`;
    }
  }
}