import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State management using useState
  const [count, setCount] = useState(() => {
    // Initialize from localStorage if available
    const savedCount = localStorage.getItem('counterValue');
    return savedCount ? parseInt(savedCount) : 0;
  });
  
  const [stepSize, setStepSize] = useState(() => {
    const savedStep = localStorage.getItem('stepSize');
    return savedStep ? parseInt(savedStep) : 1;
  });
  
  const [allowNegative, setAllowNegative] = useState(() => {
    const savedAllowNegative = localStorage.getItem('allowNegative');
    return savedAllowNegative ? JSON.parse(savedAllowNegative) : false;
  });
  
  const upperBound = 100;
  const [lowerBound, setLowerBound] = useState(allowNegative ? -100 : 0);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('counterValue', count.toString());
  }, [count]);

  useEffect(() => {
    localStorage.setItem('stepSize', stepSize.toString());
  }, [stepSize]);

  useEffect(() => {
    localStorage.setItem('allowNegative', allowNegative.toString());
  }, [allowNegative]);

  // Update lower bound when allowNegative changes
  useEffect(() => {
    setLowerBound(allowNegative ? -100 : 0);
    // Adjust count if it's below new lower bound
    if (!allowNegative && count < 0) {
      setCount(0);
    }
  }, [allowNegative, count]);

  // Event handlers
  const handleIncrement = () => {
    if (count + stepSize <= upperBound) {
      setCount(prevCount => prevCount + stepSize);
    }
  };

  const handleDecrement = () => {
    if (count - stepSize >= lowerBound) {
      setCount(prevCount => prevCount - stepSize);
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const handleStepChange = (e) => {
    const newStep = parseInt(e.target.value) || 1;
    setStepSize(Math.max(1, newStep)); // Ensure step size is at least 1
  };

  const handleToggleNegative = () => {
    setAllowNegative(!allowNegative);
  };

  // Conditional rendering and button states
  const isIncrementDisabled = count + stepSize > upperBound;
  const isDecrementDisabled = count - stepSize < lowerBound;
  const isResetDisabled = count === 0;

  // Dynamic styling based on state
  const getCounterColor = () => {
    if (count === 0) return '#666';
    if (count > 0) return '#28a745';
    return '#dc3545';
  };

  const getCounterSize = () => {
    const absCount = Math.abs(count);
    if (absCount >= 100) return '2.5rem';
    if (absCount >= 50) return '2.2rem';
    if (absCount >= 10) return '2rem';
    return '1.8rem';
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎯 React Counter App</h1>
        <p>A simple and interactive counter application demonstrating React concepts</p>
      </header>

      <main className="counter-container">
        {/* Counter Display */}
        <div className="counter-display">
          <h2 
            className="counter-value"
            style={{
              color: getCounterColor(),
              fontSize: getCounterSize(),
              transition: 'all 0.3s ease'
            }}
          >
            {count}
          </h2>
          <p className="counter-label">Current Value</p>
        </div>

        {/* Control Buttons */}
        <div className="button-group">
          <button
            className={`control-btn decrement ${isDecrementDisabled ? 'disabled' : ''}`}
            onClick={handleDecrement}
            disabled={isDecrementDisabled}
          >
            ➖ Decrement
          </button>
          
          <button
            className={`control-btn reset ${isResetDisabled ? 'disabled' : ''}`}
            onClick={handleReset}
            disabled={isResetDisabled}
          >
            🔄 Reset
          </button>
          
          <button
            className={`control-btn increment ${isIncrementDisabled ? 'disabled' : ''}`}
            onClick={handleIncrement}
            disabled={isIncrementDisabled}
          >
            ➕ Increment
          </button>
        </div>

        {/* Settings Panel */}
        <div className="settings-panel">
          <h3>⚙️ Settings</h3>
          
          <div className="setting-item">
            <label htmlFor="stepSize">Step Size:</label>
            <input
              id="stepSize"
              type="number"
              min="1"
              max="50"
              value={stepSize}
              onChange={handleStepChange}
              className="step-input"
            />
          </div>

          <div className="setting-item">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={allowNegative}
                onChange={handleToggleNegative}
                className="toggle-input"
              />
              <span className="toggle-slider"></span>
              Allow Negative Values
            </label>
          </div>

          <div className="bounds-info">
            <p><strong>Bounds:</strong> {lowerBound} to {upperBound}</p>
            <p><strong>Current Step:</strong> {stepSize}</p>
          </div>
        </div>

        {/* Status Messages */}
        <div className="status-messages">
          {isIncrementDisabled && (
            <p className="status-warning">⚠️ Maximum value reached!</p>
          )}
          {isDecrementDisabled && (
            <p className="status-warning">⚠️ Minimum value reached!</p>
          )}
          {count === 0 && (
            <p className="status-info">ℹ️ Counter is at zero</p>
          )}
        </div>
      </main>

      <footer className="App-footer">
        <p>Built with React • Demonstrates useState, Event Handling, and Conditional Rendering</p>
      </footer>
    </div>
  );
}

export default App;
