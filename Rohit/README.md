
# Liar's Dice

## Introduction
This project is by Rohit Mandapati and Justin Shi. We used the Godot Engine to recreate the game Liar's Dice. This project is almost entirely written in Godot Script (.gd), In this game, the player faces off against 4 AI players, dynamically created each game so that no game ever feels the same. Learn your opponents and figure out their patterns, learn how risky or safe they play.


## Gameplay
Each player starts with 6 dice that are rolled at the start of the round. Each player can only view their own dice and is in charge of mentally keeping track of how many total dice there are on the board. The AI and game difficulty scale with the difficulty selected at the beginning. Each player had to either make an assertion (or a "bid") about how many dice are on the board of a certain face. If the next player deems that it's too unlikely, they can challenge the previous player's assertion. Everyone then reveals their dice. If the bid was indeed correct, the challenger loses a die, but if the bid was wrong, then player that made the bid loses a die. The last player remaining with dice wins the game. The game can be boiled down largely to probability. Good luck!

Video Demo: 

## Getting Started
To play this, once you've downloaded the the repository, it's as simple as running the executable. If you are on Windows, run Liars Dice.exe and if you're on MacOS, run Liars Dice.dmg. There is a rule book in game that explains the game. Good luck!
