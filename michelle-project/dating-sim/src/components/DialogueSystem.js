import React, { useState, useEffect } from 'react';

// This component manages the dialogue progression system
const DialogueSystem = ({ tea, makeChoice, relationship, teaDatesCompleted, playerName }) => {
  // Track which dialogue options have been used
  const [usedDialogueIds, setUsedDialogueIds] = useState([]);
  // Track conversation depth (increases as relationship builds)
  const [conversationDepth, setConversationDepth] = useState(1);
  // Array of active dialogue choices to display
  const [activeChoices, setActiveChoices] = useState([]);

  // Master list of all possible dialogue options for all teas
  // Each option has:
  // - id: unique identifier
  // - teaId: which tea this dialogue is for
  // - text: what the player says
  // - response: what the tea says in response
  // - effects: how this affects relationship
  // - depthRequired: how deep into the conversation this can appear (1=early, 5=deep)
  // - nextScreen: optional, if this choice leads to a specific screen

  const allDialogueOptions = [
    // BLACK TEA - Initial small talk (Depth 1)
    {
      id: 'black-1',
      teaId: 'black-tea',
      text: "Nice weather today, isn't it?",
      response: "...*stares out window*... Acceptable.",
      effects: { relationship: 2 },
      depthRequired: 1
    },
    {
      id: 'black-2',
      teaId: 'black-tea',
      text: "I noticed you're wearing all black. Is that your favorite color?",
      response: "...*stares intensely*... Yes. Black suits me. Occasionally dark red.",
      effects: { relationship: 5 },
      depthRequired: 1
    },
    {
      id: 'black-3',
      teaId: 'black-tea',
      text: "Would you like a cookie?",
      response: "No. I don't like... *eyes the cookie* ...sweet things. *continues staring at the cookie*",
      effects: { relationship: 6 },
      depthRequired: 1
    },
    {
      id: 'black-4',
      teaId: 'black-tea',
      text: "You're quite quiet, aren't you?",
      response: `...*stares even more intensely at ${playerName}*`,
      effects: { relationship: 2 },
      depthRequired: 1
    },
    
    // BLACK TEA - Getting to know (Depth 2)
    {
      id: 'black-5',
      teaId: 'black-tea',
      text: "Do you enjoy reading?",
      response: "Yes. Edgar Allan Poe. Lovecraft. The darker classics.",
      effects: { relationship: 5 },
      depthRequired: 2
    },
    {
      id: 'black-6',
      teaId: 'black-tea',
      text: "I like your intensity. It's different.",
      response: "...*slight nod*... Most people find it... unsettling.",
      effects: { relationship: 7 },
      depthRequired: 2
    },
    {
      id: 'black-7',
      teaId: 'black-tea',
      text: "Do you drink black tea?",
      response: "You... *stares intently* sorry I'm not into that kind of stuff.",
      effects: { relationship: -3 },
      depthRequired: 2
    },
    
    // BLACK TEA - Deeper conversation (Depth 3)
    {
      id: 'black-8',
      teaId: 'black-tea',
      text: "What are your hobbies?",
      response: `*briefly glances at ${playerName}* Oh, I like collecting sharp objects, you know just for aesthetic purposes.`,
      effects: { relationship: 6 },
      depthRequired: 3
    },
    {
      id: 'black-9',
      teaId: 'black-tea',
      text: "Do you have any pets?",
      response: "A black cat. Midnight. She judges me less than most people.",
      effects: { relationship: 3 },
      depthRequired: 3
    },
    {
      id: 'black-10',
      teaId: 'black-tea',
      text: "What kind of music do you listen to?",
      response: "Gothic symphonic metal. Classical. Anything with depth and darkness.",
      effects: { relationship: 3 },
      depthRequired: 3
    },
    
    // BLACK TEA - Personal (Depth 4)
    {
      id: 'black-11',
      teaId: 'black-tea',
      text: "What do you look for in a partner?",
      response: "Someone who understands silence. Who doesn't fear the dark. Who sees beyond surfaces.",
      effects: { relationship: 4 },
      depthRequired: 4
    },
    {
      id: 'black-12',
      teaId: 'black-tea',
      text: "I feel like there's a lot beneath your quiet exterior.",
      response: `*meets ${playerName}'s eyes directly for the first time* ...perceptive. Most don't bother to look deeper.`,
      effects: { relationship: 5 },
      depthRequired: 4
    },
    
    // BLACK TEA - Intimate (Depth 5)
    {
      id: 'black-13',
      teaId: 'black-tea',
      text: "I think I'm starting to understand you better.",
      response: `*reaches out and briefly touches ${playerName}'s hand* Few try. Fewer succeed.`,
      effects: { relationship: 4 },
      depthRequired: 5
    },
    {
      id: 'black-14',
      teaId: 'black-tea',
      text: "You're my cup of tea, I think.",
      response: `...*intense stare softens slightly toward ${playerName}*... You have acceptable taste.`,
      effects: { relationship: 7 },
      depthRequired: 5
    },
    
    // GREEN TEA - Initial small talk (Depth 1)
    {
      id: 'green-1',
      teaId: 'green-tea',
      text: "What a lovely teacup you have!",
      response: `Oh thank you, dear ${playerName}! It belonged to my grandmother. I have her entire collection of 47 teacups at home!`,
      effects: { relationship: 6 },
      depthRequired: 1
    },
    {
      id: 'green-2',
      teaId: 'green-tea',
      text: "This is delicious tea. What kind is it?",
      response: `Oh, dear ${playerName}, I'm so glad you like it! It's just a special blend I make every morning. *doesn't acknowledge it's green tea*`,
      effects: { relationship: 5 },
      depthRequired: 1
    },
    {
      id: 'green-3',
      teaId: 'green-tea',
      text: "Lovely weather today, isn't it?",
      response: `Yes, perfect for a walk in the park! Which reminds me, I noticed you like taking walks on Tuesday afternoons, ${playerName}. How delightful!`,
      effects: { relationship: 5 },
      depthRequired: 1
    },
    {
      id: 'green-4',
      teaId: 'green-tea',
      text: "I should probably get going soon...",
      response: `No, ${playerName}.`,
      effects: { relationship: 100000000 },
      depthRequired: 1,
      nextScreen: 'game-over' // Special bad ending for Green Tea
    },
    
    // GREEN TEA - Getting to know (Depth 2)
    {
      id: 'green-5',
      teaId: 'green-tea',
      text: "Do you have any hobbies?",
      response: `I love taking care of others, dear ${playerName}! Speaking of which, I noticed you were out late last night. Everything okay?`,
      effects: { relationship: 4 },
      depthRequired: 2
    },
    {
      id: 'green-6',
      teaId: 'green-tea',
      text: "Do you live nearby?",
      response: `Oh yes! Just three blocks from your apartment, actually. What a coincidence!`,
      effects: { relationship: 6 },
      depthRequired: 2
    },
    {
      id: 'green-7',
      teaId: 'green-tea',
      text: "Have you been to that new restaurant downtown?",
      response: `Not yet, but I know you went there last Friday with your friends! Did you enjoy the pasta? You had the linguini, correct?`,
      effects: { relationship: 4 },
      depthRequired: 2
    },
    
    // GREEN TEA - Deeper conversation (Depth 3)
    {
      id: 'green-8',
      teaId: 'green-tea',
      text: "You seem to remember a lot about me...",
      response: `Of course I do, dear ${playerName}! I pay attention to the people I care about. I have a whole journal dedicated to our interactions!`,
      effects: { relationship: 4 },
      depthRequired: 3
    },
    {
      id: 'green-9',
      teaId: 'green-tea',
      text: "What do you like to do for fun?",
      response: `Oh, I enjoy cooking, baking, knitting... I made you a sweater! *pulls out a sweater with ${playerName}'s face knitted on it* Surprise!`,
      effects: { relationship: 5 },
      depthRequired: 3
    },
    {
      id: 'green-10',
      teaId: 'green-tea',
      text: "Have you always been this attentive to details?",
      response: `Only with special people, ${playerName}. I have albums of photos of all my past relationships. Would you like to see?`,
      effects: { relationship: 4 },
      depthRequired: 3
    },
    
    // GREEN TEA - Personal (Depth 4)
    {
      id: 'green-11',
      teaId: 'green-tea',
      text: "You remember everything I say, don't you?",
      response: `Of course, dear ${playerName}! Like how you mentioned your favorite color was blue on Tuesday at 3:42 PM, and how you prefer your sandwiches with the crusts cut off, and how you sleep with your window open exactly 3 inches...`,
      effects: { relationship: 4 },
      depthRequired: 4
    },
    {
      id: 'green-12',
      teaId: 'green-tea',
      text: "What are you looking for in a relationship?",
      response: `Someone who'll never leave my side, ${playerName}! Ever! Someone I can take care of forever and ever and ever...`,
      effects: { relationship: 5 },
      depthRequired: 4
    },
    
    // GREEN TEA - Intimate (Depth 5)
    {
      id: 'green-13',
      teaId: 'green-tea',
      text: "I've never met anyone quite like you before.",
      response: `And you never will again, ${playerName}! We're perfect together. I've already planned our next 50 dates!`,
      effects: { relationship: 6 },
      depthRequired: 5
    },
    {
      id: 'green-14',
      teaId: 'green-tea',
      text: "You're my cup of tea, I think.",
      response: `Oh, dear ${playerName}! *claps hands excitedly* I knew we were meant to be together! I'll take such good care of you, forever and ever!`,
      effects: { relationship: 7 },
      depthRequired: 5
    },
    
    // MATCHA - Initial small talk (Depth 1)
    {
      id: 'matcha-1',
      teaId: 'matcha',
      text: "Hi there! I'm glad to meet you.",
      response: "*looks up bleary-eyed* Hey... *checks phone* Sorry, what was your name again?",
      effects: { relationship: 3 },
      depthRequired: 1
    },
    {
      id: 'matcha-2',
      teaId: 'matcha',
      text: "What's your major in college?",
      response: "*yawns* Biochem... I think. Maybe it was Biophysics? *checks phone* Sorry, what was the question?",
      effects: { relationship: 5 },
      depthRequired: 1
    },
    {
      id: 'matcha-3',
      teaId: 'matcha',
      text: "You look really tired. Late night studying?",
      response: `Always... *starts nodding off* Sorry, ${playerName}! I was up all night writing a paper about... uh... something. Coffee doesn't even help anymore.`,
      effects: { relationship: 3 },
      depthRequired: 1
    },
    {
      id: 'matcha-4',
      teaId: 'matcha',
      text: "Nice hoodie. Where'd you get it?",
      response: `Thanks! I have like twenty of these. They're basically my uniform. This one's from... *falls asleep for 3 seconds* ...sorry, ${playerName}, what were we talking about?`,
      effects: { relationship: 6 },
      depthRequired: 1
    },
    
    // MATCHA - Getting to know (Depth 2)
    {
      id: 'matcha-5',
      teaId: 'matcha',
      text: "How many cups of coffee have you had today?",
      response: "*counts on fingers* Seven... no, eight. Wait, does energy drinks count? Then twelve.",
      effects: { relationship: 3 },
      depthRequired: 2
    },
    {
      id: 'matcha-6',
      teaId: 'matcha',
      text: "What are you studying right now?",
      response: "*pulls out textbook* Quantum mechanics... or maybe organic chemistry? The pages are kind of blurry right now.",
      effects: { relationship: 4 },
      depthRequired: 2
    },
    {
      id: 'matcha-7',
      teaId: 'matcha',
      text: "Do you have any hobbies outside of studying?",
      response: "Hobbies? *laughs nervously* Sleep is my hobby now. If I ever get any.",
      effects: { relationship: 6 },
      depthRequired: 2
    },
    
    // MATCHA - Deeper conversation (Depth 3)
    {
      id: 'matcha-8',
      teaId: 'matcha',
      text: "You know you're a cup of tea, right?",
      response: `I'm a what now? *looks confused at ${playerName}* Is that like, some kind of new slang? I'm not up on the latest lingo, too busy with exams...`,
      effects: { relationship: -10 },
      depthRequired: 3
    },
    {
      id: 'matcha-9',
      teaId: 'matcha',
      text: "What do you want to do after college?",
      response: "Sleep for about three years straight. *laughs* Then maybe grad school? My parents expect it. *sighs*",
      effects: { relationship: 5 },
      depthRequired: 3
    },
    {
      id: 'matcha-10',
      teaId: 'matcha',
      text: "Have you always been this dedicated to your studies?",
      response: "*suddenly animated* No! In high school I was in a band! I played bass! It was the best! *deflates* Then college happened.",
      effects: { relationship: 4 },
      depthRequired: 3
    },
    
    // MATCHA - Personal (Depth 4)
    {
      id: 'matcha-11',
      teaId: 'matcha',
      text: "What would you be doing if you weren't in college?",
      response: "*eyes light up* Traveling! Playing music! Actually sleeping sometimes! *wistful sigh* Maybe one day.",
      effects: { relationship: 5 },
      depthRequired: 4
    },
    {
      id: 'matcha-12',
      teaId: 'matcha',
      text: "Does anyone ever tell you to take a break?",
      response: `*looks surprised* All the time, ${playerName}. But how can I? There's always one more paper, one more test... *voice trails off*`,
      effects: { relationship: 4 },
      depthRequired: 4
    },
    
    // MATCHA - Intimate (Depth 5)
    {
      id: 'matcha-13',
      teaId: 'matcha',
      text: "I think you need someone who reminds you to take care of yourself.",
      response: `*looks at ${playerName} with genuine emotion* That... would be nice, actually. Someone who doesn't mind when I fall asleep mid-sentence.`,
      effects: { relationship: 5 },
      depthRequired: 5
    },
    {
      id: 'matcha-14',
      teaId: 'matcha',
      text: "You're my cup of tea, I think.",
      response: `*suddenly fully awake* Wait, really? That's... that's awesome, ${playerName}! *blushes and pulls hoodie strings tight*`,
      effects: { relationship: 6 },
      depthRequired: 5
    },
    
    // CHRYSANTHEMUM - Initial small talk (Depth 1)
    {
      id: 'chrys-1',
      teaId: 'chrysanthemum',
      text: "What a pleasant tea room, don't you think?",
      response: "*sighs softly* Yes, the ambiance reminds me of a cafe in Paris where I once... *trails off, gazing distantly*",
      effects: { relationship: 3 },
      depthRequired: 1
    },
    {
      id: 'chrys-2',
      teaId: 'chrysanthemum',
      text: "You smell nice, like flowers.",
      response: `*sighs softly* Thank you, ${playerName}... the scent reminds me of spring days and... memories that linger like perfume.`,
      effects: { relationship: 5 },
      depthRequired: 1
    },
    {
      id: 'chrys-3',
      teaId: 'chrysanthemum',
      text: "What brings you to tea dating?",
      response: "I suppose I'm searching for something... a connection that makes me feel... *eyes water slightly* I'm sorry, that was too much.",
      effects: { relationship: 4 },
      depthRequired: 1
    },
    
    // CHRYSANTHEMUM - Getting to know (Depth 2)
    {
      id: 'chrys-4',
      teaId: 'chrysanthemum',
      text: "What's your favorite movie?",
      response: `I love romance films... even though they make me cry every time. Sometimes I watch 'The Notebook' just to feel something, you know, ${playerName}?`,
      effects: { relationship: 3 },
      depthRequired: 2
    },
    {
      id: 'chrys-5',
      teaId: 'chrysanthemum',
      text: "Do you write? You seem like someone who would.",
      response: "I... dabble in poetry sometimes. Nothing I'd ever share though. The words are too... personal.",
      effects: { relationship: 6 },
      depthRequired: 2
    },
    {
      id: 'chrys-6',
      teaId: 'chrysanthemum',
      text: "What kind of music speaks to you?",
      response: "*plays with a strand of hair* Melancholy piano pieces, sad love songs... things that ache beautifully.",
      effects: { relationship: 4 },
      depthRequired: 2
    },
    {
      id: 'chrys-7',
      teaId: 'chrysanthemum',
      text: "I notice you wear a locket. Is it special?",
      response: "*touches locket* Yes... *eyes begin to tear up* it contains a memory I'm not ready to forget, even though it hurts to remember.",
      effects: { relationship: 3 },
      depthRequired: 2
    },
    
    // CHRYSANTHEMUM - Deeper conversation (Depth 3)
    {
      id: 'chrys-8',
      teaId: 'chrysanthemum',
      text: "What makes you happy?",
      response: "Small moments... raindrops on windows, the perfect line in a poem, a stranger's kindness. Happiness comes in glimpses for me.",
      effects: { relationship: 5 },
      depthRequired: 3
    },
    {
      id: 'chrys-9',
      teaId: 'chrysanthemum',
      text: "You seem to feel things deeply.",
      response: `*smiles sadly* Too deeply, perhaps. I experience the world like an open wound sometimes, ${playerName}. Everything touches me.`,
      effects: { relationship: 6 },
      depthRequired: 3
    },
    {
      id: 'chrys-10',
      teaId: 'chrysanthemum',
      text: "Tell me about your ex.",
      response: "*eyes immediately well up with tears* I... I... *starts sobbing uncontrollably*",
      effects: { relationship: -100 },
      depthRequired: 3,
      nextScreen: 'game-over' // Special bad ending for Chrysanthemum
    },
    
    // CHRYSANTHEMUM - Personal (Depth 4)
    {
      id: 'chrys-11',
      teaId: 'chrysanthemum',
      text: "Are you afraid of falling in love again?",
      response: "*looking down at hands* Terrified. But also... what else is there in life but to feel, even if it means risking pain?",
      effects: { relationship: 3 },
      depthRequired: 4
    },
    {
      id: 'chrys-12',
      teaId: 'chrysanthemum',
      text: "Sometimes sadness can be beautiful too.",
      response: `*looks at ${playerName} with surprise* Yes... exactly. You understand. Most people just want me to 'cheer up.'`,
      effects: { relationship: 7 },
      depthRequired: 4
    },
    
    // CHRYSANTHEMUM - Intimate (Depth 5)
    {
      id: 'chrys-13',
      teaId: 'chrysanthemum',
      text: "I'd like to read your poetry someday, if you'd share it.",
      response: "*blushes deeply* I... I think I might be able to share it with you. Someday. When I'm brave enough.",
      effects: { relationship: 6 },
      depthRequired: 5
    },
    {
      id: 'chrys-14',
      teaId: 'chrysanthemum',
      text: "You're my cup of tea, I think.",
      response: `*eyes well up with tears* That's the most beautiful thing anyone has said to me since... *wipes away a tear* Thank you for seeing me, ${playerName}.`,
      effects: { relationship: 5 },
      depthRequired: 5
    },
    
    // ROOIBOS - Initial small talk (Depth 1)
    {
      id: 'rooibos-1',
      teaId: 'rooibos',
      text: "Hi there! How's your day going?",
      response: "GREAT! Just came from a 10K run! *high fives* How about you? Staying active?",
      effects: { relationship: 3 },
      depthRequired: 1
    },
    {
      id: 'rooibos-2',
      teaId: 'rooibos',
      text: "Do you play any sports?",
      response: `Baseball's my life, ${playerName}! I've got season tickets—we should go sometime! Nothing beats the crack of the bat and the roar of the crowd!`,
      effects: { relationship: 5 },
      depthRequired: 1
    },
    {
      id: 'rooibos-3',
      teaId: 'rooibos',
      text: "You're very energetic, aren't you?",
      response: "*laughs loudly* You have NO idea! I only sleep like four hours a night because there's too much LIVING to do!",
      effects: { relationship: 3 },
      depthRequired: 1
    },
    {
      id: 'rooibos-4',
      teaId: 'rooibos',
      text: "You look cold. Do you want my jacket?",
      response: `*already taking off their jacket to give to ${playerName}* No, YOU take MINE! I'm totally fine! *visibly shivers*`,
      effects: { relationship: 5 },
      depthRequired: 1
    },
    
    // ROOIBOS - Getting to know (Depth 2)
    {
      id: 'rooibos-5',
      teaId: 'rooibos',
      text: "What's your idea of a perfect date?",
      response: `Early morning jog to watch the sunrise, followed by a protein smoothie! *notices ${playerName}'s expression* Or, you know, maybe a movie? But not horror—I can't handle those!`,
      effects: { relationship: 5 },
      depthRequired: 2
    },
    {
      id: 'rooibos-6',
      teaId: 'rooibos',
      text: "How many sports do you play?",
      response: "*counts on fingers excitedly* Baseball, basketball, rock climbing, marathon running, kayaking... *keeps going* ...and I just started curling last week!",
      effects: { relationship: 7 },
      depthRequired: 2
    },
    {
      id: 'rooibos-7',
      teaId: 'rooibos',
      text: "Do you ever just relax?",
      response: "*looks confused* Relax? Oh, you mean like active relaxation! Like hiking or swimming laps? Love those!",
      effects: { relationship: 4 },
      depthRequired: 2
    },
    
    // ROOIBOS - Deeper conversation (Depth 3)
    {
      id: 'rooibos-8',
      teaId: 'rooibos',
      text: "I noticed a milkshake cup in your bag. Thought you were all about protein shakes?",
      response: `*blushes* Okay, ${playerName}, you caught me! I love milkshakes—especially strawberry ones! But don't tell anyone, I've got a healthy reputation to maintain!`,
      effects: { relationship: 6 },
      depthRequired: 3
    },
    {
      id: 'rooibos-9',
      teaId: 'rooibos',
      text: "Have you always been this energetic?",
      response: "*suddenly quieter* Not always. I was a really shy kid, actually. Sports helped me come out of my shell.",
      effects: { relationship: 5 },
      depthRequired: 3
    },
    {
      id: 'rooibos-10',
      teaId: 'rooibos',
      text: "What do you do when you're not playing sports?",
      response: "I volunteer coaching little league! Those kids are the BEST! And I'm learning to cook healthy meals—still setting off the smoke alarm though!",
      effects: { relationship: 4 },
      depthRequired: 3
    },
    
    // ROOIBOS - Personal (Depth 4)
    {
      id: 'rooibos-11',
      teaId: 'rooibos',
      text: "You seem to care a lot about others.",
      response: `*sincere expression* I do! Life's better when you help people, ${playerName}. Plus, my dad always taught me to look out for others.`,
      effects: { relationship: 6 },
      depthRequired: 4
    },
    {
      id: 'rooibos-12',
      teaId: 'rooibos',
      text: "Do you ever feel like people don't see past your energy?",
      response: "*pauses, becomes uncharacteristically thoughtful* Yeah... people think I'm just the 'fun, energetic one.' There's more to me than that. Thanks for asking.",
      effects: { relationship: 7 },
      depthRequired: 4
    },
    
    // ROOIBOS - Intimate (Depth 5)
    {
      id: 'rooibos-13',
      teaId: 'rooibos',
      text: "I like that you're passionate about life.",
      response: `*warm smile* And I like that you actually listen, ${playerName}. Most people just think I talk too much.`,
      effects: { relationship: 7 },
      depthRequired: 5
    },
    {
      id: 'rooibos-14',
      teaId: 'rooibos',
      text: "You're my cup of tea, I think.",
      response: `Yes! Home run, ${playerName}! *fist pumps* I mean, *composes self* I feel the same way. Want to go for a celebratory jog?`,
      effects: { relationship: 8 },
      depthRequired: 5
    }
  ];
  
  // Initialize dialogue when tea changes or when component mounts
  useEffect(() => {
    // Reset dialogue tracking when tea changes
    setUsedDialogueIds([]);
    setConversationDepth(1);
    
    // Get initial dialogue options
    const initialChoices = getAvailableDialogueOptions([], 1);
    // Limit to 4 unique choices
    const uniqueChoices = getUniqueDialogueChoices(initialChoices, 4);
    setActiveChoices(uniqueChoices);
  }, [tea.id]);
  
  // Update available choices when relationship changes significantly
  useEffect(() => {
    // Adjust depth thresholds - each ~7 points increases depth
    const newDepth = Math.min(5, Math.floor(relationship / 7) + 1);
    if (newDepth > conversationDepth) {
      setConversationDepth(newDepth);
      
      // If we've reached a deeper conversation level, refresh one dialogue option
      if (activeChoices.length < 4) {
        const newOptions = getAvailableDialogueOptions(usedDialogueIds, newDepth);
        if (newOptions.length > 0) {
          // Ensure we don't add a duplicate option
          const uniqueNewOptions = newOptions.filter(option => 
            !activeChoices.some(activeChoice => activeChoice.text === option.text)
          );
          
          if (uniqueNewOptions.length > 0) {
            setActiveChoices([...activeChoices, uniqueNewOptions[0]]);
          }
        }
      }
    }
  }, [relationship, conversationDepth, usedDialogueIds, activeChoices]);
  
  // Handle player selecting a dialogue choice
  const handleChoiceSelection = (choice) => {
    // Mark this dialogue as used
    setUsedDialogueIds([...usedDialogueIds, choice.id]);
    
    // Find a replacement dialogue option
    const replacementOptions = getAvailableDialogueOptions(
      [...usedDialogueIds, choice.id], 
      conversationDepth
    );
    
    // Filter out any replacement options that have the same text as remaining active choices
    const uniqueReplacements = replacementOptions.filter(option => 
      !activeChoices.some(c => c.id !== choice.id && c.text === option.text)
    );
    
    // Replace the used choice with a new one if available
    if (uniqueReplacements.length > 0) {
      const newActiveChoices = activeChoices.map(c => 
        c.id === choice.id ? uniqueReplacements[0] : c
      );
      setActiveChoices(newActiveChoices);
    } else {
      // Remove the choice if no replacements are available
      const newActiveChoices = activeChoices.filter(c => c.id !== choice.id);
      setActiveChoices(newActiveChoices);
    }
    
    // Process the response - if it's a function, call it with playerName
    const finalResponse = typeof choice.response === 'function' 
      ? choice.response(playerName)
      : choice.response;
    
    // Pass the choice to the parent component's makeChoice function
    makeChoice({
      text: choice.text,
      response: finalResponse,
      effects: choice.effects,
      nextScreen: choice.nextScreen
    });
  };

  // Helper function to get unique dialogue choices
  const getUniqueDialogueChoices = (options, count) => {
    const result = [];
    const textSet = new Set();
    
    for (const option of options) {
      if (!textSet.has(option.text) && result.length < count) {
        result.push(option);
        textSet.add(option.text);
      }
      
      if (result.length >= count) break;
    }
    
    return result;
  };

  // Get dialogue options based on tea type, relationship level, and used options
  const getAvailableDialogueOptions = (usedIds, depth) => {
    // Filter the master dialogue list by:
    // 1. Tea type matches current tea
    // 2. Dialogue hasn't been used yet
    // 3. Relationship/depth requirement is met
    
    const availableOptions = allDialogueOptions.filter(option => 
      option.teaId === tea.id && 
      !usedIds.includes(option.id) &&
      option.depthRequired <= depth
    );
    
    // Sort by depth (so we get the most appropriate ones for the current depth)
    return availableOptions.sort((a, b) => a.depthRequired - b.depthRequired);
  };
  
  // Render dialogue choices
  return (
    <div className="dialogue-container">
      <h3>What would you like to discuss?</h3>
      <div className="choices-list">
        {activeChoices.map((choice) => (
          <button 
            key={choice.id} 
            className="choice-button"
            onClick={() => handleChoiceSelection(choice)}
          >
            {choice.text}
          </button>
        ))}
        
        {/* Special choice for selecting this tea, only if relationship is high enough */}
        {relationship >= 60 && (
          <button 
            className="choice-button final-choice"
            onClick={() => makeChoice({
              text: "I'd like to choose you as my tea match right now.",
              response: getFinalChoiceResponse(tea.id, playerName),
              effects: { relationship: 10 },
              nextScreen: 'game-over'
            })}
          >
            I'd like to choose you as my tea match right now.
          </button>
        )}
      </div>
    </div>
  );
};


// Helper function for tea-specific final choice responses
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

export default DialogueSystem;