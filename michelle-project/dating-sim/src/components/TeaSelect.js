import React, { useState } from 'react';

// This component lets the player select 3 teas from the 5 available options
const TeaSelect = ({ allTeas, onSelect, maxSelections }) => {
  const [selectedTeas, setSelectedTeas] = useState([]);
  
  const toggleTeaSelection = (teaId) => {
    if (selectedTeas.includes(teaId)) {
      // Remove tea if already selected
      setSelectedTeas(selectedTeas.filter(id => id !== teaId));
    } else if (selectedTeas.length < maxSelections) {
      // Add tea if under max selections
      setSelectedTeas([...selectedTeas, teaId]);
    }
  };
  
  const isTeaSelected = (teaId) => {
    return selectedTeas.includes(teaId);
  };
  
  const confirmSelection = () => {
    if (selectedTeas.length === maxSelections) {
      onSelect(selectedTeas);
    }
  };

  return (
    <div className="tea-select">
      <h2>Choose {maxSelections} Teas to Meet</h2>
      <p>Select the teas that intrigue you the most for your speed dates.</p>
      
      <div className="tea-list">
        {allTeas.map(tea => (
          <div 
            key={tea.id} 
            className={`tea-card ${isTeaSelected(tea.id) ? 'selected' : ''}`} 
            onClick={() => toggleTeaSelection(tea.id)}
          >
            <div className="tea-image">
              <img src={tea.image} alt={tea.name} />
            </div>
            <h3>{tea.name}</h3>
            <p className="tea-type">{tea.type}</p>
            <p>{tea.description}</p>
            {isTeaSelected(tea.id) && (
              <div className="selection-indicator">Selected</div>
            )}
          </div>
        ))}
      </div>
      
      <div className="selection-status">
        <p>Selected: {selectedTeas.length}/{maxSelections} teas</p>
        <button 
          onClick={confirmSelection}
          disabled={selectedTeas.length !== maxSelections}
          className={selectedTeas.length === maxSelections ? 'ready' : 'not-ready'}
        >
          {selectedTeas.length === maxSelections ? 
            'Begin Speed Dating!' : 
            `Select ${maxSelections - selectedTeas.length} more tea${maxSelections - selectedTeas.length !== 1 ? 's' : ''}`
          }
        </button>
      </div>
    </div>
  );
};

export default TeaSelect;