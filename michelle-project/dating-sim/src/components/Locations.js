import React from 'react';

// This component handles tea room navigation and tea cup encounters
const Locations = ({ currentLocation, onLocationChange, onCharacterSelect, availableTeas, selectedTeas }) => {
  // Define all tea rooms in the game
  const locations = [
    {
      id: 'lobby',
      name: 'Tea House Lobby',
      description: 'The central area where you can plan which tea room to visit next. The Tea Matchmaker is available here if you wish to make your final selection.',
      image: '/placeholder-lobby.png' // Replace with actual image path
    },
    {
      id: 'black-room',
      name: 'Black Tea Room',
      description: 'An elegant room with dark wooden furniture and rich, earthy scents. The ambiance is sophisticated and mysterious.',
      image: '/placeholder-black-room.png' // Replace with actual image path
    },
    {
      id: 'green-room',
      name: 'Green Tea Room',
      description: 'A cozy space that somehow feels both inviting and slightly suffocating. Family photos cover the walls, and a pot of tea is always steaming.',
      image: '/placeholder-green-room.png' // Replace with actual image path
    },
    {
      id: 'matcha-room',
      name: 'Matcha Room',
      description: 'A chaotic dorm room with textbooks and papers scattered everywhere. Empty coffee cups sit on various surfaces, and a stack of oversized hoodies is piled on a chair.',
      image: '/placeholder-matcha-room.png' // Replace with actual image path
    },
    {
      id: 'chrysanthemum-room',
      name: 'Chrysanthemum Tea Room',
      description: 'A dreamy space filled with vases of fresh flowers and the soft scent of perfume. Fairy lights twinkle above, and romance novels fill the bookshelf.',
      image: '/placeholder-chrysanthemum-room.png' // Replace with actual image path
    },
    {
      id: 'rooibos-room',
      name: 'Rooibos Tea Room',
      description: 'An energetic room decorated with baseball pennants and sports memorabilia. Exercise equipment occupies one corner, and a blender for protein shakes sits ready in another.',
      image: '/placeholder-rooibos-room.png' // Replace with actual image path
    }
  ];

  // Find the current location object
  const location = locations.find(loc => loc.id === currentLocation) || locations[0];
  
  // Filter to show only rooms for selected teas plus the lobby
  const availableLocations = locations.filter(loc => {
    if (loc.id === 'lobby') return true;
    
    // For tea rooms, check if the corresponding tea was selected
    const teaRoomMap = {
      'black-room': 'black-tea',
      'green-room': 'green-tea',
      'matcha-room': 'matcha',
      'chrysanthemum-room': 'chrysanthemum',
      'rooibos-room': 'rooibos'
    };
    
    const correspondingTeaId = teaRoomMap[loc.id];
    return selectedTeas.some(tea => tea.id === correspondingTeaId);
  });

  return (
    <div className="location-container">
      <div className="location-info">
        <h2>{location.name}</h2>
        <div className="location-image">
          <img src={location.image} alt={location.name} />
        </div>
        <p>{location.description}</p>
      </div>
      
      <div className="location-navigation">
        <h3>Visit:</h3>
        <div className="location-buttons">
          {availableLocations
            .filter(loc => loc.id !== currentLocation)
            .map(loc => (
              <button 
                key={loc.id} 
                onClick={() => onLocationChange(loc.id)}
                className="location-button"
              >
                {loc.name}
              </button>
            ))
          }
        </div>
      </div>
      
      <div className="tea-cups-present">
        <h3>Tea Cups Here:</h3>
        {availableTeas.length > 0 ? (
          <div className="tea-cup-buttons">
            {availableTeas.map(teaCup => (
              <button 
                key={teaCup.id} 
                onClick={() => onCharacterSelect(teaCup)}
                className="tea-cup-button"
              >
                <img src={teaCup.image} alt={teaCup.name} />
                {teaCup.name}
              </button>
            ))}
          </div>
        ) : (
          <p>
            {currentLocation === 'lobby' 
              ? "The Tea Matchmaker waits patiently in the corner. Choose a tea room to visit, or tell the Matchmaker your decision." 
              : "There are no tea cups waiting in this room right now. Perhaps try another room?"}
          </p>
        )}
      </div>
    </div>
  );
};

// Helper function to capitalize the first letter
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default Locations;