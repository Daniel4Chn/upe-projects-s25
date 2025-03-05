import React from 'react';

// This component handles the tea-specific room display
const TeaRoom = ({ tea, onStartDialogue, playerName }) => {
  // Tea room descriptions based on tea type
  const getRoomDescription = (teaId) => {
    switch(teaId) {
      case 'black-tea':
        return "A sleek, minimalist room with black furniture and dark red accents. A glass display case with an impressive collection of ornamental knives lines one wall. The clock on the wall shows exactly 5 PM, and every surface is immaculately clean.";
      case 'green-tea':
        return `A cozy room that somehow feels both inviting and slightly suffocating. Family photos (all featuring Green Tea but with the other subjects suspiciously blurred) cover the walls. A pot of tea is already steaming on the table, as if they knew exactly when ${playerName} would arrive.`;
      case 'matcha':
        return "A chaotic dorm room with textbooks and papers scattered everywhere. At least five empty coffee cups sit on various surfaces, and a stack of oversized hoodies is piled on a chair. The bed looks permanently unmade, and a laptop displays a half-written essay.";
      case 'chrysanthemum':
        return "A dreamy space filled with vases of fresh flowers and the soft scent of perfume. Fairy lights twinkle above, and a collection of romance novels fills the bookshelf. A shoebox partially visible under the bed seems to contain old letters tied with ribbon.";
      case 'rooibos':
        return "An energetic room decorated with baseball pennants and sports memorabilia. Exercise equipment occupies one corner, and a blender for protein shakes sits ready in another. The space is bright and airy, with large windows perfect for watching the sunrise.";
      default:
        return "A beautifully designed tea room with comfortable seating and a pleasant atmosphere.";
    }
  };

  // Get tea-specific waiting text
  const getTeaWaitingText = (teaId, name) => {
    switch(teaId) {
      case 'black-tea':
        return `${tea.name} is waiting for you, staring intensely. They seem to have been expecting ${name} precisely at this time.`;
      case 'green-tea':
        return `${tea.name} is waiting for ${name}, smiling sweetly. There's a fresh cup of tea on the table, and somehow it's still the perfect temperature.`;
      case 'matcha':
        return `${tea.name} is half-asleep on the couch, but perks up slightly when ${name} enters. Their phone is nearby, but they actually put it down.`;
      case 'chrysanthemum':
        return `${tea.name} is gazing wistfully out the window, but turns when ${name} enters, a small smile forming. A thoughtful cup of tea waits.`;
      case 'rooibos':
        return `${tea.name} is stretching energetically and immediately brightens when seeing ${name}. They've already prepared a protein smoothie and a tea.`;
      default:
        return `${tea.name} is waiting patiently. A cup of freshly brewed tea sits on the table.`;
    }
  };

  return (
    <div className="tea-room">
      <h2>{getTeaRoomName(tea.teaRoom)}</h2>
      
      <div className="room-description">
        <p>{getRoomDescription(tea.id)}</p>
      </div>
      
      <div className="tea-waiting">
        <div className="tea-portrait">
          <img src={tea.image} alt={tea.name} />
        </div>
        <h3>{tea.name}</h3>
        <p className="tea-type">{tea.description}</p>
        
        <div className="tea-anticipation">
          <p>{getTeaWaitingText(tea.id, playerName)}</p>
        </div>
        
        <button 
          className="approach-button"
          onClick={onStartDialogue}
        >
          Approach {tea.name}
        </button>
      </div>
    </div>
  );
};

// Helper function to get friendly room name
const getTeaRoomName = (roomId) => {
  const roomNames = {
    'black-room': 'Elegant Dark Chamber',
    'green-room': 'Motherly Comfort Room',
    'matcha-room': 'College Dorm Suite',
    'chrysanthemum-room': 'Nostalgic Memory Haven',
    'rooibos-room': 'Energetic Sports Den'
  };
  
  return roomNames[roomId] || 'Tea Room';
};

export default TeaRoom;