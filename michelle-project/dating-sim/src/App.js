import React, { useState } from 'react';
import './App.css';
import TeaSelect from './components/TeaSelect';
import Dialogue from './components/Dialogue';
import Choice from './components/Choice';
import TeaRoom from './components/TeaRoom';
import GameOver from './components/GameOver';
import Locations from './components/Locations';

function App() {
  // Game state
  const [gameState, setGameState] = useState({
    currentScreen: 'start', // start, name-input, matchmaker, tea-select, locations, tea-room, dialogue, final-selection, game-over
    player: {
      name: 'Pinecone Bob', // Default name
      teaDatesCompleted: 0,
      selectedTeas: [], // Will hold the IDs of the selected teas
      currentTeaIndex: 0,
      visitCounts: {} // Track how many times each tea has been visited
    },
    teaRelationships: {}, // Stores favorability ratings for each tea
    currentTea: null,
    currentLocation: 'lobby', // Start in the lobby
    dialogueHistory: [],
    hasMetMatchmaker: false,
    gameTime: {
      day: 1,
      timeOfDay: 'evening' // Start in the evening
    }
  });

  // All available teas in the game based on your character profiles
  const allTeas = [
    { 
      id: 'black-tea', 
      name: 'Black Tea',
      image: '/placeholder-black-tea.png', // Replace with actual image path
      teaRoom: 'black-room',
      type: 'Black Tea',
      description: 'Chic, Mysterious',
      introduction: "...", // *stares intensely without saying much*
      personality: [
        "Likes cookies but refuses to admit they have a sweet tooth",
        "Doesn't really talk, but their stare is oddly intense",
        "Hobby is collecting knives, but claims it's 'for aesthetic purposes'",
        "Wears only black, occasionally dark red",
        "Always drinks tea at exactly 5 PM, no exceptions"
      ]
    },
    { 
      id: 'green-tea', 
      name: 'Green Tea',
      image: '/placeholder-green-tea.png', // Replace with actual image path
      teaRoom: 'green-room',
      type: 'Green Tea',
      description: 'The Yandere "Mother"',
      introduction: "Oh, dear! It's so lovely to meet you. I've been waiting for someone like you to come along. Would you like some tea? I've already prepared it just how you like it.",
      personality: [
        "Calls you 'dear' in the most unsettlingly sweet tone",
        "Will pour you green tea every morning, but never acknowledges it's green tea",
        "Keeps tabs on your schedule—'just to make sure you're okay'",
        "Has an eerily perfect memory, remembers everything you say",
        "Smiles through their jealousy... until they don't"
      ]
    },
    { 
      id: 'matcha', 
      name: 'Matcha',
      image: '/placeholder-matcha.png', // Replace with actual image path
      teaRoom: 'matcha-room',
      type: 'Matcha',
      description: 'The Sleepy College Kid',
      introduction: "*yawns* Hey... sorry, just got out of biochem. What's up? *checks phone* Wait, what are we doing again?",
      personality: [
        "Just got out of class and is too tired to function",
        "Chronically looking at their phone, even mid-conversation",
        "Doesn't know they're a cup of tea—gets confused when you mention it",
        "Can and will fall asleep anywhere, anytime",
        "Owns an absurd amount of oversized hoodies"
      ]
    },
    { 
      id: 'chrysanthemum', 
      name: 'Chrysanthemum Tea',
      image: '/placeholder-chrysanthemum.png', // Replace with actual image path
      teaRoom: 'chrysanthemum-room',
      type: 'Chrysanthemum Tea',
      description: 'The Emotional Softie',
      introduction: "Hi there... *sighs wistfully* The flowers are nice today, aren't they? They remind me of... nevermind. It's nice to meet you.",
      personality: [
        "Cries when you bring up their ex, even if they broke up years ago",
        "Smells like flowers and nostalgia",
        "Writes poetry but never shares it",
        "Keeps old love letters in a shoebox under their bed",
        "Has a love-hate relationship with romance movies"
      ]
    },
    { 
      id: 'rooibos', 
      name: 'Rooibos Tea',
      image: '/placeholder-rooibos.png', // Replace with actual image path
      teaRoom: 'rooibos-room',
      type: 'Rooibos Tea',
      description: 'The Sporty & Healthy One',
      introduction: "Hey! Great to meet you! I was just about to go for a run, but I'm so glad I caught you instead. Do you like baseball? There's a game this weekend!",
      personality: [
        "Not good with horror movies—hides behind you",
        "Loves baseball and will drag you to games",
        "Drinks protein shakes but secretly loves milkshakes too",
        "Insists on early morning jogs as 'a fun date idea'",
        "Is the type to give you their jacket, even when they're cold"
      ]
    }
  ];

  // Start a new game and ask for player name
  const startNewGame = () => {
    setGameState({
      ...gameState,
      currentScreen: 'name-input'
    });
  };
  
  // Set player name and continue to matchmaker
  const setPlayerName = (name) => {
    // If name is empty, keep the default
    const finalName = name.trim() ? name : gameState.player.name;
    
    setGameState({
      ...gameState,
      player: {
        ...gameState.player,
        name: finalName
      },
      currentScreen: 'matchmaker'
    });
  };

  // Meet with the matchmaker
  const meetMatchmaker = () => {
    setGameState({
      ...gameState,
      hasMetMatchmaker: true,
      currentScreen: 'tea-select'
    });
  };

  // Select teas to date
  const selectTeas = (selectedTeaIds) => {
    // Initialize relationships and visit counts for selected teas
    const initialRelationships = {};
    const initialVisitCounts = {};
    selectedTeaIds.forEach(id => {
      initialRelationships[id] = 0; // Start with 0 favorability
      initialVisitCounts[id] = 0; // Start with 0 visits
    });
    
    setGameState({
      ...gameState,
      player: {
        ...gameState.player,
        selectedTeas: selectedTeaIds,
        visitCounts: initialVisitCounts
      },
      teaRelationships: initialRelationships,
      currentScreen: 'locations', // Go to locations screen for navigation
      currentLocation: 'lobby' // Start in the lobby
    });
  };
  
  // Change current location
  const changeLocation = (locationId) => {
    setGameState({
      ...gameState,
      currentLocation: locationId,
      currentScreen: 'locations'
    });
  };
  
  // Select a tea to interact with
  const selectTea = (tea) => {
    setGameState({
      ...gameState,
      currentTea: tea,
      currentScreen: 'tea-room'
    });
  };

  // Start dialogue with current tea
  const startTeaDialogue = () => {
    // Update visit count for this tea
    const updatedVisitCounts = { ...gameState.player.visitCounts };
    updatedVisitCounts[gameState.currentTea.id] = (updatedVisitCounts[gameState.currentTea.id] || 0) + 1;
    
    setGameState({
      ...gameState,
      dialogueHistory: [], // Reset dialogue for new tea interaction
      player: {
        ...gameState.player,
        visitCounts: updatedVisitCounts
      },
      currentScreen: 'dialogue'
    });
  };

  // Handle player dialogue choices
  const makeChoice = (choice) => {
    // Update relationship with current tea
    const updatedRelationships = { ...gameState.teaRelationships };
    if (choice.effects && choice.effects.relationship) {
      updatedRelationships[gameState.currentTea.id] += choice.effects.relationship;
    }
    
    // Add dialogue to history
    const updatedDialogueHistory = [
      ...gameState.dialogueHistory,
      { character: gameState.player.name, text: choice.text },
      { character: gameState.currentTea.name, text: choice.response }
    ];
    
    // Check if this choice leads to an immediate ending
    if (choice.nextScreen === 'game-over') {
      setGameState({
        ...gameState,
        teaRelationships: updatedRelationships,
        dialogueHistory: updatedDialogueHistory,
        currentScreen: 'game-over',
        endingType: 'tea-selected', // Player chose this tea directly
        selectedTeaId: gameState.currentTea.id
      });
      return;
    }
    
    // Update game state
    setGameState({
      ...gameState,
      teaRelationships: updatedRelationships,
      dialogueHistory: updatedDialogueHistory,
      currentScreen: choice.nextScreen || 'dialogue'
    });
  };

  // Return to locations after a tea date
  const finishTeaDate = () => {
    // Update tea dates completed
    const updatedTeaDatesCompleted = gameState.player.teaDatesCompleted + 1;
    
    setGameState({
      ...gameState,
      player: {
        ...gameState.player,
        teaDatesCompleted: updatedTeaDatesCompleted
      },
      currentScreen: 'locations',
      currentLocation: 'lobby' // Return to lobby
    });
  };
  
  // Go to final selection screen
  const goToFinalSelection = () => {
    setGameState({
      ...gameState,
      currentScreen: 'final-selection'
    });
  };

  // Make final tea selection
  const makeFinalSelection = (teaId) => {
    setGameState({
      ...gameState,
      currentScreen: 'game-over',
      endingType: 'final-selection',
      selectedTeaId: teaId
    });
  };

  // Get a tea object by ID
  const getTeaById = (id) => {
    return allTeas.find(tea => tea.id === id);
  };

  // Get selected teas as objects
  const getSelectedTeas = () => {
    return gameState.player.selectedTeas.map(id => getTeaById(id));
  };
  
  // Get teas that are available at the current location
  const getAvailableTeasAtLocation = (locationId) => {
    // Map tea IDs to location IDs
    const teaLocationMap = {
      'black-tea': 'black-room',
      'green-tea': 'green-room',
      'matcha': 'matcha-room',
      'chrysanthemum': 'chrysanthemum-room',
      'rooibos': 'rooibos-room'
    };
    
    // If we're in the lobby, no teas are directly available
    if (locationId === 'lobby') return [];
    
    // If we're in a specific tea room, check if that tea is selected by the player
    const teaForLocation = Object.entries(teaLocationMap)
      .find(([teaId, roomId]) => roomId === locationId);
    
    if (teaForLocation && gameState.player.selectedTeas.includes(teaForLocation[0])) {
      return [getTeaById(teaForLocation[0])];
    }
    
    return [];
  };

  // Render the name input screen
  const renderNameInput = () => {
    return (
      <div className="name-input-screen">
        <h1>Welcome to the Tea House</h1>
        <p>Tell us your name, or we'll call you Pinecone Bob!</p>
        <input 
          type="text" 
          placeholder="Enter your name" 
          defaultValue=""
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setPlayerName(e.target.value);
            }
          }}
        />
        <div className="button-group">
          <button onClick={() => setPlayerName(document.querySelector('input').value)}>
            That's My Name
          </button>
          <button onClick={() => setPlayerName('Pinecone Bob')}>
            I'll be Pinecone Bob
          </button>
        </div>
      </div>
    );
  };

  // Render the current screen
  const renderScreen = () => {
    switch (gameState.currentScreen) {
      case 'start':
        return (
          <div className="start-screen">
            <h1>Tea House Dating Sim</h1>
            <p>Find your perfect cup of tea in this cozy tea house speed dating adventure!</p>
            <button onClick={startNewGame}>
              Enter Tea House
            </button>
          </div>
        );
      case 'name-input':
        return renderNameInput();
      case 'matchmaker':
        return (
          <div className="matchmaker-screen">
            <div className="matchmaker-portrait">
              <img src="/placeholder-matchmaker.png" alt="Tea Matchmaker" />
            </div>
            <div className="dialogue-text">
              <p>Welcome to our Tea House, {gameState.player.name}! I'm the Tea Matchmaker, and I'll help you find your perfect tea match tonight.</p>
              <p>We have five exceptional teas waiting to meet you, but unfortunately, we're close to closing time. You'll only have time to meet three of them thoroughly.</p>
              <p>Choose wisely - your perfect tea match awaits!</p>
            </div>
            <button onClick={meetMatchmaker}>
              Meet the Teas
            </button>
          </div>
        );
      case 'tea-select':
        return (
          <TeaSelect 
            allTeas={allTeas} 
            onSelect={selectTeas} 
            maxSelections={3}
          />
        );
      case 'locations':
        return (
          <div className="locations-screen">
            <Locations 
              currentLocation={gameState.currentLocation}
              onLocationChange={changeLocation}
              onCharacterSelect={selectTea}
              time={gameState.gameTime.timeOfDay}
              day={gameState.gameTime.day}
              availableTeas={getAvailableTeasAtLocation(gameState.currentLocation)}
              selectedTeas={getSelectedTeas()}
            />
            
            {/* Add a button to go to final selection */}
            {gameState.currentLocation === 'lobby' && (
              <div className="final-decision-button">
                <button onClick={goToFinalSelection}>
                  Tell the Matchmaker Your Decision
                </button>
              </div>
            )}
          </div>
        );
      case 'tea-room':
        return (
          <div className="tea-room-screen">
            <TeaRoom
              tea={gameState.currentTea}
              onStartDialogue={startTeaDialogue}
              playerName={gameState.player.name}
            />
            <button onClick={() => changeLocation('lobby')} className="return-to-lobby">
              Return to Lobby
            </button>
          </div>
        );
      case 'dialogue':
        return (
          <div className="dialogue-screen">
            <Dialogue 
              tea={gameState.currentTea}
              dialogueHistory={gameState.dialogueHistory}
              relationship={gameState.teaRelationships[gameState.currentTea.id]}
              playerName={gameState.player.name}
            />
            <Choice 
              tea={gameState.currentTea}
              makeChoice={makeChoice}
              relationship={gameState.teaRelationships[gameState.currentTea.id]}
              teaDatesCompleted={gameState.player.teaDatesCompleted}
              playerName={gameState.player.name}
            />
            <button onClick={finishTeaDate} className="end-dialogue">
              Thank the Tea and Leave
            </button>
          </div>
        );
      case 'final-selection':
        return (
          <div className="final-selection-screen">
            <h2>Time to Choose Your Perfect Tea Match</h2>
            <p>After meeting the teas, which one resonated with you the most?</p>
            <div className="tea-selection">
              {gameState.player.selectedTeas.map(teaId => {
                const tea = getTeaById(teaId);
                const relationship = gameState.teaRelationships[teaId];
                const visits = gameState.player.visitCounts[teaId] || 0;
                return (
                  <div key={teaId} className="tea-option">
                    <img src={tea.image} alt={tea.name} />
                    <h3>{tea.name}</h3>
                    <p>{tea.type}</p>
                    <p>Compatibility: {relationship}%</p>
                    <p>Visits: {visits}</p>
                    <button onClick={() => makeFinalSelection(teaId)}>
                      Choose {tea.name}
                    </button>
                  </div>
                );
              })}
            </div>
            <button onClick={() => changeLocation('lobby')} className="return-button">
              Not Ready Yet - Continue Visiting
            </button>
          </div>
        );
      case 'game-over':
        return (
          <GameOver 
            endingType={gameState.endingType}
            selectedTeaId={gameState.selectedTeaId}
            relationships={gameState.teaRelationships}
            teas={allTeas}
            playerName={gameState.player.name}
          />
        );
      default:
        return <div>Error: Unknown screen</div>;
    }
  };

  return (
    <div className="App">
      {renderScreen()}
    </div>
  );
}

export default App;