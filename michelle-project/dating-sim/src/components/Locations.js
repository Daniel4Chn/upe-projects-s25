import React from 'react';

// This component handles tea room navigation and tea cup encounters
const Locations = ({ currentLocation, onLocationChange, onCharacterSelect, availableTeas, selectedTeas, visitedRooms }) => {
  // Define all tea rooms in the game
  const locations = [
    {
      id: 'lobby',
      name: 'Tea House Lobby',
      description: 'The central area where you can plan which tea room to visit next. The Tea Matchmaker is available here if you wish to make your final selection.',
      image: 'images/lobby.jpeg' 
    },
    {
      id: 'black-room',
      name: 'Black Tea Room',
      description: 'An elegant room with dark wooden furniture and rich, earthy scents. The ambiance is sophisticated and mysterious.',
      image: 'images/blackTeaRoom.jpeg' 
    },
    {
      id: 'green-room',
      name: 'Green Tea Room',
      description: 'A cozy space that somehow feels both inviting and slightly suffocating. Family photos cover the walls, and a pot of tea is always steaming.',
      image: 'images/greenTeaRoom.jpeg' 
    },
    {
      id: 'matcha-room',
      name: 'Matcha Room',
      description: 'A chaotic dorm room with textbooks and papers scattered everywhere. Empty coffee cups sit on various surfaces, and a stack of oversized hoodies is piled on a chair.',
      image: 'images/matchaRoom.jpg' 
    },
    {
      id: 'chrysanthemum-room',
      name: 'Chrysanthemum Tea Room',
      description: 'A dreamy space filled with vases of fresh flowers and the soft scent of perfume. Fairy lights twinkle above, and romance novels fill the bookshelf.',
      image: 'images/chrysRoom.jpeg' 
    },
    {
      id: 'rooibos-room',
      name: 'Rooibos Tea Room',
      description: 'An energetic room decorated with baseball pennants and sports memorabilia. Exercise equipment occupies one corner, and a blender for protein shakes sits ready in another.',
      image: 'images/rooibosRoom.jpg' 
    }
  ];

  // Find the current location object
  const location = locations.find(loc => loc.id === currentLocation) || locations[0];
  
  // Filter to show only rooms for selected teas plus the lobby
  // AND exclude rooms that have already been visited
  const availableLocations = locations.filter(loc => {
    // Lobby is always available
    if (loc.id === 'lobby') return true;
    
    // For tea rooms, check if the corresponding tea was selected
    // AND if the room hasn't been visited yet
    const teaRoomMap = {
      'black-room': 'black-tea',
      'green-room': 'green-tea',
      'matcha-room': 'matcha',
      'chrysanthemum-room': 'chrysanthemum',
      'rooibos-room': 'rooibos'
    };
    
    const correspondingTeaId = teaRoomMap[loc.id];
    
    // Room is available if:
    // 1. The tea is selected by the player
    // 2. The room has not been visited yet
    return selectedTeas.some(tea => tea.id === correspondingTeaId) && 
           !visitedRooms.includes(loc.id);
  });

  // Count how many rooms are left to visit
  const roomsLeftToVisit = selectedTeas.length - visitedRooms.length;

  return (
    <div className="location-container">
      <div className="location-info">
        <h2>{location.name}</h2>
        <div className="location-image">
          <img src={location.image} alt={location.name} />
        </div>
        <p>{location.description}</p>
        
        {/* Display rooms left counter */}
        <div className="rooms-counter">
          <p>Teas left to meet: {roomsLeftToVisit} of {selectedTeas.length}</p>
        </div>
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
          
          {/* Show visited room buttons but disabled */}
          {locations
            .filter(loc => 
              loc.id !== 'lobby' && 
              loc.id !== currentLocation && 
              visitedRooms.includes(loc.id)
            )
            .map(loc => (
              <button 
                key={loc.id} 
                disabled={true}
                className="location-button visited"
                title="You've already visited this room"
              >
                {loc.name} (Visited)
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
            {currentLocation === 'lobby' ? (
              roomsLeftToVisit === 1 ? (
                "The Tea Matchmaker smiles and reminds you, 'This will be the last room, hope it's your cup of tea!'"
              ) : roomsLeftToVisit === 2 ? (
                "The Tea Matchmaker looks at you and nods knowingly before going back to attend to others."
              ) : (
                "The Tea Matchmaker waits patiently in the corner. Choose a tea room to visit, or tell the Matchmaker your decision."
              )
            ) : (
              "There are no tea cups waiting in this room right now. Perhaps try another room?"
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default Locations;