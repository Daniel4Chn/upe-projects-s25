import React, { useEffect } from 'react';

const MatchmakerInterruption = ({ playerName, teaName, onComplete }) => {
  useEffect(() => {
    // Auto-advance after a delay
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 6000); // 6-second delay before auto-advancing
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="matchmaker-interruption-overlay">
      <div className="matchmaker-popup">
        <div className="matchmaker-portrait">
          <img src="images/matchMaker.jpeg" alt="Tea Matchmaker" />
        </div>
        <div className="matchmaker-message">
          <h3>Time's Up!</h3>
          <p>*knocks on door*</p>
          <p>
            Excuse me, {playerName}! I'm afraid your time with {teaName} is up. There are other teas waiting to meet you!
          </p>
          <p className="countdown">Returning to lobby in a moment...</p>
        </div>
      </div>
    </div>
  );
};

export default MatchmakerInterruption;