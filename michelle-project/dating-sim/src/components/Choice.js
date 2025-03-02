import React from 'react';

// This component handles the player's dialogue choices with tea cups
const Choice = ({ tea, makeChoice, relationship, teaDatesCompleted, playerName }) => {
  // Get appropriate dialogue choices based on the tea and relationship
  const getChoices = () => {
    // Each choice has:
    // - text: What the player says
    // - response: What the tea cup says in response
    // - effects: How this choice affects relationship
    // - nextScreen: Where to go after this choice
    
    // Base choices depend on which tea we're talking to
    let baseChoices = [];
    
    switch(tea.id) {
      case 'black-tea':
        baseChoices = [
          {
            text: "I noticed you're wearing all black. Is that your favorite color?",
            response: "...*stares intensely*... Yes. Black suits me. Occasionally dark red.",
            effects: { relationship: 2 }
          },
          {
            text: "Would you like a cookie?",
            response: "No. I don't like... *eyes the cookie* ...sweet things. *continues staring at the cookie*",
            effects: { relationship: 3 }
          },
          {
            text: "You're quite quiet, aren't you?",
            response: `...*stares even more intensely at ${playerName}*`,
            effects: { relationship: 1 }
          }
        ];
        
        if (relationship >= 15) {
          baseChoices.push({
            text: "What are your hobbies?",
            response: `*briefly glances at ${playerName}* Oh, I like collecting sharp objects, you know just for aesthetic purposes.`,
            effects: { relationship: 5 }
          });
        }
        break;
        
      case 'green-tea':
        baseChoices = [
          {
            text: "This is delicious tea. What kind is it?",
            response: `Oh, dear ${playerName}, I'm so glad you like it! It's just a special blend I make every morning. *doesn't acknowledge it's green tea*`,
            effects: { relationship: 2 }
          },
          {
            text: "Do you have any hobbies?",
            response: `I love taking care of others, dear ${playerName}! Speaking of which, I noticed you were out late last night. Everything okay?`,
            effects: { relationship: 3 }
          },
          {
            text: "I should probably get going soon...",
            response: `No, ${playerName}.`,
            effects: { relationship: -5 },
            nextScreen: 'game-over' // Special bad ending for Green Tea
          }
        ];
        
        if (relationship >= 20) {
          baseChoices.push({
            text: "You remember everything I say, don't you?",
            response: `Of course, dear ${playerName}! Like how you mentioned your favorite color was blue on Tuesday at 3:42 PM, and how you prefer your sandwiches with the crusts cut off, and how you sleep with your window open exactly 3 inches...`,
            effects: { relationship: relationship > 40 ? 5 : -5 } // This is either endearing or creepy depending on relationship
          });
        }
        break;
        
      case 'matcha':
        baseChoices = [
          {
            text: "What's your major in college?",
            response: "*yawns* Biochem... I think. Maybe it was Biophysics? *checks phone* Sorry, what was the question?",
            effects: { relationship: 3 }
          },
          {
            text: "You look really tired. Late night studying?",
            response: `Always... *starts nodding off* Sorry, ${playerName}! I was up all night writing a paper about... uh... something. Coffee doesn't even help anymore.`,
            effects: { relationship: 4 }
          },
          {
            text: "Nice hoodie. Where'd you get it?",
            response: `Thanks! I have like twenty of these. They're basically my uniform. This one's from... *falls asleep for 3 seconds* ...sorry, ${playerName}, what were we talking about?`,
            effects: { relationship: 3 }
          }
        ];
        
        if (relationship >= 15) {
          baseChoices.push({
            text: "You know you're a cup of tea, right?",
            response: `I'm a what now? *looks confused at ${playerName}* Is that like, some kind of new slang? I'm not up on the latest lingo, too busy with exams...`,
            effects: { relationship: 5 }
          });
        }
        break;
        
      case 'chrysanthemum':
        baseChoices = [
          {
            text: "You smell nice, like flowers.",
            response: `*sighs softly* Thank you, ${playerName}... the scent reminds me of spring days and... memories that linger like perfume.`,
            effects: { relationship: 4 }
          },
          {
            text: "Do you write? You seem like someone who would.",
            response: "I... dabble in poetry sometimes. Nothing I'd ever share though. The words are too... personal.",
            effects: { relationship: 3 }
          },
          {
            text: "What's your favorite movie?",
            response: `I love romance films... even though they make me cry every time. Sometimes I watch 'The Notebook' just to feel something, you know, ${playerName}?`,
            effects: { relationship: 3 }
          }
        ];
        
        if (relationship >= 10) {
          baseChoices.push({
            text: "Tell me about your ex.",
            response: "*eyes immediately well up with tears* I... I... *starts sobbing uncontrollably*",
            effects: { relationship: -10 },
            nextScreen: 'game-over' // Special bad ending for Chrysanthemum
          });
        }
        break;
        
      case 'rooibos':
        baseChoices = [
          {
            text: "Do you play any sports?",
            response: `Baseball's my life, ${playerName}! I've got season tickets—we should go sometime! Nothing beats the crack of the bat and the roar of the crowd!`,
            effects: { relationship: 4 }
          },
          {
            text: "What's your idea of a perfect date?",
            response: `Early morning jog to watch the sunrise, followed by a protein smoothie! *notices ${playerName}'s expression* Or, you know, maybe a movie? But not horror—I can't handle those!`,
            effects: { relationship: 3 }
          },
          {
            text: "You look cold. Do you want my jacket?",
            response: `*already taking off their jacket to give to ${playerName}* No, YOU take MINE! I'm totally fine! *visibly shivers*`,
            effects: { relationship: 5 }
          }
        ];
        
        if (relationship >= 15) {
          baseChoices.push({
            text: "I noticed a milkshake cup in your bag. Thought you were all about protein shakes?",
            response: `*blushes* Okay, ${playerName}, you caught me! I love milkshakes—especially strawberry ones! But don't tell anyone, I've got a healthy reputation to maintain!`,
            effects: { relationship: 6 }
          });
        }
        break;
      
      default:
        // Default choices if none of the specific teas match
        baseChoices = [
          {
            text: "Tell me about yourself.",
            response: `I'm a tea with many qualities, ${playerName}. What would you like to know?`,
            effects: { relationship: 2 }
          },
          {
            text: "What do you enjoy doing?",
            response: "I have various interests that make me unique.",
            effects: { relationship: 2 }
          },
          {
            text: "How's your day been?",
            response: `It's been steeping along nicely, thank you for asking, ${playerName}.`,
            effects: { relationship: 3 }
          }
        ];
    }
    
    // Add generic flirt option for all teas if relationship is high enough
    if (relationship >= 30) {
      baseChoices.push({
        text: "You're my cup of tea, I think.",
        response: getFlirtResponse(tea.id, relationship, playerName),
        effects: {
          relationship: relationship > 50 ? 5 : 2
        }
      });
    }
    
    // Special choice if relationship is high enough to select this tea right now
    if (relationship >= 60) {
      baseChoices.push({
        text: "I'd like to choose you as my tea match right now.",
        response: getFinalChoiceResponse(tea.id, playerName),
        effects: {
          relationship: 10
        },
        nextScreen: 'game-over' // This will trigger the immediate ending
      });
    }
    
    return baseChoices;
  };
  
  // Helper functions for tea-specific responses
  const getFlirtResponse = (teaId, relationshipValue, playerName) => {
    switch(teaId) {
      case 'black-tea':
        return relationshipValue > 50 ? 
          `...*intense stare softens slightly toward ${playerName}*... You have acceptable taste.` : 
          "...*stares at you silently for an uncomfortably long time*";
      case 'green-tea':
        return relationshipValue > 50 ? 
          `Oh, dear ${playerName}! *claps hands excitedly* I knew we were meant to be together! I'll take such good care of you, forever and ever!` : 
          `Oh my, that's so sweet of you, dear ${playerName}. *smiles a bit too widely* I think we need more time together. Much more time.`;
      case 'matcha':
        return relationshipValue > 50 ? 
          `*suddenly fully awake* Wait, really? That's... that's awesome, ${playerName}! *blushes and pulls hoodie strings tight*` : 
          "*looks up from phone* Oh, um, that's cool. *awkward smile* Sorry, what were we talking about?";
      case 'chrysanthemum':
        return relationshipValue > 50 ? 
          `*eyes well up with tears* That's the most beautiful thing anyone has said to me since... *wipes away a tear* Thank you for seeing me, ${playerName}.` : 
          "*blinks rapidly* Oh! I... um... *looks away* That's very kind, but I don't want to get hurt again...";
      case 'rooibos':
        return relationshipValue > 50 ? 
          `Yes! Home run, ${playerName}! *fist pumps* I mean, *composes self* I feel the same way. Want to go for a celebratory jog?` : 
          "*blushes bright red* Wow, I... thanks! I'm not used to people being so direct. It's refreshing, like after a good workout!";
      default:
        return `I'm quite flattered by your interest, ${playerName}. Perhaps we should get to know each other better.`;
    }
  };
  
  const getFinalChoiceResponse = (teaId, playerName) => {
    switch(teaId) {
      case 'black-tea':
        return `...Very well, ${playerName}. *nods once* Be at my residence at 5 PM sharp for tea. Don't be late.`;
      case 'green-tea':
        return `Oh, my dear ${playerName}! *eyes gleam with intensity* I knew from the moment I saw you that you were the one! We'll be so happy together... I'll make sure of it.`;
      case 'matcha':
        return `*suddenly alert* Wait, seriously? Me? *genuine smile* That would be amazing, ${playerName}. I promise I'll try to stay awake on our dates... mostly.`;
      case 'chrysanthemum':
        return `*tears of joy* I never thought I'd feel this way again... I promise to cherish every moment we have together, ${playerName}, like pressed flowers in a book of memories.`;
      case 'rooibos':
        return `Yes! *picks ${playerName} up in a hug* This is going to be amazing! I already have so many activities planned for us - hiking, baseball games, morning runs... but also quiet times too, I promise!`;
      default:
        return `I would be honored to be your chosen tea, ${playerName}. I feel we have a wonderful future brewing together!`;
    }
  };

  const choices = getChoices();

  return (
    <div className="choice-container">
      <h3>What would you like to discuss?</h3>
      <div className="choices-list">
        {choices.map((choice, index) => (
          <button 
            key={index} 
            className="choice-button"
            onClick={() => makeChoice(choice)}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Choice;