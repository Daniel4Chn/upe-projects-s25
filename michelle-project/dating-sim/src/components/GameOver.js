import React from 'react';

// This component displays the game over screen with tea selection results
const GameOver = ({ endingType, selectedTeaId, relationships, teas, playerName }) => {
  // Get the selected tea object
  const selectedTea = teas.find(tea => tea.id === selectedTeaId);
  const relationship = relationships[selectedTeaId] || 0;
  
  // Default to "Pinecone Bob" if no player name is provided
  const name = playerName || "Pinecone Bob";
  
  // Determine the ending based on relationship value and ending type
  const getEnding = () => {
    // Check for special bad endings first - these override everything else
    if (selectedTea.id === 'green-tea' && endingType === 'special-bad-ending') {
      return {
        title: "You Can Never Leave",
        description: `As you try to excuse yourself, Green Tea's smile freezes. "No, dear ${name}. We're just getting started." The door mysteriously locks, and you realize you might be here for... quite some time. Green Tea will take very good care of you, whether you like it or not.`,
        image: 'images/yandere.png'
      };
    }
    
    if (selectedTea.id === 'chrysanthemum' && endingType === 'special-bad-ending') {
      return {
        title: "Emotional Overflow",
        description: `Chrysanthemum Tea breaks down completely at the mention of their ex. Between sobs, they apologize profusely to you, ${name}, as the matchmaker gently escorts you from the room. Some wounds are still too fresh, even for a tea as sweet as Chrysanthemum.`,
        image: 'images/teaUnsure.png'
      };
    }
    
    // Standard endings based on relationship value with adjusted thresholds
    if (relationship < 20) {
      return {
        title: "Not a Perfect Match",
        description: `${selectedTea.name} appreciates your interest, ${name}, but doesn't feel you've developed enough of a connection. Perhaps you should try a different tea variety.`,
        image: 'images/teaReject.jpeg'
      };
    }
    
    // If relationship is medium, it's a friendship ending
    if (relationship < 35) {
      return {
        title: "A Pleasant Acquaintance",
        description: `You and ${selectedTea.name} enjoy each other's company, ${name}, but perhaps aren't the perfect match. You'll certainly enjoy having this tea occasionally.`,
        image: 'images/teaFriend.png'
      };
    }
    
    // If relationship is high, it's a perfect match ending
    return {
      title: "A Perfect Brew!",
      description: `You and ${selectedTea.name} are a perfect match, ${name}! You'll be enjoying many wonderful cups together in a harmonious relationship.`,
      image: 'images/teaMatched.jpeg'
    };
  };
  
  // Get tea-specific ending details
  const getTeaSpecificEnding = (teaId, relationship, playerName) => {
    // Don't show specific details for bad endings or for low relationship values
    if (endingType === 'game-over' || relationship < 35) return ""; 
    
    switch(teaId) {
      case 'black-tea':
        return `Life with Black Tea is elegant, mysterious, and surprisingly sweet (though they'd never admit it). You learn to appreciate the silence, ${playerName}, and every day at exactly 5 PM, you share tea together. Their knife collection has moved to a beautiful display case, which they assure you is 'purely for aesthetic purposes.' Sometimes you catch them sneaking cookies when they think you aren't looking.`;
      case 'green-tea':
        return `Life with Green Tea is... closely monitored. You never go anywhere without them knowing, ${playerName}, and somehow they've memorized your entire schedule. Each morning they serve you 'a special blend' (it's always green tea), and they've redecorated your entire home without asking. They're always smiling... always watching... and strangely, you find yourself quite comfortable with the arrangement.`;
      case 'matcha':
        return `Life with Matcha is chaotic but endearing, ${playerName}. They still fall asleep mid-conversation and own way too many hoodies (which you now borrow regularly). You've gotten used to gentle snoring during movies and reminding them of appointments. They still don't quite understand the concept that they're a tea, but honestly, it doesn't matter anymore. Their drowsy smile when they wake up next to you makes everything worthwhile.`;
      case 'chrysanthemum':
        return `Life with Chrysanthemum Tea is emotionally rich, if sometimes tearful, ${playerName}. Your home always smells of flowers and nostalgia, and you've become the trusted keeper of their poetry (which is actually quite beautiful). The shoebox of old love letters has been respectfully put away, replaced by the notes you leave each other. You've learned to keep tissues handy during movie night, especially when watching anything remotely romantic.`;
      case 'rooibos':
        return `Life with Rooibos Tea is active and heartwarming, ${playerName}. Somehow you've been convinced that sunrise jogs aren't so bad, and you now have baseball season tickets. They still hide behind you during horror movies, and you've discovered their secret stash of milkshake loyalty cards. No matter how cold it gets, they insist you take their jacket, and truthfully, it's become your favorite piece of clothing.`;
      default:
        return `Your chosen tea brings unique qualities that complement your life perfectly, ${playerName}.`;
    }
  };
  
  const ending = getEnding();
  const teaSpecificDetails = getTeaSpecificEnding(selectedTeaId, relationship, name);

  return (
    <div className="game-over-container">
      <h1>Your Tea Journey Concludes, {name}</h1>
      
      <div className="ending-result">
        <div className="ending-image">
          <img src={ending.image} alt={ending.title} />
        </div>
        
        <h2>{ending.title}</h2>
        <p>{ending.description}</p>
        
        {teaSpecificDetails && (
          <div className="tea-specific-ending">
            <p>{teaSpecificDetails}</p>
          </div>
        )}
      </div>
      
      <div className="tea-selection-summary">
        <h3>Your Chosen Tea</h3>
        <div className="chosen-tea">
          <img src={selectedTea.image} alt={selectedTea.name} />
          <h4>{selectedTea.name}</h4>
          <p>{selectedTea.type}</p>
          <p>Compatibility: {Math.max(0, Math.min(100, Math.round(relationship * 2)))}%</p>
        </div>
      </div>
      
      <div className="matchmaker-comment">
        <p>
          {relationship >= 35 ? 
            `The Tea Matchmaker smiles warmly at ${name}, pleased to have helped you find your perfect tea match.` :
            `The Tea Matchmaker nods thoughtfully. "Perhaps we should try again another evening to find your perfect tea match, ${name}."`}
        </p>
      </div>
      
      <button onClick={() => window.location.reload()}>
        Visit Tea House Again
      </button>
    </div>
  );
};

export default GameOver;