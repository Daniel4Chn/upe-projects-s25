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

  // Calculate the tea's apparent mood based on relationship value
  const getTeaMood = (teaId, relationshipValue) => {
    if (relationshipValue <= 0) {
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
    } else if (relationshipValue < 25) {
      switch(teaId) {
        case 'black-tea':
          return "occasionally glances your way with slightly less intensity";
        case 'green-tea':
          return `is watching your every move with curious interest, occasionally murmuring "${playerName}" under their breath`;
        case 'matcha':
          return "has put their phone down at least twice during your conversation";
        case 'chrysanthemum':
          return "sighs dramatically less often when you speak";
        case 'rooibos':
          return "seems excited to tell you about their latest workout routine";
        default:
          return "appears mildly interested";
      }
    } else if (relationshipValue < 50) {
      switch(teaId) {
        case 'black-tea':
          return "has moved slightly closer, still maintaining intense eye contact";
        case 'green-tea':
          return `is taking notes about your preferences with alarming detail, whispering "${playerName}" every few seconds`;
        case 'matcha':
          return "is fighting sleep to stay engaged in your conversation";
        case 'chrysanthemum':
          return "occasionally tears up when you say something nice";
        case 'rooibos':
          return `keeps suggesting active date ideas with infectious enthusiasm, always including "${playerName}" in every scenario`;
        default:
          return "seems quite engaged";
      }
    } else if (relationshipValue < 75) {
      switch(teaId) {
        case 'black-tea':
          return `has softened their gaze slightly when saying "${playerName}", which for them is significant`;
        case 'green-tea':
          return `mentions future plans that somehow already include you, referring to you as "my dear ${playerName}"`;
        case 'matcha':
          return `is surprisingly alert and focused on your words, even remembering your name is ${playerName} consistently`;
        case 'chrysanthemum':
          return `seems to have composed a mental poem about ${playerName}'s visit today`;
        case 'rooibos':
          return "has offered you their jacket three times already";
        default:
          return "looks very pleased with the conversation";
      }
    } else {
      switch(teaId) {
        case 'black-tea':
          return `almost smiled when saying "${playerName}". Almost.`;
        case 'green-tea':
          return `is planning your future together with unsettling precision, constantly referring to "when ${playerName} and I are together forever"`;
        case 'matcha':
          return "hasn't checked their phone once in the past five minutes";
        case 'chrysanthemum':
          return `gazes at ${playerName} with the perfect mix of longing and hope`;
        case 'rooibos':
          return `can barely contain their excitement about sharing activities with ${playerName}`;
        default:
          return "is practically steaming with delight";
      }
    }
  };

  return (
    <div className="dialogue-container">
      <div className="tea-portrait">
        <img src={tea.image} alt={tea.name} />
        <h3>{tea.name}</h3>
        <p className="tea-mood">{getTeaMood(tea.id, relationship)}</p>
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
            style={{ width: `${Math.max(0, Math.min(100, relationship))}%` }}
          ></div>
        </div>
        <p>Compatibility: {Math.max(0, Math.min(100, relationship))}%</p>
      </div>
    </div>
  );
};

export default Dialogue;