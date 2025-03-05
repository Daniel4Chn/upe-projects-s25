import React from 'react';

// This component handles displaying the dialogue with the current tea
const Dialogue = ({ tea, dialogueHistory, relationship, playerName }) => {
  // If there's no dialogue yet, display the tea's introduction with player name if applicable
  const getIntroduction = () => {
    if (!tea.introduction) return "...";
    
    // For Green Tea, customize the introduction with the player's name
    if (tea.id === 'green-tea') {
      return tea.introduction.replace("dear!", `dear ${playerName}!`);
    }
    
    // For Rooibos, customize the introduction
    if (tea.id === 'rooibos') {
      return tea.introduction.replace("Hey!", `Hey ${playerName}!`);
    }
    
    return tea.introduction;
  };
  
  const currentDialogue = dialogueHistory.length > 0 
    ? dialogueHistory[dialogueHistory.length - 1].text 
    : getIntroduction();

  const getTeaIntro = (teaId) => {
    switch(teaId) {
      case 'black-tea':
        return "is staring intensely but dispassionately";
      case 'green-tea':
        return "is smiling sweetly, perhaps too sweetly";
      case 'matcha':
        return "seems barely awake and distracted";
      case 'chrysanthemum':
        return "looks wistfully melancholic";
      case 'rooibos':
        return "is energetically fidgeting";
      default:
        return "seems reserved";
    }
  };

  return (
    <div className="dialogue-container">
      <div className="tea-portrait">
        <img src={tea.image} alt={tea.name} />
        <h3>{tea.name}</h3>
        <p className="tea-mood">{getTeaIntro(tea.id)}</p>
      </div>
      
      <div className="dialogue-text">
        <p>{currentDialogue}</p>
      </div>
      
      <div className="dialogue-history">
        <h4>Conversation History</h4>
        <div className="history-scrollable">
          {dialogueHistory.slice(0, -1).map((entry, index) => (
            <div key={index} className="history-entry">
              <strong>{entry.character}:</strong> {entry.text}
            </div>
          ))}
        </div>
      </div>
      
      <div className="tea-compatibility">
        <div className="compatibility-meter">
          <div 
            className="meter-fill"
            style={{ width: `${Math.max(0, Math.min(100, relationship * 2))}%` }}
          ></div>
        </div>
        <p>Compatibility: {Math.max(0, Math.min(100, Math.round(relationship * 2)))}%</p>
      </div>
    </div>
  );
};

export default Dialogue;